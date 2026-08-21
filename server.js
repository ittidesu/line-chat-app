#!/usr/bin/env node

const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

// Create a simple static file server for the build folder
const server = http.createServer((req, res) => {
  // Default to index.html for all routes (SPA routing)
  let filePath = path.join(__dirname, 'build', req.url);
  
  // If requesting root or directory, serve index.html
  if (req.url === '/' || req.url.endsWith('/')) {
    filePath = path.join(__dirname, 'build', 'index.html');
  }
  
  // Try to serve the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      // If file not found, serve index.html for SPA routing
      fs.readFile(path.join(__dirname, 'build', 'index.html'), (err, content) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content, 'utf-8');
      });
    } else {
      // Determine content type
      let contentType = 'text/html';
      if (filePath.endsWith('.js')) contentType = 'application/javascript';
      else if (filePath.endsWith('.css')) contentType = 'text/css';
      else if (filePath.endsWith('.json')) contentType = 'application/json';
      else if (filePath.endsWith('.png')) contentType = 'image/png';
      else if (filePath.endsWith('.jpg')) contentType = 'image/jpeg';
      else if (filePath.endsWith('.gif')) contentType = 'image/gif';
      else if (filePath.endsWith('.svg')) contentType = 'image/svg+xml';
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
