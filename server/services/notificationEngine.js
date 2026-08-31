const { EventChangeLog, Registration, User, EmailLog } = require('../models/postgres');
const { sendEmail } = require('./emailService');
const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');

const debounceTimers = new Map();

function trackEventChange(eventId, changedBy, oldValues, newValues) {
  const fieldsChanged = {};
  const notifiableFields = ['day', 'start_time', 'end_time', 'venue', 'registration_deadline', 'rules_url'];
  let isNotifiable = false;

  for (const key of Object.keys(newValues)) {
    if (oldValues[key] !== newValues[key]) {
      fieldsChanged[key] = { old: oldValues[key], new: newValues[key] };
      if (notifiableFields.includes(key)) {
        isNotifiable = true;
      }
    }
  }

  if (Object.keys(fieldsChanged).length === 0) return;

  EventChangeLog.create({
    event_id: eventId,
    changed_by: changedBy,
    fields_changed: fieldsChanged,
    notified: false,
  });

  if (isNotifiable) {
    scheduleDebouncedNotification(eventId);
  }
}

function scheduleDebouncedNotification(eventId) {
  if (debounceTimers.has(eventId)) {
    clearTimeout(debounceTimers.get(eventId));
  }

  // 5-minute debounce window (300,000 ms)
  const timer = setTimeout(async () => {
    debounceTimers.delete(eventId);
    await flushEventNotifications(eventId);
  }, 5 * 60 * 1000);

  debounceTimers.set(eventId, timer);
}

async function flushEventNotifications(eventId) {
  try {
    const unnotifiedLogs = await EventChangeLog.findAll({
      where: { event_id: eventId, notified: false },
    });

    if (unnotifiedLogs.length === 0) return;

    const registrations = await Registration.findAll({
      where: { event_id: eventId },
      include: [User],
    });

    if (registrations.length === 0) {
      await EventChangeLog.update({ notified: true, notified_at: new Date() }, { where: { event_id: eventId, notified: false } });
      return;
    }

    // Merge changes
    const mergedChanges = {};
    unnotifiedLogs.forEach((log) => {
      const fields = log.fields_changed || {};
      for (const [k, v] of Object.entries(fields)) {
        mergedChanges[k] = v;
      }
    });

    const changeSummary = Object.entries(mergedChanges)
      .map(([field, delta]) => `${field.toUpperCase()}: ${delta.old || 'None'} → ${delta.new}`)
      .join('<br>');

    for (const reg of registrations) {
      if (reg.User && reg.User.email) {
        const subject = `[LOGIN 2026] Notice: Event Details Updated for Event #${eventId}`;
        const html = `
          <div style="font-family: Arial, sans-serif; background: #F4EFE9; color: #16090B; padding: 24px; border: 1px solid #6B5A58;">
            <h2 style="color: #E01B22;">Event Details Update Notice</h2>
            <p>Hello <strong>${reg.User.name}</strong> (Student ID: ${reg.User.student_id_code || 'LGN26-REGISTERED'}),</p>
            <p>The organizing team has updated the schedule/venue details for your registered competition:</p>
            <div style="background: #E9E1D8; padding: 16px; border-left: 4px solid #E01B22; font-family: monospace; font-size: 13px;">
              ${changeSummary}
            </div>
            <p>Please check your survivor dossier at <a href="${frontendUrl}/dashboard">LOGIN 2026 Dashboard</a>.</p>
          </div>
        `;

        await sendEmail({ to: reg.User.email, subject, html });
        await EmailLog.create({
          to: reg.User.email,
          template: 'EVENT_CHANGE_NOTIFY',
          subject,
          status: 'SENT',
          sent_at: new Date(),
          related_id: String(eventId),
        });
      }
    }

    await EventChangeLog.update({ notified: true, notified_at: new Date() }, { where: { event_id: eventId, notified: false } });
  } catch (err) {
    console.error('Flush notification error:', err);
  }
}

module.exports = {
  trackEventChange,
  flushEventNotifications,
};
