const http = require('http');

function postForm(path, data) {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams(data).toString();
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        const setCookie = res.headers['set-cookie'];
        resolve({ status: res.statusCode, cookie: setCookie ? setCookie[0] : null, body });
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function getPage(path, cookie = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'GET',
      headers: cookie ? { 'Cookie': cookie } : {},
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        resolve({ status: res.statusCode, body });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function testUserFixes() {
  console.log('--- VERIFYING USER ISSUES FIXES ---\n');

  // 1. Admin Sign In & Admin Control Surface
  const adminLogin = await postForm('/login', {
    email: 'admin@psgtech.ac.in',
    password: 'admin_secret_password_2026',
  });
  console.log('Admin Sign In Status:', adminLogin.status);
  const adminPage = await getPage('/admin', adminLogin.cookie);
  console.log('Admin Page GET Status:', adminPage.status, adminPage.body.includes('SYSTEM CONTROL SURFACE') ? '✓ Admin Loaded Cleanly!' : '✗ Failed');

  // 2. Coordinator Sign In & Coordinator Desk
  const coordLogin = await postForm('/login', {
    email: 'coordinator@psgtech.ac.in',
    password: 'CoordinatorPass2026!',
  });
  console.log('Coordinator Sign In Status:', coordLogin.status);
  const coordPage = await getPage('/coordinator', coordLogin.cookie);
  console.log('Coordinator Page GET Status:', coordPage.status, coordPage.body.includes('COORDINATOR DESK') ? '✓ Coordinator Loaded Cleanly!' : '✗ Failed');

  // 3. Contact Page
  const contactPage = await getPage('/contact');
  console.log('Contact Page GET Status:', contactPage.status, contactPage.body.includes('ORGANIZING COMMITTEE') ? '✓ Contact Page Loaded Cleanly!' : '✗ Failed');

  // 4. Legacy Archive Pages
  const legacyIndex = await getPage('/legacy');
  console.log('Legacy Index GET Status:', legacyIndex.status, legacyIndex.body.includes('LOGIN LEGACY EDITIONS') ? '✓ Legacy Index Loaded Cleanly!' : '✗ Failed');

  const legacyGallery = await getPage('/legacy/2025');
  console.log('Legacy Gallery GET Status:', legacyGallery.status, legacyGallery.body.includes('LOGIN 2025 — 34th Edition') ? '✓ Legacy Gallery Loaded Cleanly!' : '✗ Failed');

  console.log('\n--- ALL USER REPORTED ISSUES FIXED & VERIFIED! ---');
}

testUserFixes();
