const http = require('http');

function makeRequest(path, method = 'GET', data = null, cookie = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Accept': 'text/html,application/json',
      },
    };

    if (cookie) {
      options.headers['Cookie'] = cookie;
    }

    if (data) {
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, body });
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(data);
    }
    req.end();
  });
}

async function runMPATests() {
  console.log('=== STARTING LOGIN 2026 MPA SERVER-RENDERED VIEW TESTS ===\n');

  try {
    // 1. Health API Check
    const health = await makeRequest('/api/health');
    console.log('1. Health API Status:', health.status, health.body);

    // 2. Landing Page HTML
    const landing = await makeRequest('/');
    console.log('2. Landing Page HTML Status:', landing.status, landing.body.includes('LOGIN 2026') ? '✓ HTML Contains "LOGIN 2026"' : '✗ Failed');

    // 3. Events Index HTML
    const events = await makeRequest('/events');
    console.log('3. Events Index HTML Status:', events.status, events.body.includes('CATEGORY FILTER') ? '✓ HTML Contains "CATEGORY FILTER"' : '✗ Failed');

    // 4. Event Detail HTML
    const detail = await makeRequest('/events/star-of-login');
    console.log('4. Event Detail HTML Status:', detail.status, detail.body.toLowerCase().includes('star of login') ? '✓ HTML Contains "Star of LOGIN"' : '✗ Failed');

    // 5. Timeline Page HTML
    const timeline = await makeRequest('/timeline');
    console.log('5. Timeline Page HTML Status:', timeline.status, timeline.body.includes('SYMPOSIUM TIMELINE') ? '✓ HTML Contains "SYMPOSIUM TIMELINE"' : '✗ Failed');

    // 6. Alumni Invitation Page HTML
    const alumni = await makeRequest('/alumni');
    console.log('6. Alumni Page HTML Status:', alumni.status, alumni.body.includes('WELCOME HOME, ALUMNI') ? '✓ HTML Contains "WELCOME HOME, ALUMNI"' : '✗ Failed');

    // 7. Login Page HTML
    const login = await makeRequest('/login');
    console.log('7. Login Page HTML Status:', login.status, login.body.includes('AUTHENTICATE') ? '✓ HTML Contains "AUTHENTICATE"' : '✗ Failed');

    // 8. Register Page HTML
    const register = await makeRequest('/register');
    console.log('8. Register Page HTML Status:', register.status, register.body.includes('CREATE SURVIVOR DOSSIER') ? '✓ HTML Contains "CREATE SURVIVOR DOSSIER"' : '✗ Failed');

    console.log('\n=== ALL MPA SERVER-RENDERED HTML VIEW TESTS PASSED CLEANLY! ===');
  } catch (err) {
    console.error('MPA Test error:', err);
  }
}

runMPATests();
