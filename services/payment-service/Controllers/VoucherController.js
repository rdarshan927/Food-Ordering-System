const Voucher = require('../Model/VoucherModel');

/// Create a new voucher
exports.createVoucher = async (req, res) => {
  try {
    const { code, expirationDate } = req.body;
    const newVoucher = new Voucher({
      code,
      expirationDate,
    });

    const savedVoucher = await newVoucher.save();
    res.status(201).json(savedVoucher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating voucher" });
  }
};

// Get all vouchers
exports.getAllVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.status(200).json(vouchers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching vouchers" });
  }
};

// Get a voucher by code
exports.getVoucherByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const voucher = await Voucher.findOne({ code });

    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    res.status(200).json(voucher);
  } catch (err) {
    res.status(500).json({ message: "Error fetching voucher" });
  }
};

// Update a voucher
exports.updateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, expirationDate } = req.body;

    const updatedVoucher = await Voucher.findByIdAndUpdate(
      id,
      { code, expirationDate },
      { new: true }
    );

    if (!updatedVoucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    res.status(200).json(updatedVoucher);
  } catch (err) {
    res.status(500).json({ message: "Error updating voucher" });
  }
};

// Delete a voucher
exports.deleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVoucher = await Voucher.findByIdAndDelete(id);

    if (!deletedVoucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    res.status(200).json({ message: "Voucher deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting voucher" });
  }
};