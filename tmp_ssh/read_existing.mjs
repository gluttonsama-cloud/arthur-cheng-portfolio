import { Client } from 'ssh2';
const conn = new Client();
conn.on('ready', () => {
  conn.exec('cat /www/server/panel/vhost/nginx/0.default.conf; echo "---"; cat /www/server/panel/vhost/nginx/arthurcheng-ys.space.conf', (err, stream) => {
    if (err) throw err;
    let data = '';
    stream.on('data', (chunk) => data += chunk);
    stream.on('close', () => {
      console.log(data);
      conn.end();
    });
  });
}).connect({
  host: '159.75.45.241',
  port: 22,
  username: 'root',
  password: 'Cheng13597549039'
});
