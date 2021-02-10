import * as childProcess from 'child_process';
import * as util from 'util';
import * as fs from 'fs';
import {ApplicationOptions} from './config';
import {
  HaiipConnectionManager
} from './haiip-cm';

function exchangeAppMain(applicationOptions: ApplicationOptions) {
  const cm = new HaiipConnectionManager({
    serverHost: applicationOptions.server,
    username: applicationOptions.username,
    localHostname: applicationOptions.hostname,
    tunLocalIp: applicationOptions.tunLocalIp
  });
}

function fixDebugArgument(args: string[]): string[] {
  const clone = args.slice(0, args.length);
  while(clone[0].endsWith('bin.js') || clone[0].endsWith('/node')) {
    clone.shift();
  }
  return clone;
}

export function startExchangeApp(applicationOptions: ApplicationOptions) {
  const fixedArguments = fixDebugArgument(applicationOptions.startupArguments);
  if (applicationOptions.forked) {
    if (process.send) {
      process.send({
        type: 'startup'
      });
    }
    return exchangeAppMain(applicationOptions);
  } else {
    const child = childProcess.fork(
      fixedArguments[0],
      [
        ...fixedArguments.slice(1),
        '--fork',
        ...applicationOptions.applicationArguments
      ],
      {
        detached: true
      }
    );
    return util.promisify(fs.writeFile)(applicationOptions.pidFile, child.pid.toString())
      .then(() => new Promise<void>((resolve, reject) => {
        child
          .on('error', (e) => {
            reject(e);
          })
          .on('message', (msg) => {
            if (child.channel) child.channel.unref();
            child.unref();
            resolve();
          });
      }));
  }
}

export function stopExchangeApp(applicationOptions: ApplicationOptions) {
  if (fs.existsSync(applicationOptions.pidFile)) {
    return util.promisify(fs.readFile)(applicationOptions.pidFile, { encoding: 'utf8' })
      .then((data: string) => {
        const pid = parseInt(data.trim());
        console.log('pid = ' + pid);
        try {
          process.kill(pid, 'SIGKILL');
        } catch(e) {
          console.error(e);
          process.exit(1);
        }
        console.log('kill success');
      });
  }
}
