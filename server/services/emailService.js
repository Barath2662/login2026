const nodemailer = require("nodemailer");

const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
};

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    const from = process.env.SMTP_FROM || `"LOGIN 2026 Admin" <adminpsgtech@gmail.com>`;

    if (transporter) {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>?/gm, ""),
      });
      console.log(`[Email Sent from adminpsgtech@gmail.com] To: ${to} | Subject: ${subject} | ID: ${info.messageId}`);
      return info;
    } else {
      console.log(`[Email Logged (Sender: adminpsgtech@gmail.com)] To: ${to} | Subject: ${subject}`);
      return { mock: true, from: 'adminpsgtech@gmail.com' };
    }
  } catch (error) {
    console.error(`[Email Error] To: ${to} | Error:`, error.message);
    return { error: error.message };
  }
};

const sendEventRegistrationConfirmation = async (user, event, team = null) => {
  const subject = `[LOGIN 2026] Registration Confirmed: ${event.name}`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #0A0A0C; color: #F2F2F4; padding: 24px; border-radius: 8px;">
      <div style="border-bottom: 2px solid #E01B24; padding-bottom: 12px; margin-bottom: 20px;">
        <h1 style="color: #E01B24; margin: 0;">LOGIN 2026 — PSG TECH</h1>
        <p style="color: #9A9AA2; margin: 4px 0 0 0;">Sender: adminpsgtech@gmail.com | 35th Edition National Technical Symposium</p>
      </div>

      <h2>Registration Confirmed: ${event.name}</h2>
      <p>Hello <strong>${user.name}</strong>,</p>
      <p>Your enrolment for <strong>${event.name}</strong> has been successfully confirmed in the symposium master ledger.</p>

      <div style="background: #141418; border-left: 4px solid #E01B24; padding: 16px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 4px 0;"><strong>Student ID:</strong> ${user.student_id_code || "LGN26-VERIFIED"}</p>
        <p style="margin: 4px 0;"><strong>Arena Category:</strong> ${event.category}</p>
        <p style="margin: 4px 0;"><strong>Day & Date:</strong> Day ${event.day} (18-19 September 2026)</p>
        <p style="margin: 4px 0;"><strong>Start Time:</strong> ${event.start_time || '09:00 AM'} IST</p>
        <p style="margin: 4px 0;"><strong>Venue:</strong> ${event.venue || "Department of Computer Applications, PSG Tech"}</p>
        ${team ? `<p style="margin: 4px 0;"><strong>Team Name:</strong> ${team.name}</p>` : ""}
      </div>

      <p style="color: #9A9AA2; font-size: 14px;">Please present your Student ID (${user.student_id_code || 'LGN26-VERIFIED'}) at the event desk upon arrival.</p>
    </div>
  `;
  return sendEmail({ to: user.email, subject, html });
};

const sendEventChangeNotification = async (user, event, changes) => {
  const subject = `[LOGIN 2026] URGENT ALERT: Venue/Time Update for ${event.name}`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #0A0A0C; color: #F2F2F4; padding: 24px; border-radius: 8px;">
      <div style="border-bottom: 2px solid #E01B24; padding-bottom: 12px; margin-bottom: 20px;">
        <h1 style="color: #E01B24; margin: 0;">LOGIN 2026 — VENUE & TIME UPDATE ALERT</h1>
        <p style="color: #9A9AA2; margin: 4px 0 0 0;">Sender: adminpsgtech@gmail.com</p>
      </div>

      <h2>Attention: Schedule/Venue Change Notice</h2>
      <p>Hello <strong>${user.name}</strong>,</p>
      <p>Please note that the schedule/venue details for your registered competition arena <strong>${event.name}</strong> have been updated by the organizing committee.</p>

      <div style="background: #141418; border-left: 4px solid #E01B24; padding: 16px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 4px 0;"><strong>Event Arena:</strong> ${event.name}</p>
        <p style="margin: 4px 0; color: #E01B24;"><strong>New Venue:</strong> ${event.venue || "Check Portal Dashboard"}</p>
        <p style="margin: 4px 0; color: #E01B24;"><strong>New Start Time:</strong> ${event.start_time || "Check Portal Schedule"} IST</p>
        <p style="margin: 4px 0;"><strong>Day:</strong> Day ${event.day} (18-19 September 2026)</p>
      </div>

      <p style="color: #9A9AA2; font-size: 14px;">Log in to your Survivor Dossier at http://localhost:5000/dashboard for real-time venue maps and schedule updates.</p>
    </div>
  `;
  return sendEmail({ to: user.email, subject, html });
};

