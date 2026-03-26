import { Client } from 'ssh2';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';

const conn = new Client();

async function deploy() {
  // 1. Create zip
  const output = fs.createWriteStream('dist_v2.zip');
  const archive = archiver('zip', { zlib: { level: 9 } });
  
  return new Promise((resolve, reject) => {
    output.on('close', () => {
      console.log('Zip created');
      
      conn.on('ready', () => {
        console.log('Client :: ready');
        conn.sftp((err, sftp) => {
          if (err) throw err;
          
          const readStream = fs.createReadStream('dist_v2.zip');
          const writeStream = sftp.createWriteStream('/www/wwwroot/arthur-portfolio/dist_v2.zip');
          
          writeStream.on('close', () => {
            console.log('Uploaded dist_v2.zip');
            
            conn.exec('cd /www/wwwroot/arthur-portfolio && unzip -o dist_v2.zip && rm dist_v2.zip', (err, stream) => {
              if (err) throw err;
              stream.on('close', () => {
                console.log('Unzipped and cleaned up');
                conn.end();
                resolve();
              });
              stream.stdout.on('data', (d) => console.log(''+d));
              stream.stderr.on('data', (d) => console.error(''+d));
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
    });
    
    archive.pipe(output);
    archive.directory('../dist/', false);
    archive.finalize();
  });
}

deploy().then(() => console.log('Deployment complete')).catch(console.error);
