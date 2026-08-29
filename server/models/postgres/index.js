const User = require("./userModel");
const Event = require("./eventModel");
const EventCoordinator = require("./eventCoordinatorModel");
const Registration = require("./registrationModel");
const Payment = require("./paymentModel");
const Team = require("./teamModel");
const TeamMember = require("./teamMemberModel");
const TeamRequest = require("./teamRequestModel");
const TeamInvitation = require("./teamInvitationModel");
const Bonafide = require("./bonafideModel");
const Attendance = require("./attendanceModel");
const Result = require("./resultModel");
const Notification = require("./notificationModel");
const Setting = require("./settingModel");
const Announcement = require("./announcementModel");
const EventChangeLog = require("./eventChangeLogModel");
const { LegacyEdition, LegacyItem } = require("./legacyModel");
const EmailLog = require("./emailLogModel");
const Otp = require("./otpModel");

// User -> Registrations
User.hasMany(Registration, { foreignKey: "student_id", as: "registrations" });
Registration.belongsTo(User, { foreignKey: "student_id", as: "student" });

Event.hasMany(Registration, { foreignKey: "event_id", as: "registrations" });
Registration.belongsTo(Event, { foreignKey: "event_id", as: "event" });

// Event coordinators
User.hasMany(EventCoordinator, { foreignKey: "user_id", as: "eventAssignments" });
EventCoordinator.belongsTo(User, { foreignKey: "user_id", as: "coordinator" });

Event.hasMany(EventCoordinator, { foreignKey: "event_id", as: "coordinatorAssignments" });
EventCoordinator.belongsTo(Event, { foreignKey: "event_id", as: "event" });

// Payments
User.hasMany(Payment, { foreignKey: "student_id", as: "payments" });
Payment.belongsTo(User, { foreignKey: "student_id", as: "student" });
Payment.belongsTo(User, { foreignKey: "verified_by", as: "verifier" });

// Teams
User.hasMany(Team, { foreignKey: "created_by", as: "createdTeams" });
Team.belongsTo(User, { foreignKey: "created_by", as: "creator" });

Event.hasMany(Team, { foreignKey: "event_id", as: "teams" });
Team.belongsTo(Event, { foreignKey: "event_id", as: "event" });

Team.hasMany(TeamMember, { foreignKey: "team_id", as: "members" });
TeamMember.belongsTo(Team, { foreignKey: "team_id", as: "team" });

User.hasMany(TeamMember, { foreignKey: "student_id", as: "teamMemberships" });
TeamMember.belongsTo(User, { foreignKey: "student_id", as: "student" });

// Team Invitations (Leader invites participant)
Team.hasMany(TeamInvitation, { foreignKey: "team_id", as: "invitations" });
TeamInvitation.belongsTo(Team, { foreignKey: "team_id", as: "team" });

User.hasMany(TeamInvitation, { foreignKey: "sender_id", as: "sentInvitations" });
TeamInvitation.belongsTo(User, { foreignKey: "sender_id", as: "sender" });

User.hasMany(TeamInvitation, { foreignKey: "receiver_id", as: "receivedInvitations" });
TeamInvitation.belongsTo(User, { foreignKey: "receiver_id", as: "receiver" });

// Team Requests (Participant requests to join team)
Team.hasMany(TeamRequest, { foreignKey: "team_id", as: "joinRequests" });
TeamRequest.belongsTo(Team, { foreignKey: "team_id", as: "team" });

User.hasMany(TeamRequest, { foreignKey: "sender_id", as: "sentRequests" });
TeamRequest.belongsTo(User, { foreignKey: "sender_id", as: "sender" });

User.hasMany(TeamRequest, { foreignKey: "receiver_id", as: "receivedRequests" });
TeamRequest.belongsTo(User, { foreignKey: "receiver_id", as: "receiver" });

// Attendance
User.hasMany(Attendance, { foreignKey: "student_id", as: "attendance" });
Attendance.belongsTo(User, { foreignKey: "student_id", as: "student" });

Event.hasMany(Attendance, { foreignKey: "event_id", as: "attendance" });
Attendance.belongsTo(Event, { foreignKey: "event_id", as: "event" });

// Results
Event.hasOne(Result, { foreignKey: "event_id", as: "result" });
Result.belongsTo(Event, { foreignKey: "event_id", as: "event" });

// Notifications & Logs
User.hasMany(Notification, { foreignKey: "user_id", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "user_id", as: "user" });

Event.hasMany(EventChangeLog, { foreignKey: "event_id", as: "changeLogs" });
EventChangeLog.belongsTo(Event, { foreignKey: "event_id", as: "event" });

module.exports = {
  User,
  Event,
  EventCoordinator,
  Registration,
  Payment,
  Team,
  TeamMember,
  TeamRequest,
  TeamInvitation,
  Bonafide,
  Attendance,
  Result,
  Notification,
  Setting,
  Announcement,
  EventChangeLog,
  LegacyEdition,
  LegacyItem,
  EmailLog,
  Otp,
};
