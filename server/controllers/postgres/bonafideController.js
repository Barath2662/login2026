const bonafideModel = require("../../models/postgres/bonafideModel");

const getMyBonafide = async (req, res) => {
  try {
    const bonafide = await bonafideModel.findOne({
      where: { student_id: req.user.id },
    });

    return res.json(bonafide || null);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch bonafide", error: error.message });
  }
};

const uploadBonafide = async (req, res) => {
  try {
    const { file_url } = req.body;

    if (!file_url) {
      return res.status(400).json({ message: "file_url is required" });
    }

    const [bonafide] = await bonafideModel.findOrCreate({
      where: { student_id: req.user.id },
      defaults: {
        student_id: req.user.id,
        file_url,
        status: "uploaded",
      },
    });

    if (bonafide.file_url !== file_url) {
      await bonafide.update({
        file_url,
        status: "uploaded",
        remarks: null,
      });
    }

    return res.json({ message: "Bonafide uploaded", bonafide });
  } catch (error) {
    return res.status(500).json({ message: "Failed to upload bonafide", error: error.message });
  }
};

const verifyBonafide = async (req, res) => {
  try {
    const bonafide = await bonafideModel.findByPk(req.params.id);
    if (!bonafide) return res.status(404).json({ message: "Bonafide not found" });

    await bonafide.update({
      status: req.body.status,
      remarks: req.body.remarks || null,
    });

    return res.json({ message: "Bonafide status updated", bonafide });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update bonafide", error: error.message });
  }
};

module.exports = {
  getMyBonafide,
  uploadBonafide,
  verifyBonafide,
};
