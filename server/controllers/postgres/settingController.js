const settingModel = require("../../models/postgres/settingModel");

const getSettings = async (req, res) => {
  try {
    const settings = await settingModel.findAll();
    const map = {};
    settings.forEach((s) => {
      map[s.key] = s.value;
    });

    // Provide default fallback values if settings table is empty
    if (!map.payment_url) map.payment_url = "https://events.psginstitutions.in/EMS/register/E5294158179";
    if (!map.registration_amount) map.registration_amount = "150";
    if (!map.contact_email) map.contact_email = "login2026@psgtech.ac.in";
    if (!map.contact_phone) map.contact_phone = "+91 98765 43210";

    return res.json(map);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch settings", error: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const updates = req.body;
    for (const [key, value] of Object.entries(updates)) {
      const [setting] = await settingModel.findOrCreate({
        where: { key },
        defaults: { value: String(value) },
      });
      await setting.update({ value: String(value) });
    }
    return res.json({ message: "Settings updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update settings", error: error.message });
  }
};

module.exports = { getSettings, updateSettings };
