
const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    jobTitle: String,
    status: { type: String, default: 'Pending' },
    resumeUrl: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Candidate', candidateSchema);
