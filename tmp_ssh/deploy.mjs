import { Client } from 'ssh2';
import fs from 'fs';
import path from 'path';

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const readStream = fs.createReadStream('../dist.zip');
    const writeStream = sftp.createWriteStream('/tmp/dist.zip');

    writeStream.on('close', () => {
      console.log('File transferred successfully');
      conn.exec('mkdir -p /www/wwwroot/arthur-portfolio && unzip -o /tmp/dist.zip -d /www/wwwroot/arthur-portfolio', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
          console.log('Unzipped successfully with code ' + code);
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
