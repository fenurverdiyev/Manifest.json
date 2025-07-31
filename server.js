const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
    console.log(`📥 ${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
    
    // Enable CORS for API requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                console.log(`❌ 404 - Fayl tapılmadı: ${filePath}`);
                // File not found
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <html>
                        <head><title>404 - Not Found</title></head>
                        <body>
                            <h1>404 - Fayl tapılmadı</h1>
                            <p>Axtardığınız səhifə mövcud deyil.</p>
                            <a href="/">Ana səhifəyə qayıt</a>
                        </body>
                    </html>
                `);
            } else {
                console.log(`❌ Server xətası: ${error.code}`);
                // Server error
                res.writeHead(500);
                res.end(`Server xətası: ${error.code}`);
            }
        } else {
            console.log(`✅ Uğurla göndərildi: ${filePath} (${contentType})`);
            // Success
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Perplexity AI tətbiqi hazırdır!`);
    console.log(`📱 Browser'də açın: http://localhost:${PORT}`);
    console.log(`🌐 Xarici IP ilə: http://0.0.0.0:${PORT}`);
    console.log(`🛑 Dayandırmaq üçün: Ctrl+C`);
    console.log(`📂 Serving files from: ${process.cwd()}`);
});