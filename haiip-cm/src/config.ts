export interface ApplicationOptions {
  startupArguments: string[];
  applicationArguments: string[];
  forked: boolean;
  pidFile: string;
  configFile: string;
  name: string;
  server: string;
  username: string;
  hostname: string;
  tunInterface: string;
  tunLocalIp: string;
  cmCommand: string;
}
