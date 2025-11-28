const Candidate = require('../models/Candidate');
const path = require('path');
const fs = require('fs');

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}
exports.createCandidate = async (req, res, next) => {
  try {
    const { name, email, phone, jobTitle } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Name, Email, Phone are required' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (!isValidPhone(phone)) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }

    let resumeUrl = null;
    if (req.file) {
      resumeUrl = `/uploads/${req.file.filename}`;
    }

    const candidate = new Candidate({
      name,
      email,
      phone,
      jobTitle,
      resumeUrl
    });

    await candidate.save();

    res.status(201).json({
      message: 'Candidate created successfully',
      candidate
    });
  } catch (err) {
    next(err);
  }
};

exports.getCandidates = async (req, res, next) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (err) {
    next(err);
  }
};


exports.updateStatus = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const candidate = await Candidate.findById(id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

    candidate.status = status || candidate.status;
    await candidate.save();

    res.json({ message: 'Status updated', candidate });
  } catch (err) {
    next(err);
  }
};


exports.deleteCandidate = async (req, res, next) => {
  try {
    const id = req.params.id;

    const candidate = await Candidate.findById(id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

  
    if (candidate.resumeUrl) {
      const filePath = path.join(__dirname, '..', candidate.resumeUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await candidate.deleteOne();

    res.json({ message: 'Candidate deleted successfully' });

  } catch (err) {
    next(err);
  }
};


exports.downloadResume = async (req, res, next) => {
  try {
    const id = req.params.id;

    const candidate = await Candidate.findById(id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

    if (!candidate.resumeUrl) {
      return res.status(404).json({ message: 'Resume not uploaded' });
    }

    const filePath = path.join(__dirname, '..', candidate.resumeUrl);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    res.download(filePath);

  } catch (err) {
    next(err);
  }
};
