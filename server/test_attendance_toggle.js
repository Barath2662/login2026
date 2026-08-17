const http = require('http');

function postForm(path, data, cookie = null) {
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
        ...(cookie ? { 'Cookie': cookie } : {})
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

async function testAttendanceToggle() {
  console.log('--- TESTING COORDINATOR ATTENDANCE TOGGLE ---');

  // 1. Sign in as Coordinator
  const coordLogin = await postForm('/login', {
    email: 'coordinator@psgtech.ac.in',
    password: 'CoordinatorPass2026!',
  });

  // 2. Toggle attendance for Student #4 on Event #1
  const toggleRes = await postForm('/coordinator/1/attendance/4', {}, coordLogin.cookie);
  console.log('Attendance Toggle Response Status:', toggleRes.status);

  if (toggleRes.status === 302 || toggleRes.status === 200) {
    console.log('✓ SUCCESS: Attendance toggle executed cleanly without 404 error!');
  } else {
    console.log('✗ FAILED with status:', toggleRes.status);
  }
}

testAttendanceToggle();
