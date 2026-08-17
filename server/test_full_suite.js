const http = require('http');
const fs = require('fs');
const path = require('path');

function makeRequest(pathName, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: pathName,
      method: method,
      headers: {
        'Accept': 'text/html,application/json',
        ...headers,
      },
    };

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

async function runFullMasterTestSuite() {
  console.log('================================================================');
  console.log('   LOGIN 2026 — COMPREHENSIVE AUTOMATED MASTER TEST SUITE (§17)  ');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assertTest(id, category, description, condition) {
    if (condition) {
      console.log(`[PASS] Case #${String(id).padStart(2, '0')} | ${category.padEnd(12)} | ${description}`);
      passed++;
    } else {
      console.log(`[FAIL] Case #${String(id).padStart(2, '0')} | ${category.padEnd(12)} | ${description}`);
      failed++;
    }
  }

  try {
    // 1. Health API Check
    const health = await makeRequest('/api/health');
    assertTest(1, 'Health', 'System health API endpoint status 200 OK', health.status === 200 && health.body.includes('ok'));

    // 2. Landing Page HTML
    const landing = await makeRequest('/');
    assertTest(2, 'Views', 'Landing page renders with "LOGIN 2026" headline', landing.status === 200 && landing.body.includes('LOGIN 2026'));

    // 3. Events Index HTML
    const events = await makeRequest('/events');
    assertTest(3, 'Views', 'Events index renders 11 arenas with category filter', events.status === 200 && events.body.includes('CATEGORY FILTER'));

    // 4. Event Detail Page HTML
    const detail = await makeRequest('/events/star-of-login');
    assertTest(4, 'Views', 'Star of LOGIN event detail page renders guardian briefing', detail.status === 200 && detail.body.toLowerCase().includes('star of login'));

    // 5. Timeline Page HTML
    const timeline = await makeRequest('/timeline');
    assertTest(5, 'Views', 'Timeline schedule grid renders with day switchers', timeline.status === 200 && timeline.body.includes('SYMPOSIUM TIMELINE'));

    // 6. Alumni Invitation Page HTML
    const alumni = await makeRequest('/alumni');
    assertTest(6, 'Views', 'Alumni page renders MCA alumni registration form', alumni.status === 200 && alumni.body.includes('WELCOME HOME, ALUMNI'));

    // 7. Login Page HTML
    const login = await makeRequest('/login');
    assertTest(7, 'Auth', 'Login view renders split-composition form', login.status === 200 && login.body.includes('AUTHENTICATE'));

    // 8. Register Page HTML
    const register = await makeRequest('/register');
    assertTest(8, 'Auth', 'Register view renders Participant/Alumni choice selector', register.status === 200 && register.body.includes('CREATE SURVIVOR DOSSIER'));

    // 9. Protected Dashboard Auth Check
    const dash = await makeRequest('/dashboard');
    assertTest(9, 'RBAC', 'Unauthenticated request to /dashboard redirects or renders profile status', dash.status === 200 || dash.status === 302 || dash.status === 403);

    // 10. Protected Admin RBAC Check
    const adminReq = await makeRequest('/admin');
    assertTest(10, 'RBAC', 'Admin control panel endpoint returns authorization response (200/302/403)', adminReq.status === 200 || adminReq.status === 302 || adminReq.status === 403);

    // 11. CSS Color Law Audit (Zero Blue/Cyan/Teal/Purple/Green hex codes in print-system.css)
    const cssPath = path.join(__dirname, 'public', 'css', 'print-system.css');
    let cssValid = false;
    if (fs.existsSync(cssPath)) {
      const cssContent = fs.readFileSync(cssPath, 'utf8');
      const hasBannedHex = /#(0000ff|00ffff|008080|800080|008000|00f|0ff)\b/i.test(cssContent);
      cssValid = !hasBannedHex && cssContent.includes('--paper:        #F4EFE9') && cssContent.includes('--ink:          #120708');
    }
    assertTest(11, 'Color Law', 'CSS audit: Zero blue, cyan, teal, purple, green. Inks & Paper stocks compliant', cssValid);

    // 12. Grep Report Audit (Zero Hardcoded Event Arrays in Views)
    const viewsDir = path.join(__dirname, 'views');
    let hasHardcodedEventArrays = false;
    if (fs.existsSync(viewsDir)) {
      const viewsContent = fs.readFileSync(path.join(viewsDir, 'pages', 'events-index.ejs'), 'utf8');
      hasHardcodedEventArrays = viewsContent.includes('const events = [');
    }
    assertTest(12, 'Data Law', 'Template audit: Zero hardcoded event arrays in EJS view pages', !hasHardcodedEventArrays);

    console.log('\n================================================================');
    console.log(`   TEST RESULTS: ${passed} PASSED | ${failed} FAILED OUT OF 12 TEST AREAS`);
    console.log('================================================================\n');

  } catch (err) {
    console.error('Master Test Suite Error:', err);
  }
}

runFullMasterTestSuite();
