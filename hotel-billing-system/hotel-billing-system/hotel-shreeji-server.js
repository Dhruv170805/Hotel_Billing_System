// Shreeji Restaurant Standalone Server
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3333;
const BUILD_DIR = path.join(__dirname, 'build');

// MIME types for different file extensions
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Create HTTP Server
const server = http.createServer((req, res) => {
  console.log(`📝 ${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);

  let filePath = path.join(BUILD_DIR, req.url === '/' ? 'index.html' : req.url);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    // Serve index.html for React Router (SPA)
    filePath = path.join(BUILD_DIR, 'index.html');
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code == 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
          <head><title>Shreeji Restaurant - Page Not Found</title></head>
          <body style="font-family: Arial; text-align: center; padding: 50px; background: linear-gradient(135deg, #9bd32f, #7db446);">
            <div style="background: white; border-radius: 20px; padding: 40px; max-width: 500px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
              <div style="font-size: 60px; margin-bottom: 20px;">🍽️</div>
              <h1 style="color: #9bd32f; margin: 0 0 10px 0;">श्रीजी Restaurant</h1>
              <h2 style="color: #dc2626; margin: 0 0 20px 0;">404 - Page Not Found</h2>
              <p style="color: #666; margin-bottom: 30px;">The requested page could not be found.</p>
              <a href="/" style="display: inline-block; background: #9bd32f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">← Go Back to Home</a>
            </div>
          </body>
          </html>
        `, 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': mimeType });
      res.end(content, 'utf-8');
    }
  });
});

// Start Server
server.listen(PORT, () => {
  console.log('\n🍽️ ========================================');
  console.log('         SHREEJI RESTAURANT SYSTEM');
  console.log('========================================');
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`📅 Started: ${new Date().toLocaleString()}`);
  console.log('📱 Status: Ready for restaurant operations!');
  console.log('========================================\n');
  
  // Auto-open browser after 2 seconds
  setTimeout(() => {
    const url = `http://localhost:${PORT}`;
    console.log(`🌐 Opening Shreeji Restaurant in your default browser...`);
    
    // Cross-platform browser opening
    const start = (process.platform == 'darwin' ? 'open' : 
                   process.platform == 'win32' ? 'start' : 'xdg-open');
    exec(`${start} ${url}`);
  }, 2000);
});

// Handle server shutdown gracefully
process.on('SIGINT', () => {
  console.log('\n💾 Shutting down Shreeji Restaurant server...');
  console.log('✅ Shreeji Restaurant server stopped safely.');
  process.exit(0);
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Server Error:', error);
  console.log('🔄 Please restart Shreeji Restaurant application.');
});

console.log('⏳ Starting Shreeji Restaurant Billing System...');