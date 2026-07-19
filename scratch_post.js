const https = require('https');

const options = {
  hostname: 'txline-dev.txodds.com',
  port: 443,
  path: '/auth/guest/start',
  method: 'POST'
};

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error(error);
});

req.end();
