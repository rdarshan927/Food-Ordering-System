const Voucher = require('../Model/VoucherModel');

// @desc Add a new voucher
// @route POST /api/vouchers
exports.addVoucher = async (req, res) => {
  try {
    const { code, expirationDate } = req.body;

    if (!code || !expirationDate) {
      return res.status(400).json({ message: 'Code and expiration date are required' });
    }

    const newVoucher = new Voucher({
      code,
      expirationDate
    });

    await newVoucher.save();
    res.status(201).json({ message: 'Voucher added successfully', voucher: newVoucher });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc Get all active vouchers
// @route GET /api/vouchers
exports.getAllVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.status(200).json(vouchers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc Get a specific voucher by code
// @route GET /api/vouchers/:code
exports.getVoucherByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const voucher = await Voucher.findOne({ code });

    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }

    res.status(200).json(voucher);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc Update a voucher
// @route PUT /api/vouchers/:id
exports.updateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, expirationDate } = req.body;

    const updatedVoucher = await Voucher.findByIdAndUpdate(id, {
      code,
      expirationDate
    }, { new: true });

    if (!updatedVoucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }

    res.status(200).json({ message: 'Voucher updated successfully', voucher: updatedVoucher });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc Delete a voucher
// @route DELETE /api/vouchers/:id
exports.deleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVoucher = await Voucher.findByIdAndDelete(id);

    if (!deletedVoucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }

    res.status(200).json({ message: 'Voucher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
