import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const employeesPerPage = 10;
  const navigate = useNavigate();
  const BACKEND_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchEmployees = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${BACKEND_URL}/api/employees`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const employeesWithBase64Images = response.data.map((employee) => ({
          ...employee,
          image: employee.f_Image
            ? `data:image/jpeg;base64,${employee.f_Image}`
            : null,
        }));

        setEmployees(employeesWithBase64Images);
        setTotalEmployees(response.data.length);
      } catch (error) {
        console.error(
          "Error fetching employees:",
          error.response ? error.response.data : error.message
        );
        if (error.response && error.response.status === 401) {
          alert("Session expired. Please log in again");
          localStorage.removeItem("token");
          navigate("/");
        }
      }
    };
    fetchEmployees();
  }, [navigate]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please log in again.");
      navigate("/");
      return;
    }
    try {
      await axios.delete(`${BACKEND_URL}/api/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees((prevEmployees) =>
        prevEmployees.filter((emp) => emp._id !== id)
      );
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleEdit = (id) => {
    console.log("Edit employee with id:", id);
    navigate(`/employees/edit/${id}`);
  };

  // Pagination Logic
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(totalEmployees / employeesPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          Employee Directory
        </h1>
        <div className="flex justify-center items-center p-4">
          <Link to="/create-employee">
            <Button>Add Employees</Button>
          </Link>
        </div>
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6">
            {currentEmployees.map((employee) => (
              <div
                key={employee._id}
                className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition duration-300"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    className="w-16 h-16 rounded-full object-cover"
                    src={employee.image || "https://via.placeholder.com/150"}
                    alt={employee.f_Name || "Employee"}
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {employee.f_Name || "N/A"}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {employee.f_Designation || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {employee.f_Email || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Mobile:</span>{" "}
                    {employee.f_Mobile || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Gender:</span>{" "}
                    {employee.f_Gender || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Course:</span>{" "}
                    {employee.f_Course || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Created:</span>{" "}
                    {employee.f_Createdate || "N/A"}
                  </p>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(employee._id)}
                    className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(employee._id)} // Corrected _id usage
                    className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination */}
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
