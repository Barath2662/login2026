const User = require("./userModel");
const Event = require("./eventModel");
const EventCoordinator = require("./eventCoordinatorModel");
const Registration = require("./registrationModel");
const Payment = require("./paymentModel");
const Team = require("./teamModel");
const TeamMember = require("./teamMemberModel");
const TeamRequest = require("./teamRequestModel");
const Bonafide = require("./bonafideModel");
const Attendance = require("./attendanceModel");
const Result = require("./resultModel");
const Notification = require("./notificationModel");
const Setting = require("./settingModel");
const Announcement = require("./announcementModel");
const EventChangeLog = require("./eventChangeLogModel");
const { LegacyEdition, LegacyItem } = require("./legacyModel");
const EmailLog = require("./emailLogModel");

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

Team.hasMany(TeamMember, { foreignKey: "team_id", as: "members" });
TeamMember.belongsTo(Team, { foreignKey: "team_id", as: "team" });

User.hasMany(TeamMember, { foreignKey: "student_id", as: "teamMemberships" });
TeamMember.belongsTo(User, { foreignKey: "student_id", as: "student" });

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
};
