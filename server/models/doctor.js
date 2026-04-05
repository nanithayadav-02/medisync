const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcryptjs = require("bcryptjs");

const DoctorSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  phone: {
    type: String
  },
  department: {
    type: String
  },
  address: {
    type: String
  }
});

//hashing password
DoctorSchema.pre('save', function (next) {
  const doctor = this

  bcryptjs.hash(doctor.password, 10, (error, hash) => {
    doctor.password = hash
    next()
  })
})

const Doctor = mongoose.model("Doctor", DoctorSchema);

module.exports = Doctor;
