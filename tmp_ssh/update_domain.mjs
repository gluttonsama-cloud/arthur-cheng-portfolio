import { Client } from 'ssh2';

const conn = new Client();
const newConfig = `server {
    listen 80;
    listen 443 ssl;
    listen [::]:443 ssl;

    server_name arthurcheng-ys.space;
    server_tokens off;
    keepalive_timeout 10;

    ssl_certificate /www/server/panel/vhost/nginx/certificates/arthurcheng-ys.space_bundle.crt;
    ssl_certificate_key /www/server/panel/vhost/nginx/certificates/arthurcheng-ys.space.key;
    ssl_session_timeout 5m;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
    ssl_prefer_server_ciphers on;

    index index.html;
    root /www/wwwroot/arthur-portfolio;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 禁止访问的文件或目录
    location ~ ^/(\\.user.ini|\\.htaccess|\\.git|\\.svn|\\.project|LICENSE|README.md) {
       return 404;
    }

    location ~ \\.well-known {
       allow all;
    }

    access_log  "/www/wwwlogs/arthurcheng-ys.space.log";
    error_log  "/www/wwwlogs/arthurcheng-ys.space.error.log";
}
`;

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const ws = sftp.createWriteStream('/www/server/panel/vhost/nginx/arthurcheng-ys.space.conf');
    ws.on('close', () => {
      console.log('Domain config updated');
      conn.exec('nginx -t && /etc/init.d/nginx reload', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code) => {
          console.log('Nginx updated with code ' + code);
          conn.end();
        });
        stream.stdout.on('data', (d) => console.log(''+d));
        stream.stderr.on('data', (d) => console.error(''+d));
      });
    });
    ws.end(newConfig);
  });
}).connect({
  host: '159.75.45.241',
  port: 22,
  username: 'root',
  password: 'Cheng13597549039'
});
