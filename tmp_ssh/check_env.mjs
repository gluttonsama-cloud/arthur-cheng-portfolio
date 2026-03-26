import { Client } from 'ssh2';
const conn = new Client();
conn.on('ready', () => {
  conn.exec('ls -ld /www/wwwroot/arthur-portfolio; grep -r "default_server" /www/server/nginx/conf/', (err, stream) => {
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
