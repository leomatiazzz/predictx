const fs = require('fs');
const https = require('https');

const url = 'https://raw.githubusercontent.com/txodds/tx-on-chain/main/examples/devnet/common/users.ts';
const dest = 'c:\\Users\\Leo\\Downloads\\predictx\\scratch_users.ts';

https.get(url, (res) => {
  const file = fs.createWriteStream(dest);
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Downloaded');
  });
}).on('error', (err) => {
  console.log('Error:', err.message);
});
