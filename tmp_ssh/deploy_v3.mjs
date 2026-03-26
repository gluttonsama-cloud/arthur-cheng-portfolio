import { Client } from 'ssh2';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';

const conn = new Client();

async function deploy() {
  // 1. Create zip
  const output = fs.createWriteStream('dist_v3.zip');
  const archive = archiver('zip', { zlib: { level: 9 } });
  
  return new Promise((resolve, reject) => {
    output.on('close', () => {
      console.log('Zip created');
      
      conn.on('ready', () => {
        console.log('Client :: ready');
        conn.sftp((err, sftp) => {
          if (err) throw err;
          
          // Upload Dist Zip
          const readStream = fs.createReadStream('dist_v3.zip');
          const writeStream = sftp.createWriteStream('/www/wwwroot/arthur-portfolio/dist_v3.zip');
          
          writeStream.on('close', () => {
            console.log('Uploaded dist_v3.zip');
            
            // Upload Nginx Config
            const confRead = fs.createReadStream('tmp_ssh/arthur-portfolio.conf');
            const confWrite = sftp.createWriteStream('/www/wwwroot/arthur-portfolio/arthur-portfolio.conf');
            
            confWrite.on('close', () => {
                console.log('Uploaded arthur-portfolio.conf');

                // Execute Unzip and Nginx Reload
                const cmd = [
                    'cd /www/wwwroot/arthur-portfolio',
                    'unzip -o dist_v3.zip',
                    'rm dist_v3.zip',
                    'cp arthur-portfolio.conf /www/server/panel/vhost/nginx/arthur-portfolio.conf',
                    '/www/server/nginx/sbin/nginx -t && /www/server/nginx/sbin/nginx -s reload'
                ].join(' && ');

                conn.exec(cmd, (err, stream) => {
                  if (err) throw err;
                  stream.on('close', (code) => {
                    console.log(`Remote command finished with code ${code}`);
                    conn.end();
                    resolve();
                  });
                  stream.stdout.on('data', (d) => console.log(''+d));
                  stream.stderr.on('data', (d) => console.error(''+d));
                });
            });
            confRead.pipe(confWrite);
          });
          
          readStream.pipe(writeStream);
        });
      }).connect({
        host: '159.75.45.241',
        port: 22,
        username: 'root',
        password: 'Cheng13597549039'
      });
    });
    
    archive.pipe(output);
    archive.directory('dist/', false);
    archive.finalize();
  });
}

deploy().then(() => console.log('Deployment v3 complete')).catch(console.error);
