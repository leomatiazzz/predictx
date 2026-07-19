import fs from 'fs';
import https from 'https';

const url = 'https://raw.githubusercontent.com/txodds/tx-on-chain/main/examples/devnet/idl/txoracle.json';
const dest = 'c:/Users/Leo/Downloads/predictx/src/services/txline/txoracle.json';

https.get(url, (res) => {
  if (res.statusCode !== 200) {
    console.error('Failed to download:', res.statusCode);
    process.exit(1);
  }
  const file = fs.createWriteStream(dest);
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('IDL downloaded to', dest);
  });
}).on('error', (err) => {
  console.error('Error downloading:', err.message);
  process.exit(1);
});
