import * as os from 'os';
import * as util from 'util';
import * as fs from 'fs';
import {generateOvpnConfig} from './haiip-ovpn';
import {ApplicationOptions} from './config';
import {getTunAddress} from './ip-util';
import {startExchangeApp, stopExchangeApp} from './service';

interface ArgumentOption {
  name: string;
  message: string;
  valueName?: string;
  hasValue: boolean;
  handler: (v: string) => void;
}

enum ApplicationMode {
  Help,
  GenerateConfig,
  Exchange,
  ExchangeDown
}

let applicationMode: ApplicationMode = ApplicationMode.Help;
const applicationOptions: ApplicationOptions = {
  configFile: '',
  startupArguments: [],
  applicationArguments: [],
  forked: false,
  pidFile: '',
  name: process.env.HAIIP_NAME || 'haiip',
  server: process.env.HAIIP_SERVER || 'hai-ip1.haion.net',
  username: process.env.HAIIP_USERNAME || '',
  hostname: process.env.OVERRIDE_HOSTNAME || os.hostname(),
  tunInterface: process.env.TUN_INTERFACE || '',
  tunLocalIp: '',
  cmCommand: process.env.CM_COMMAND || ''
};

const ARGUMENTS: ArgumentOption[] = [
  {
    // help
    name: 'help',
    message: 'show help message',
    hasValue: false,
    handler: () => {
      applicationMode = ApplicationMode.Help;
    }
  },
  {
    // OpenVPN 설정 생성
    name: 'generate-ovpn',
    message: 'generate openvpn configuration',
    hasValue: false,
    handler: () => {
      applicationMode = ApplicationMode.GenerateConfig;
    }
  },
  {
    // 교환기 연결 모드
    name: 'exchange',
    message: 'connect exchange server',
    hasValue: false,
    handler: () => {
      applicationMode = ApplicationMode.Exchange;
    }
  },
  {
    // OpenVPN Up Script (exchange mode)
    name: 'ovpn-up',
    message: 'connect exchange server',
    hasValue: false,
    handler: () => {
      applicationMode = ApplicationMode.Exchange;
    }
  },
  {
    // OpenVPN Down Script (exchange mode)
    name: 'ovpn-down',
    message: 'disconnect exchange server',
    hasValue: false,
    handler: () => {
      applicationMode = ApplicationMode.ExchangeDown;
    }
  },
  {
    name: 'fork',
    message: '(internal) forked',
    hasValue: false,
    handler: (v) => {
      applicationOptions.forked = true;
    }
  },
  {
    name: 'name',
    message: 'instance name',
    hasValue: true,
    handler: (v) => {
      applicationOptions.name = v;
    }
  },
  {
    name: 'config',
    message: 'config file path',
    hasValue: true,
    handler: (v) => {
      applicationOptions.configFile = v;
    }
  },
  {
    name: 'pid-file',
    message: 'pid file path',
    hasValue: true,
    handler: (v) => {
      applicationOptions.pidFile = v;
    }
  },
  {
    name: 'server',
    message: 'server',
    hasValue: true,
    handler: (v) => {
      applicationOptions.server = v;
    }
  },
  {
    name: 'username',
    message: 'haiip username',
    hasValue: true,
    handler: (v) => {
      applicationOptions.username = v;
    }
  },
  {
    name: 'hostname',
    message: 'override hostname',
    hasValue: true,
    handler: (v) => {
      applicationOptions.hostname = v;
    }
  },
  {
    name: 'tun-interface',
    message: 'tun interface',
    hasValue: true,
    handler: (v) => {
      applicationOptions.tunInterface = v;
    }
  }
];
const ARGUMENTS_MAP: Record<string, ArgumentOption> = ARGUMENTS.reduce((prev, cur) => {
  prev[cur.name] = cur;
  return prev;
}, {});

const inputArguments: Record<string, [ArgumentOption, string]> = {};

