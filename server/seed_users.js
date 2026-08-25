require("dotenv").config();
const bcrypt = require("bcryptjs");
const { connectPostgres, sequelize } = require("./config/db/postgres");
const { User, Payment } = require("./models/postgres");

const seedUsers = async () => {
  try {
    await connectPostgres();
    await sequelize.sync();

    const usersToSeed = [
      {
        name: "Symposium Administrator",
        email: process.env.ADMIN_EMAIL || "login@psgtech.ac.in",
        phone: "9876543210",
        password: process.env.ADMIN_PASSWORD || "admin_secret_password_2026",
        college_name: "PSG College of Technology",
        department: "Computer Applications",
        role: "admin",
        user_type: "PARTICIPANT",
        student_id_code: "LGN26-0001",
        must_change_password: false,
      },
      {
        name: "Super Admin Power User",
        email: "adminpower@psgtech.ac.in",
        phone: "9876543211",
        password: "adminpower_password_2026",
        college_name: "PSG College of Technology",
        department: "Computer Applications",
        role: "admin_power",
        user_type: "PARTICIPANT",
        student_id_code: "LGN26-0002",
        must_change_password: false,
      },
      {
        name: "Event Coordinator Desk",
        email: "coordinator@psgtech.ac.in",
        phone: "9876543212",
        password: process.env.STANDARD_ROLE_PASSWORD || "CoordinatorPass2026!",
        college_name: "PSG College of Technology",
        department: "Computer Applications",
        role: "event_coordinator",
        user_type: "PARTICIPANT",
        student_id_code: "LGN26-0003",
        must_change_password: false,
      },
      {
        name: "Verified Participant Survivor",
        email: "participant@psgtech.ac.in",
        phone: "9876543213",
        password: "ParticipantPass2026!",
        college_name: "PSG College of Technology",
        department: "Computer Applications",
        role: "student",
        user_type: "PARTICIPANT",
        student_id_code: "LGN26-0004",
        must_change_password: false,
      },
    ];

    for (const userData of usersToSeed) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const [user, created] = await User.findOrCreate({
        where: { email: userData.email },
        defaults: {
          ...userData,
          password: hashedPassword,
        },
      });

      if (!created) {
        await user.update({
          name: userData.name,
          role: userData.role,
          student_id_code: userData.student_id_code,
          password: hashedPassword,
        });
      }

      // Seed verified payment for verified test accounts
      await Payment.findOrCreate({
        where: { student_id: user.id },
        defaults: {
          student_id: user.id,
          amount: 150.0,
          transaction_reference: `PSG-EMS-${user.id}000`,
          status: "VERIFIED",
        },
      });
    }

    console.log("Successfully seeded Admin, Coordinator, and Test User accounts!");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed users:", error);
    process.exit(1);
  }
};

seedUsers();
