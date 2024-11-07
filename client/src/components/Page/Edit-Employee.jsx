import React, { useEffect, useState } from "react";
import axios from "axios";
import { Camera } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const EditEmployee = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "Male",
    course: "",
    createdDate: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const BACKEND_URL = "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }

    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const employee = response.data;
        setFormData({
          name: employee.f_Name,
          email: employee.f_Email,
          mobile: employee.f_Mobile,
          designation: employee.f_Designation,
          gender: employee.f_Gender,
          course: employee.f_Course,
          createdDate: employee.f_Createdate,
        });

        if (employee.f_Image) {
          setImagePreview(`data:image/jpeg;base64,${employee.f_Image}`);
        }
      } catch (error) {
        console.error(
          "Error fetching employee data:",
          error.response || error.message
        );
        alert("An error occurred. Please try again later.");
      }
    };

    fetchEmployeeData();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to edit an employee.");
      navigate("/");
      return;
    }

    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      payload.append(key, formData[key]);
    });
    if (image) {
      payload.append("image", image); // Add image file
    }

    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/employees/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        console.log("Employee updated successfully:", response.status);
        setSuccessMessage("Employee updated successfully!");
        setTimeout(() => {
          setSuccessMessage(null);
          navigate("/employees"); // Redirect to the employee list page
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Edit Employee</h1>
            </div>
            {successMessage && (
              <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-lg">
                {successMessage}
              </div>
            )}
            <form className="divide-y divide-gray-200" onSubmit={handleSubmit}>
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <label className="block">
                    <span className="text-gray-700">Employee Image</span>
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block">
                      <span className="text-gray-700">Name</span>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        required
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block">
                      <span className="text-gray-700">Email</span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        required
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block">
                      <span className="text-gray-700">Mobile</span>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        required
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block">
                      <span className="text-gray-700">Designation</span>
                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        required
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block">
                      <span className="text-gray-700">Gender</span>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        required
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>
                  </div>
                  <div>
                    <label className="block">
                      <span className="text-gray-700">Course</span>
                      <input
                        type="text"
                        name="course"
                        value={formData.course}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        required
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block">
                      <span className="text-gray-700">Created Date</span>
                      <input
                        type="date"
                        name="createdDate"
                        value={formData.createdDate}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        required
                      />
                    </label>
                  </div>
                </div>
                <div className="pt-4 flex items-center justify-center">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white text-base font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                  >
                    Update Employee
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;
