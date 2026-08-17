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

function getPage(path, cookie) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'GET',
      headers: {
        'Cookie': cookie,
      },
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

async function testDashboardAuthFlow() {
  console.log('--- TESTING SIGN IN & DASHBOARD SESSION FLOW ---');
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPass = 'password123';

  // 1. Register test user
  const regRes = await postForm('/register', {
    name: 'Test Survivor',
    email: testEmail,
    phone: '9876543210',
    password: testPass,
    college_name: 'PSG College of Technology',
    user_type: 'PARTICIPANT',
  });

  console.log('Registration Status:', regRes.status, regRes.cookie ? 'Cookie received ✓' : 'No cookie');

  // 2. Fetch /dashboard with session cookie
  const dashRes = await getPage('/dashboard', regRes.cookie);
  console.log('Dashboard GET Status:', dashRes.status);

  if (dashRes.status === 200 && dashRes.body.includes('SURVIVOR JOURNEY TRACKER')) {
    console.log('✓ SUCCESS: Dashboard loaded cleanly without any 500 error!');
  } else {
    console.log('✗ FAILED:', dashRes.status, dashRes.body.substring(0, 200));
  }
}

testDashboardAuthFlow();