const sendEventReminderEmail = async (user, event) => {
  const subject = `[LOGIN 2026 REMINDER] Upcoming Competition Arena: ${event.name}`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #0A0A0C; color: #F2F2F4; padding: 24px; border-radius: 8px;">
      <h2 style="color: #E01B24;">LOGIN 2026 Event Reminder</h2>
      <p>Hello <strong>${user.name}</strong>,</p>
      <p>This is a reminder for your upcoming event <strong>${event.name}</strong> on Day ${event.day}.</p>
      <div style="background: #141418; border: 1px solid #E01B24; padding: 16px; margin: 20px 0;">
        <p style="margin: 4px 0;"><strong>Venue:</strong> ${event.venue}</p>
        <p style="margin: 4px 0;"><strong>Time:</strong> ${event.start_time} IST</p>
        <p style="margin: 4px 0;"><strong>Student ID:</strong> ${user.student_id_code}</p>
      </div>
    </div>
  `;
  return sendEmail({ to: user.email, subject, html });
};

const sendPaymentVerificationEmail = async (user, studentIdCode) => {
  const subject = `[LOGIN 2026] Payment Verified! Your Student ID is ${studentIdCode}`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #0A0A0C; color: #F2F2F4; padding: 24px; border-radius: 8px;">
      <h1 style="color: #1FA971; margin: 0;">Payment Verified ✓</h1>
      <p>Hello <strong>${user.name}</strong>,</p>
      <p>Your registration payment for LOGIN 2026 has been verified by the admin team!</p>
      <div style="background: #141418; border: 1px solid #1FA971; padding: 16px; margin: 20px 0; text-align: center; border-radius: 4px;">
        <span style="font-size: 14px; color: #9A9AA2;">Your Official Student ID:</span>
        <h2 style="color: #1FA971; font-size: 28px; margin: 8px 0; letter-spacing: 2px;">${studentIdCode}</h2>
      </div>
      <p>You can now proceed to register for events on the LOGIN 2026 portal.</p>
    </div>
  `;
  return sendEmail({ to: user.email, subject, html });
};

const sendCoordinatorCredentialsEmail = async (user, defaultPassword, eventName) => {
  const subject = `[LOGIN 2026] Coordinator Account Provisioned`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #0A0A0C; color: #F2F2F4; padding: 24px; border-radius: 8px;">
      <h1 style="color: #E01B24; margin: 0;">Coordinator Portal Access</h1>
      <p>Hello <strong>${user.name}</strong>,</p>
      <p>You have been assigned as Event Coordinator for <strong>${eventName}</strong>.</p>
      <div style="background: #141418; border: 1px solid #2A1416; padding: 16px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 4px 0;"><strong>Email:</strong> ${user.email}</p>
        <p style="margin: 4px 0;"><strong>Temporary Password:</strong> ${defaultPassword}</p>
      </div>
      <p style="color: #E8A317;"><strong>Important:</strong> You will be required to change your password immediately upon your first login.</p>
    </div>
  `;
  return sendEmail({ to: user.email, subject, html });
};

module.exports = {
  sendEmail,
  sendEventRegistrationConfirmation,
  sendEventChangeNotification,
  sendEventReminderEmail,
  sendPaymentVerificationEmail,
  sendCoordinatorCredentialsEmail,
};
