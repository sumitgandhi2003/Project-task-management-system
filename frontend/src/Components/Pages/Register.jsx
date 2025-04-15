import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button } from "../../Libs";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";
import axios from "axios";
import { useLogin } from "../../context/loginContext";
import { checkValidation } from "../../utility/constants";

const Register = () => {
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    employeeId: "",
    password: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isLogin, setIsLogin } = useLogin();

  /**
   * handle password toggle
   */
  const passwordToggle = () => setIsPasswordShow((prev) => !prev);

  /**
   * Handle Submit
   * check validation
   * calling function for registration
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = checkValidation(registerForm);
    if (error) {
      setErrors({ ...error });
      return;
    }
    setErrors({});
    await handleRegister();

    console.log("Form submitted:", registerForm);
  };

  /**
   * Handle Registration
   */
  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const option = {
        method: "POST",
        url: `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/register`,
        data: registerForm,
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const response = await axios.request(option);
      console.log("Registration successful:", response.data);
      setIsLogin(true);
      navigate("/");
    } catch (error) {
      console.error("Error during registration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Form fiel value change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm({ ...registerForm, [name]: value });
  };
  /**
   * handle redirection when user login already
   */

  useEffect(() => {
    if (isLogin === true) {
      console.log(isLogin);
      navigate("/");
      return;
    }
  }, [isLogin]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-md shadow-md w-full max-w-md space-y-5"
      >
        <h2 className="text-2xl font-semibold text-center text-[#273366]">
          Register
        </h2>

        {/* email field */}
        <div className="w-full  email-field">
          <Input
            type="text"
            className="w-full px-3 py-2 border rounded-md "
            onChange={handleChange}
            name={"email"}
            placeholder={"Enter your Email"}
            value={registerForm?.email}
          />
          {errors?.email && (
            <p className="text-red-500 text-sm mt-1">{errors?.email}</p>
          )}
        </div>

        {/* name field */}
        <div className="w-full mb-4 name-field">
          <Input
            type="text"
            className="w-full px-3 py-2 border rounded-md "
            onChange={handleChange}
            name={"name"}
            placeholder={"Enter your Name"}
            value={registerForm?.name}
          />

          {errors?.name && (
            <p className="text-red-500 text-sm mt-1">{errors?.name}</p>
          )}
        </div>

        {/* employee id & password field */}
        <div className="grid grid-cols-2   gap-3">
          <div className="w-full mb-4 employeeId-field">
            <Input
              type="text"
              className="w-full px-3 py-2 border rounded-md "
              onChange={handleChange}
              name={"employeeId"}
              placeholder={"Enter your Employee ID"}
              value={registerForm?.employeeId}
            />
            {errors?.employeeId && (
              <p className="text-red-500 text-sm mt-1">{errors?.employeeId}</p>
            )}
          </div>
          <div className="w-full relative mb-4 password-field">
            <div className="relative">
              <Input
                type={`${isPasswordShow ? "text" : "password"}`}
                placeholder="Password"
                className={`w-full p-2 rounded-md border-2  
                                    
                                    "text-gray-900 bg-gray-100 border-gray-300 focus:border-gray-600"
                                    `}
                value={registerForm?.password}
                onChange={handleChange}
                name={"password"}
              />
              <div
                onClick={passwordToggle}
                className={`hover:cursor-pointer absolute  right-3 top-1/2  -translate-y-1/2 ${
                  registerForm?.password
                    ? "flex items-center justify-center"
                    : "hidden"
                } `}
              >
                {isPasswordShow ? (
                  <FaEyeSlash className={`text-gray-900 `} />
                ) : (
                  <FaEye className={` text-gray-900`} />
                )}
              </div>
            </div>
            {errors?.password && (
              <p className="text-red-500 text-sm font-medium mt-1">
                {errors?.password}
              </p>
            )}
          </div>
        </div>
        <div className="w-full mb-4 role-field">
          <div className="flex w-full gap-2">
            <div
              className={`flex justify-center w-1/2 items-center gap-3  border-2 rounded ${
                registerForm.role === "team"
                  ? "bg-blue-500 text-white border-0"
                  : "border-gray-200"
              }`}
            >
              <Input
                type="radio"
                id="role-team"
                name="role"
                value="team"
                checked={registerForm.role == "team"}
                onChange={handleChange}
                className="hidden"
              />
              <label
                htmlFor="role-team"
                className="w-full h-full p-2 cursor-pointer flex items-center justify-center"
              >
                Team Member
              </label>
            </div>

            <div
              className={`flex justify-center items-center w-1/2 gap-3  border-2 rounded ${
                registerForm.role === "admin"
                  ? "bg-blue-500 text-white border-0"
                  : "border-gray-200"
              }`}
            >
              <Input
                type="radio"
                id="role-admin"
                name="role"
                value="admin"
                checked={registerForm.role === "admin"}
                onChange={handleChange}
                className="hidden"
              />
              <label
                htmlFor="role-admin"
                className="w-full h-full p-2 cursor-pointer flex items-center justify-center"
              >
                Admin
              </label>
            </div>
          </div>

          {errors?.role && (
            <p className="text-red-500 text-sm font-medium mt-1">
              {errors?.role}
            </p>
          )}
        </div>

        {/* submit button */}
        <Button
          btntext={`${isLoading ? "Registering..." : "Register"}`}
          className="w-full bg-[#273366] text-white py-2 rounded-md hover:bg-[#1f2954] transition disabled:opacity-50 cursor-pointer"
          disabled={isLoading}
          icon={
            isLoading ? <BiLoaderAlt className="animate-spin h-6 w-6" /> : ""
          }
        />

        {/* redirection for login */}
        <div className={`text-center mt-4 text-gray-600  `}>
          Already have an account?{" "}
          <Link className="text-blue-500 hover:underline" to={"/login"}>
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
