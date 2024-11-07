const Employee = require("../models/Employee");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();

    const employeesWithBase64Images = employees.map((employee) => {
      return {
        ...employee.toObject(), // Convert Mongoose document to plain JS object
        f_Image: employee.f_Image ? employee.f_Image.toString("base64") : null,
      };
    });

    res.json(employeesWithBase64Images);
  } catch (error) {
    res.status(500).json({ error: "Internal Server error" });
  }
};

const getEmployeeById = async (req, res) => {
  const { id } = req.params;

  if (id === "recent") {
    return getrecentEmployees(req, res); // Call the function for recent employees
  }

  try {
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Convert image to base64 string if it exists
    const employeeWithBase64Image = {
      ...employee.toObject(),
      f_Image: employee.f_Image ? employee.f_Image.toString("base64") : null,
    };

    res.json(employeeWithBase64Image);
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ error: "Error fetching employee data" });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { name, email, mobile, designation, gender, course, createdDate } =
      req.body;

    // Validate required fields
    if (
      !req.file ||
      !name ||
      !email ||
      !mobile ||
      !designation ||
      !gender ||
      !course ||
      !createdDate
    ) {
      return res
        .status(400)
        .json({ error: "All fields are required, including the image." });
    }

    // Create a new employee record with image as binary data
    const employee = new Employee({
      f_Name: name,
      f_Email: email,
      f_Mobile: mobile,
      f_Designation: designation,
      f_Gender: gender,
      f_Course: course,
      f_CreatedDate: new Date(createdDate),
      f_Image: req.file.buffer, // Save image as binary data
    });

    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ error: "Error saving employee" });
  }
};

const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile, designation, gender, course, createdDate } =
    req.body;

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Update fields and image if provided
    employee.f_Name = name || employee.f_Name;
    employee.f_Email = email || employee.f_Email;
    employee.f_Mobile = mobile || employee.f_Mobile;
    employee.f_Designation = designation || employee.f_Designation;
    employee.f_Gender = gender || employee.f_Gender;
    employee.f_Course = course || employee.f_Course;
    employee.f_CreatedDate = createdDate
      ? new Date(createdDate)
      : employee.f_CreatedDate;

    // Update the image if a new file is provided
    if (req.file) {
      employee.f_Image = req.file.buffer;
    }

    await employee.save();
    res.json(employee);
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ error: "Error updating employee" });
  }
};

const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json({ message: "Employee deleted" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ error: "Error deleting employee" });
  }
};

const getrecentEmployees = async (req, res) => {
  try {
    const recentEmployees = await Employee.find()
      .sort({ createdAt: -1 })
      .limit(3);
    res.json(recentEmployees);
  } catch (error) {
    console.error("Error fetching recent employees:", error);
    res.status(500).send("Server error");
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee: [upload.single("image"), createEmployee],
  updateEmployee: [upload.single("image"), updateEmployee],
  deleteEmployee,
  getrecentEmployees,
};
