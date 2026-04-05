const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/hospital", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const patientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  disease: String,
});

const doctorSchema = new mongoose.Schema({
  name: String,
  specialization: String,
});

const appointmentSchema = new mongoose.Schema({
  patient: String,
  doctor: String,
  date: String,
  status: String,
});

const Patient = mongoose.model("Patient", patientSchema);
const Doctor = mongoose.model("Doctor", doctorSchema);
const Appointment = mongoose.model("Appointment", appointmentSchema);

const patients = [
  "Rahul Sharma","Anita Rao","Kiran Patel","Sneha Reddy","Arjun Singh",
  "Pooja Verma","Rohit Kumar","Neha Gupta","Amit Das","Priya Nair",
  "Vikas Yadav","Meena Joshi","Suresh Babu","Lakshmi Devi","Ramesh Kumar",
  "Divya Sharma","Anil Kapoor","Kavya Reddy","Nikhil Jain","Swati Mishra"
].map((name, i) => ({
  name,
  age: 20 + (i % 40),
  disease: ["Diabetes","Fever","Hypertension","Asthma","Migraine"][i % 5]
}));

const doctors = [
  "Dr. Mehta","Dr. Reddy","Dr. Sharma","Dr. Khan","Dr. Iyer",
  "Dr. Gupta","Dr. Patel","Dr. Singh","Dr. Nair","Dr. Das"
].map((name, i) => ({
  name,
  specialization: ["Cardiologist","Physician","Neurologist","Orthopedic","Dermatologist"][i % 5]
}));

const appointments = Array.from({ length: 20 }, (_, i) => ({
  patient: patients[i].name,
  doctor: doctors[i % doctors.length].name,
  date: `2026-03-${10 + (i % 10)}`,
  status: ["Completed","Pending","Cancelled"][i % 3]
}));

async function seedData() {
  await Patient.deleteMany();
  await Doctor.deleteMany();
  await Appointment.deleteMany();

  await Patient.insertMany(patients);
  await Doctor.insertMany(doctors);
  await Appointment.insertMany(appointments);

  console.log("✅ Dummy data inserted!");
  process.exit();
}

seedData();
