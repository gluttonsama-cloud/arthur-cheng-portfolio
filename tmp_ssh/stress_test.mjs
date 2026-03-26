import http from 'http';

// Use the actual hash from the last build
const BUNDLE_URL = 'http://159.75.45.241/assets/index-BRezwIga.js'; 

async function testOnce(id) {
    const start = Date.now();
    return new Promise((resolve) => {
        http.get(BUNDLE_URL, { headers: { 'Accept-Encoding': 'gzip' } }, (res) => {
            let size = 0;
            res.on('data', chunk => size += chunk.length);
            res.on('end', () => {
                const duration = Date.now() - start;
                resolve({ id, status: res.statusCode, duration, size, gzipped: res.headers['content-encoding'] === 'gzip' });
            });
        }).on('error', (e) => {
            resolve({ id, error: e.message, duration: Date.now() - start });
        });
    });
}

async function runTest(concurrency) {
    console.log(`\n--- Running Stress Test (Bundle Download) | Concurrency: ${concurrency} ---`);
    const tasks = [];
    for (let i = 0; i < concurrency; i++) {
        tasks.push(testOnce(i));
    }
    const results = await Promise.all(tasks);
    
    const success = results.filter(r => r.status === 200);
    const avgDuration = success.reduce((acc, r) => acc + r.duration, 0) / (success.length || 1);
    const avgSize = success.reduce((acc, r) => acc + r.size, 0) / (success.length || 1);
    const gzippedCount = success.filter(r => r.gzipped).length;
    
    console.log(`Success Rate: ${success.length}/${concurrency}`);
    console.log(`Avg Response Time: ${avgDuration.toFixed(2)}ms`);
    console.log(`Avg Download Size: ${(avgSize / 1024).toFixed(2)}KB (Gzip: ${gzippedCount}/${success.length})`);
    
    if (success.length < concurrency) {
        console.log(`Failures: ${concurrency - success.length}`);
    }
}

async function main() {
    await runTest(10);
    await runTest(25);
    await runTest(50);
}

main();
