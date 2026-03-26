import { Client } from 'ssh2';
import fs from 'fs';

const conn = new Client();
const config = `server {
    listen 80;
    server_name 159.75.45.241;
    root /www/wwwroot/arthur-portfolio;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    access_log  /www/wwwlogs/arthur-portfolio.log;
    error_log   /www/wwwlogs/arthur-portfolio.error.log;
}`;

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const writeStream = sftp.createWriteStream('/www/server/panel/vhost/nginx/arthur-portfolio.conf');
    writeStream.on('close', () => {
      console.log('Config uploaded');
      conn.exec('nginx -t', (err, stream) => {
        if (err) throw err;
        stream.stderr.on('data', (data) => console.error(''+data));
        stream.on('close', (code) => {
          if (code === 0) {
            conn.exec('/etc/init.d/nginx reload', (err, stream) => {
              if (err) throw err;
              stream.on('close', () => {
                console.log('Nginx reloaded');
                conn.end();
              });
            });
          } else {
            console.error('Nginx test failed');
            conn.end();
          }
        });
      });
    });
    writeStream.end(config);
  });
}).connect({
  host: '159.75.45.241',
  port: 22,
  username: 'root',
  password: 'Cheng13597549039'
});
