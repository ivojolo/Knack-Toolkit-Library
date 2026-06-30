//Non-secure HTTP server, to be used on local network for development purpose only.
const fs = require('fs');
const http = require('http');
const path = require('path')

console.log('Starting server, waiting for requests...');

const root = process.argv[2] || path.join(process.cwd(), '..', '..');

console.log(`Serving files from ${root}`);

http.createServer(function (req, res) {
    var url = decodeURI(req.url.split('?')[0]);
    url = root + url;
    url = url.replace(/\\/g, '/');
    url = url.trim();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // ---- BEGIN Knack Cookie Valve endpoints (additive; canonical copy: Knack Builder API/relay/fileserver-patch.js) ----
    const KCV_COOKIE_FILE = 'C:/code/KnackApps/Knack Builder API/.knack-cookie';
    const kcvRoute = req.url.split('?')[0];

    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

    if (req.method === 'POST' && kcvRoute === '/knack-cookie') {
        let kcvBody = '';
        req.on('data', function (c) { kcvBody += c; if (kcvBody.length > 1e6) req.destroy(); });
        req.on('end', function () {
            const value = kcvBody.trim();
            if (!value) { res.writeHead(400); res.end('{"ok":false,"error":"empty"}'); return; }
            fs.writeFile(KCV_COOKIE_FILE, value, { mode: 0o600 }, function (err) {
                if (err) { res.writeHead(500); res.end('{"ok":false,"error":"' + err.code + '"}'); return; }
                res.writeHead(200); res.end('{"ok":true,"bytes":' + value.length + '}');
            });
        });
        return;
    }

    if (req.method === 'POST' && kcvRoute === '/knack-cookie/clear') {
        fs.unlink(KCV_COOKIE_FILE, function (err) {
            if (err && err.code !== 'ENOENT') { res.writeHead(500); res.end('{"ok":false,"error":"' + err.code + '"}'); return; }
            res.writeHead(200); res.end('{"ok":true,"cleared":true}');
        });
        return;
    }
    // ---- END Knack Cookie Valve endpoints ----

    fs.readFile(url, function (err, data) {
        const timestamp = new Date().toLocaleString();
        console.log(`[${timestamp}] url =`, url);
        if (err) {
            if (err.code !== 'EISDIR')
                console.log(`[${timestamp}] err =`, err);
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }

        res.writeHead(200);
        res.end(data);
    });
}).listen(3000);