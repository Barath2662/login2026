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
    const from = process.env.SMTP_FROM || `"LOGIN 2026 Admin" <login@psgtech.ac.in>`;

    if (transporter) {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>?/gm, ""),
      });
      console.log(`[Email Sent from login@psgtech.ac.in] To: ${to} | Subject: ${subject} | ID: ${info.messageId}`);
      return info;
    } else {
      console.log(`[Email Logged (Sender: login@psgtech.ac.in)] To: ${to} | Subject: ${subject}`);
      return { mock: true, from: 'login@psgtech.ac.in' };
    }
  } catch (error) {
    console.error(`[Email Error] To: ${to} | Error:`, error.message);
    return { error: error.message };
  }
};

const sendEventRegistrationConfirmation = async (user, event, team = null) => {
  const paymentModel = require("../models/postgres/paymentModel");
  let isVerified = false;
  let paymentStatus = "PENDING";
  
  try {
    const payment = await paymentModel.findOne({ where: { student_id: user.id } });
    if (payment && payment.status === "VERIFIED") {
      isVerified = true;
      paymentStatus = "VERIFIED";
    } else if (payment && payment.status === "PENDING") {
      paymentStatus = "PENDING_VERIFICATION";
    }
  } catch (err) {
    // fallback
  }

  const subject = `[LOGIN 2026] Event Registration Confirmed: ${event.name} (${isVerified ? 'VERIFIED' : 'PAYMENT PENDING'})`;
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #0A0607; color: #F7F2F2; padding: 32px; border-radius: 6px; max-width: 600px; margin: 0 auto; border: 1px solid #2A1A1D;">
      <div style="border-bottom: 2px solid #E01B22; padding-bottom: 16px; margin-bottom: 24px;">
        <h1 style="color: #E01B22; margin: 0; font-size: 24px; letter-spacing: 2px;">LOGIN 2026</h1>
        <p style="color: #A79798; margin: 6px 0 0 0; font-size: 12px; font-family: monospace;">Department of Computer Applications • PSG College of Technology</p>
        <p style="color: #FF2A2A; margin: 4px 0 0 0; font-size: 11px; font-family: monospace;">Sender: login@psgtech.ac.in</p>
      </div>

      <h2 style="color: #F7F2F2; font-size: 20px; margin-top: 0;">Enrolment Confirmed: ${event.name}</h2>
      <p style="color: #A79798; font-size: 14px; line-height: 1.6;">Hello <strong style="color: #F7F2F2;">${user.name}</strong>,</p>
      <p style="color: #A79798; font-size: 14px; line-height: 1.6;">Your registration for <strong style="color: #FF2A2A;">${event.name}</strong> has been successfully recorded in the symposium ledger.</p>

      <!-- Verification Status Callout -->
      ${isVerified ? `
        <div style="background: rgba(31, 169, 113, 0.15); border: 1px solid #1FA971; padding: 14px; margin: 20px 0; border-radius: 4px; color: #1FA971; font-size: 13px;">
          <strong>✓ PARTICIPANT PAYMENT STATUS: VERIFIED</strong><br/>
          Official Survivor ID: <strong>${user.student_id_code || 'LGN26-VERIFIED'}</strong>. Your competition slot and accreditation are fully active.
        </div>
      ` : `
        <div style="background: rgba(224, 27, 34, 0.15); border: 1px solid #E01B22; padding: 14px; margin: 20px 0; border-radius: 4px; color: #FF2A2A; font-size: 13px;">
          <strong>⚠ PARTICIPANT PAYMENT STATUS: PENDING / UNVERIFIED</strong><br/>
          Your event registration is saved, but your symposium fee (₹150) verification is pending. Please submit your UTR reference on your portal dashboard so the admin committee can verify and issue your official Student ID.
        </div>
      `}

      <!-- Event Details Box -->
      <div style="background: #130C0E; border: 1px solid #2A1A1D; border-left: 4px solid #E01B22; padding: 18px; margin: 20px 0; border-radius: 4px; font-size: 13px; line-height: 1.8;">
        <p style="margin: 4px 0;"><strong style="color: #A79798;">Participant ID:</strong> <span style="color: #F7F2F2; font-family: monospace;">${user.student_id_code || 'Pending Verification'}</span></p>
        <p style="margin: 4px 0;"><strong style="color: #A79798;">Arena Category:</strong> <span style="color: #F7F2F2;">${event.category === 'TECHNICAL' ? 'Technical Arena' : 'Non-Technical Arena'}</span></p>
        <p style="margin: 4px 0;"><strong style="color: #A79798;">Symposium Day:</strong> <span style="color: #F7F2F2;">Day ${event.day} (18–19 September 2026)</span></p>
        <p style="margin: 4px 0;"><strong style="color: #A79798;">Reporting Time:</strong> <span style="color: #F7F2F2; font-family: monospace;">${event.start_time ? event.start_time.slice(0, 5) : '09:00'} IST</span></p>
        <p style="margin: 4px 0;"><strong style="color: #A79798;">Venue Desk:</strong> <span style="color: #F7F2F2;">${event.venue || 'Dept. of Computer Applications, PSG Tech'}</span></p>
        ${team ? `<p style="margin: 4px 0;"><strong style="color: #A79798;">Squad / Team:</strong> <span style="color: #E08A17; font-weight: bold;">${team.name}</span></p>` : ''}
      </div>

      <p style="color: #6B5A5C; font-size: 12px; margin-top: 24px; border-top: 1px solid #2A1A1D; pt: 16px;">
        For assistance, contact the organizing team at <a href="mailto:login@psgtech.ac.in" style="color: #E01B22;">login@psgtech.ac.in</a>.
      </p>
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
        <p style="color: #9A9AA2; margin: 4px 0 0 0;">Sender: login@psgtech.ac.in</p>
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
