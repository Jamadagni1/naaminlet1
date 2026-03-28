const http = require('http');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT) || 3000;
const mime = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/' || urlPath === '') urlPath = '/index.html';
  const decodedPath = decodeURIComponent(urlPath);
  const absolutePath = path.resolve(root, `.${decodedPath}`);

  if (!absolutePath.startsWith(path.resolve(root))) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  fs.stat(absolutePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }
    const ext = path.extname(absolutePath).toLowerCase();
    res.setHeader('Content-Type', mime[ext] || 'application/octet-stream');
    fs.createReadStream(absolutePath).pipe(res);
  });
});

server.listen(port, host, () => {
  console.log(`Server running on http://localhost:${port}`);
});
