import { Client } from 'ssh2';

const conn = new Client();
const config = `server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
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
  // First, rename the conflicting config
  conn.exec('mv /www/server/panel/vhost/nginx/wordpress.local.conf /www/server/panel/vhost/nginx/wordpress.local.conf.bak', (err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
      console.log('WordPress config backed up');
      // Then, upload new config
      conn.sftp((err, sftp) => {
        if (err) throw err;
        const writeStream = sftp.createWriteStream('/www/server/panel/vhost/nginx/arthur-portfolio.conf');
        writeStream.on('close', () => {
          console.log('Portfolio config uploaded');
          conn.exec('/etc/init.d/nginx reload', (err, stream) => {
            if (err) throw err;
            stream.on('close', () => {
              console.log('Nginx reloaded');
              conn.end();
            });
          });
        });
        writeStream.end(config);
      });
    });
  });
}).connect({
  host: '159.75.45.241',
  port: 22,
  username: 'root',
  password: 'Cheng13597549039'
});
