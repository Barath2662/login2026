async function testIntegration() {
  console.log('Testing Client-Server Integration...');
  const baseUrl = 'http://localhost:5000/api';
  let token = '';
  let cookie = '';

  const request = async (method, path, body = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (cookie) headers['Cookie'] = cookie;
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);
    
    const res = await fetch(`${baseUrl}${path}`, options);
    
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) cookie = setCookie.split(';')[0];

    const data = await res.json().catch(() => null);
    return { status: res.status, data };
  };

  try {
    // 1. Test Auth Register & Login
    console.log('\n--- 1. Testing Auth ---');
    const registerRes = await request('POST', '/auth/register', {
      name: 'Test Student',
      email: `test_${Date.now()}@test.com`,
      password: 'password123'
    });
    console.log('Register:', registerRes.status, registerRes.data);

    let loginEmail = `test_${Date.now()}@test.com`;
    if (registerRes.data?.user?.email) loginEmail = registerRes.data.user.email;
    else if (registerRes.data?.email) loginEmail = registerRes.data.email;

    const loginRes = await request('POST', '/auth/login', {
      email: loginEmail,
      password: 'password123'
    });
    console.log('Login:', loginRes.status, !!loginRes.data?.token ? 'Got Token' : 'No Token');
    
    if (loginRes.data?.token) {
      token = loginRes.data.token;
    }

    // 2. Test User Profile
    console.log('\n--- 2. Testing Users ---');
    const profileRes = await request('GET', '/users/profile');
    console.log('Profile:', profileRes.status, profileRes.data?.name);

    // 3. Test Events
    console.log('\n--- 3. Testing Events ---');
    const eventsRes = await request('GET', '/events/');
    console.log('Events List:', eventsRes.status, 'Count:', eventsRes.data?.length);

    // 4. Test Registrations
    console.log('\n--- 4. Testing Registrations ---');
    if (eventsRes.data?.length > 0) {
      const eventId = eventsRes.data[0].id;
      const regRes = await request('POST', '/registrations/', { event_id: eventId });
      console.log('Register Event:', regRes.status, regRes.data);
      
      const myRegs = await request('GET', '/registrations/my');
      console.log('My Registrations:', myRegs.status, 'Count:', myRegs.data?.length);
    }

    // 5. Test Payments
    console.log('\n--- 5. Testing Payments ---');
    const payStatus = await request('GET', '/payments/my');
    console.log('Payment Status:', payStatus.status, payStatus.data);

    // 6. Test Teams
    console.log('\n--- 6. Testing Teams ---');
    const teamRes = await request('GET', '/teams/my');
    console.log('My Team:', teamRes.status, teamRes.data);

    // 7. Test Bonafides
    console.log('\n--- 7. Testing Bonafides ---');
    const bonafideRes = await request('GET', '/bonafides/my');
    console.log('Bonafide Status:', bonafideRes.status, bonafideRes.data);

    // 8. Test Notifications
    console.log('\n--- 8. Testing Notifications ---');
    const notifRes = await request('GET', '/notifications/');
    console.log('My Notifications:', notifRes.status, notifRes.data?.length);

  } catch (err) {
    console.error('Integration Test Failed:', err.message);
  }
}

testIntegration();
