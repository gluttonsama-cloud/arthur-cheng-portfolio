import { Client } from 'ssh2';
import fs from 'fs';

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const readStream = fs.createReadStream('arthur-portfolio.conf');
    const writeStream = sftp.createWriteStream('/www/server/panel/vhost/nginx/arthur-portfolio.conf');

    writeStream.on('close', () => {
      console.log('Config uploaded');
      conn.exec('/etc/init.d/nginx reload', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
          console.log('Nginx reloaded with code ' + code);
          conn.end();
        });
        stream.stdout.on('data', (data) => console.log('STDOUT: ' + data));
        stream.stderr.on('data', (data) => console.error('STDERR: ' + data));
      });
    });

    readStream.pipe(writeStream);
  });
}).connect({
  host: '159.75.45.241',
  port: 22,
  username: 'root',
  password: 'Cheng13597549039'
});
