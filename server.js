const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const firebaseHost = 'naamin-bfc7a.firebaseapp.com';
const mime = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function proxyFirebaseHelper(req, res) {
  const upstream = https.request(
    {
      protocol: 'https:',
      hostname: firebaseHost,
      port: 443,
      path: req.url,
      method: req.method,
      headers: {
        ...req.headers,
        host: firebaseHost
      }
    },
    (upstreamRes) => {
      const headers = { ...upstreamRes.headers };
      delete headers['content-encoding'];
      delete headers['content-length'];
      delete headers['transfer-encoding'];

      res.writeHead(upstreamRes.statusCode || 502, headers);
      upstreamRes.pipe(res);
    }
  );

  upstream.on('error', () => {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Firebase auth helper could not be reached.');
  });

  if (req.method === 'GET' || req.method === 'HEAD') {
    upstream.end();
    return;
  }

  req.pipe(upstream);
}

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];

  if (urlPath === '/__naamin-auth-ready') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end();
    return;
  }

  if (urlPath.startsWith('/__/')) {
    proxyFirebaseHelper(req, res);
    return;
  }

  if (urlPath === '/naaminlet1' || urlPath === '/naaminlet1/') {
    urlPath = '/index.html';
  } else if (urlPath.startsWith('/naaminlet1/')) {
    urlPath = urlPath.replace('/naaminlet1', '');
  }

  if (urlPath === '/' || urlPath === '') urlPath = '/index.html';
  const filePath = path.join(root, decodeURIComponent(urlPath));

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.setHeader('Content-Type', mime[ext] || 'application/octet-stream');
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Server running on http://localhost:8000');
});
