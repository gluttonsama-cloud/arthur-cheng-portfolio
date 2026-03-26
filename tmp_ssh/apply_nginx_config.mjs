import { Client } from 'ssh2';
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
  conn.exec(`cat > /www/server/panel/vhost/nginx/arthur-portfolio.conf <<EOF\n${config}\nEOF\n`, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
      console.log('Config written');
      conn.exec('nginx -s reload', (err, stream) => {
        if (err) throw err;
        stream.on('close', () => {
          console.log('Nginx reloaded');
          conn.end();
        });
      });
    });
  });
}).connect({
  host: '159.75.45.241',
  port: 22,
  username: 'root',
  password: 'Cheng13597549039'
});
