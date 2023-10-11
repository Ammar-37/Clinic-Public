const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  dob: String,
  gender: String,
  mobileNumber: String,
  userType: {
    type: String,
    default: 'pharmacist', // Set the default user type to 'doctor'
  },
  hourlyRate: Number,
  affiliation: String,
  educationalBackground: String,
  enrolled: {
    type: String,
    default: "pending",
  }
});

const UserModel = mongoose.model('pharmacists', UsersSchema);
module.exports = UserModel;
