import * as childProcess from 'child_process';

export interface TunInfo {
  inet: string;
  peer: string;
}

export function getTunAddress(name: string): Promise<TunInfo> {
  const process = childProcess.spawn(
    'ip',
    [
      'addr', 'show', 'dev', name
    ],
    {
      stdio: ['ignore', 'pipe', 'ignore']
    }
  );
  return new Promise<TunInfo>((resolve, reject) => {
    let out: string = '';
    process
      .on('error', (e) => reject(e))
      .on('exit', (code) => {
        if (code === 0) {
          let result: TunInfo = {} as any;
          out
            .split('\n')
            .map(v => v.trim())
            .forEach((line) => {
              const m = /^inet (\d+\.\d+\.\d+\.\d+) peer (\d+\.\d+\.\d+\.\d+)/.exec(line);
              if (m) {
                result.inet = m[1];
                result.peer = m[2];
              }
            });
          resolve(result);
        } else {
          reject(new Error(`exit code = ${code}`));
        }
      });
    process.stdout
      .on('data', (data) => {
        out += data;
      });
  });
}
