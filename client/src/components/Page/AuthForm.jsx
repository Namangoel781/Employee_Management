import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const BACKEND_URL = "http://localhost:5000";

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ username: "", email: "", password: "" });
    setMessage("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin
        ? `${BACKEND_URL}/api/auth/login`
        : `${BACKEND_URL}/api/auth/signup`;
      const { data } = await axios.post(url, formData);

      localStorage.setItem("token", data.token);
      if (!isLogin) {
        localStorage.setItem("username", formData.username);
      }

      navigate("/home");
    } catch (error) {
      setMessage("Error:" + error.response?.data?.msg || "An error occured");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setMessage("You are already logged in.");
      navigate("/home");
    }
  }, [navigate]);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="max-w-sm w-full shadow-lg p-8">
        <div>
          <span as="h2" className="text-center text-2xl font-semibold mb-4">
            {isLogin ? "Login" : "Sign Up"}
          </span>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="form-control">
                <label className="block mb-1">Username</label>
                <Input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className="form-control">
              <label className="block mb-1">Email</label>
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-control">
              <label className="block mb-1">Password</label>
              <Input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              {isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>

          <span as="p" className="text-center text-gray-600 mt-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <Button
              variant="link"
              className="text-blue-600"
              onClick={toggleForm}
            >
              {isLogin ? "Sign up" : "Login"}
            </Button>
          </span>
          {message && (
            <span className="text-center text-red-500 mt-2">{message}</span>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AuthForm;
