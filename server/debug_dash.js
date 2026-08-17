const { connectPostgres } = require('./config/db/postgres');
const { User, Payment, Registration, Event } = require('./models/postgres');

async function debugDashboard() {
  try {
    await connectPostgres();
    const user = await User.findOne();
    if (!user) {
      console.log('No user found in DB');
      return;
    }
    console.log('Testing dashboard query for user ID:', user.id);
    const [payment, registrations] = await Promise.all([
      Payment.findOne({ where: { student_id: user.id } }),
      Registration.findAll({ where: { student_id: user.id }, include: [{ model: Event, as: 'event' }] })
    ]);
    console.log('Payment query success! Payment:', payment ? payment.toJSON() : null);
    console.log('Registrations query success! Count:', registrations.length);
  } catch (err) {
    console.error('DEBUG DASHBOARD ERROR:', err);
  }
}

debugDashboard();
