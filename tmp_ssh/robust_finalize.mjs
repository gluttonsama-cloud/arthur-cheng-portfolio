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
  const commands = [
    '[ -f /www/server/panel/vhost/nginx/0.default.conf ] && mv /www/server/panel/vhost/nginx/0.default.conf /www/server/panel/vhost/nginx/0.default.conf.bak || echo "0.default.conf not found or already moved"',
    '[ -f /www/server/panel/vhost/nginx/wordpress.local.conf ] && mv /www/server/panel/vhost/nginx/wordpress.local.conf /www/server/panel/vhost/nginx/wordpress.local.conf.bak || echo "wordpress.local.conf not found or already moved"',
  ];

  const execPromise = (cmd) => new Promise((resolve) => {
    conn.exec(cmd, (err, stream) => {
      if (err) resolve();
      stream.on('close', () => resolve());
      stream.stdout.on('data', (d) => console.log(''+d));
      stream.stderr.on('data', (d) => console.error(''+d));
    });
  });

  async function run() {
    for (const cmd of commands) await execPromise(cmd);
    
    conn.sftp((err, sftp) => {
      if (err) throw err;
      const ws = sftp.createWriteStream('/www/server/panel/vhost/nginx/arthur-portfolio.conf');
      ws.on('close', async () => {
        console.log('Config uploaded');
        await execPromise('nginx -t');
        await execPromise('/etc/init.d/nginx reload');
        console.log('All done');
        conn.end();
      });
      ws.end(config);
    });
  }
  run();
}).connect({
  host: '159.75.45.241',
  port: 22,
  username: 'root',
  password: 'Cheng13597549039'
});
