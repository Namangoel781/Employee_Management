const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    f_Image: { type: Buffer, required: true },
    f_Name: { type: String, required: true },
    f_Email: { type: String, required: true },
    f_Mobile: { type: String, required: true },
    f_Designation: { type: String, required: true },
    f_Gender: { type: String, required: true },
    f_Course: { type: String, required: true },
    f_Createdate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
