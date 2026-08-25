require("dotenv").config();
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { connectPostgres, sequelize } = require("./config/db/postgres");
const { User, Event, EventCoordinator, Payment } = require("./models/postgres");

const seedUsers = async () => {
  try {
    await connectPostgres();
    await sequelize.query("ALTER TYPE \"enum_users_user_type\" ADD VALUE IF NOT EXISTS 'STAFF';");
    await sequelize.sync();

    const usersToSeed = [
      {
        name: "Symposium Administrator",
        email: process.env.ADMIN_EMAIL || "login@psgtech.ac.in",
        phone: "8148251567",
        password: process.env.ADMIN_PASSWORD || "C@@Adminlogin",
        college_name: "PSG College of Technology",
        department: "Computer Applications",
        role: "admin",
        user_type: "STAFF",
        student_id_code: "LGN26-0001",
        must_change_password: false,
      },
      {
        name: "Barathvikraman",
        email: "25mx103@psgtech.ac.in",
        phone: "8148251567",
        password: "admin123",
        college_name: "PSG College of Technology",
        department: "Computer Applications",
        role: "admin_power",
        user_type: "STAFF",
        student_id_code: "LGN26-0002",
        must_change_password: true,
      },
      {
        name: "Swarna Rathna",
        email: "25mx127@psgtech.ac.in",
        phone: "9952873426",
        password: "admin123",
        college_name: "PSG College of Technology",
        department: "Computer Applications",
        role: "admin_power",
        user_type: "STAFF",
        student_id_code: "LGN26-0003",
        must_change_password: true,
      },
      {
        name: "Stephina Smily",
        email: "25mx125@psgtech.ac.in",
        phone: "8300526351",
        password: "admin123",
        college_name: "PSG College of Technology",
        department: "Computer Applications",
        role: "admin_power",
        user_type: "STAFF",
        student_id_code: "LGN26-0004",
        must_change_password: true,
      },
    ];

    for (const userData of usersToSeed) {
      const { event_name, ...userFields } = userData;
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      let user = await User.findOne({
        where: {
          [Op.or]: [
            { email: userData.email },
            { student_id_code: userData.student_id_code },
          ],
        },
      });
      const created = !user;

      if (!user) {
        user = await User.create({
          ...userFields,
          password: hashedPassword,
        });
      }

      if (!created) {
        await user.update({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          college_name: userData.college_name,
          department: userData.department,
          role: userData.role,
          user_type: userData.user_type,
          student_id_code: userData.student_id_code,
          password: hashedPassword,
        });
      }

      await Payment.destroy({ where: { student_id: user.id } });

      if (userData.user_type === "PARTICIPANT") {
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

      await EventCoordinator.destroy({ where: { user_id: user.id } });
      if (userData.role === "event_coordinator" && userData.event_name) {
        const event = await Event.findOne({ where: { name: userData.event_name } });
        if (!event) throw new Error(`Event not found for coordinator: ${userData.event_name}`);
        await EventCoordinator.create({ event_id: event.id, user_id: user.id });
      }
    }

    console.log("Successfully seeded Admin, Coordinator, and Test User accounts!");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed users:", error);
    process.exit(1);
  }
};

seedUsers();