function parseArguments() {
  return Promise.resolve()
    .then(() => {
      let argStarted = false;
      for (let i = 0; i < process.argv.length; i++) {
        const item = process.argv[i];
        if (item.startsWith('-')) {
          if (!argStarted) {
            applicationOptions.applicationArguments = process.argv.slice(i);
          }
          argStarted = true;
        }
        if (argStarted) {
          const m = /^--([^=]+)(=(.*))?$/.exec(item);
          if (m) {
            const a = ARGUMENTS_MAP[m[1]];
            if (a) {
              let value: any;
              if (a.hasValue) {
                if (m[3]) {
                  value = m[3];
                } else {
                  value = process.argv[++i];
                }
                inputArguments[a.name] = [a, value];
              } else {
                inputArguments[a.name] = [a, 'yes'];
              }
              if (a.name === 'ovpn-up') {
                // tun_dev tun_mtu link_mtu ifconfig_local_ip ifconfig_remote_ip init/restart
                const tunInterface = process.argv[++i]; // tun0
                const dummy0 = process.argv[++i]; // 1500
                const dummy1 = process.argv[++i]; // 1544
                const tunLocalIp = process.argv[++i];
                const tunRemoteIp = process.argv[++i];
                const upType = process.argv[++i];

                applicationOptions.tunInterface = tunInterface;
                applicationOptions.tunLocalIp = tunLocalIp;
                if (upType === 'restart') {
                  process.exit(0);
                }
              }
              else if (a.name === 'ovpn-down') {
                break;
              }
            }
          } else {
            console.error(`Unknown argument: ${i}: ${item}`);
          }
        } else {
          applicationOptions.startupArguments.push(item);
        }
      }
    })
    .then(() => {
      if (inputArguments['config']) {
        return util.promisify(fs.readFile)(inputArguments['config'][1], { encoding: 'utf8' })
          .then((data: string) => {
            data.split('\n')
              .map((v) => v.trim())
              .filter((v) => (!/^[;#]/.test(v)) && (/^[^=]+=.*/.test(v)))
              .forEach((v) => {
                const pos = v.indexOf('=');
                const key = v.substring(0, pos);
                const value = v.substring(pos + 1) || 'yes';
                const a = ARGUMENTS_MAP[key];
                if (a && !inputArguments[a.name]) {
                  inputArguments[a.name] = [a, value];
                }
              });
          });
      }
    })
    .then(() => {
      Object.keys(inputArguments)
        .forEach((key) => {
          const [a, value] = inputArguments[key];
          a.handler(value);
        });
    });
}

function showHelp() {
  interface TempKV {
    arg: string;
    msg: string;
  }

  const descriptions: TempKV[] = [];
  let maxSize = 0;

  ARGUMENTS
    .forEach((item) => {
      let text: string = `--${item.name}`;
      if (item.hasValue) {
        text += `=${item.valueName || 'VALUE'}`;
      }
      maxSize = Math.max(maxSize, text.length);
      descriptions.push({
        arg: text,
        msg: item.message
      });
    });

  maxSize += 2;

  console.log(process.argv[0] + ' ARGUMENTS');
  console.log('');
  descriptions
    .forEach((item) => {
      let text = item.arg + ' '.repeat(maxSize - item.arg.length);
      text += item.msg;
      console.log(text);
    });
  console.log('');
}

parseArguments()
  .then(() => {
    if (!applicationOptions.pidFile) {
      const defaultPidFile = `/tmp/haiipcm-${applicationOptions.name}.pid`;
      applicationOptions.pidFile = process.env.PID_FILE || defaultPidFile;
    }
    if (applicationMode === ApplicationMode.GenerateConfig) {
      return generateOvpnConfig(applicationOptions);
    } else if (applicationMode === ApplicationMode.Exchange) {
      return Promise.resolve()
        .then(() => {
          if (!applicationOptions.tunLocalIp) {
            return getTunAddress(applicationOptions.tunInterface)
              .then((info) => applicationOptions.tunLocalIp = info.inet);
          }
        })
        .then(() => startExchangeApp(applicationOptions));
    } else if (applicationMode === ApplicationMode.ExchangeDown) {
      return stopExchangeApp(applicationOptions);
    } else {
      return showHelp();
    }
  });
