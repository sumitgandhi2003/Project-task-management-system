import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button, Input } from "../../Libs";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useLogin } from "../../context/loginContext";
import { BiLoaderAlt } from "react-icons/bi";
import { checkValidation } from "../../utility/constants";

const Login = () => {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({});
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const navigate = useNavigate();
  const { isLogin, setIsLogin } = useLogin();
  const [isPending, setIsPending] = useState(false);

  /**
   * handle submit
   * check validation
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = checkValidation(loginForm);
    if (error) {
      setError({ ...error });
      return;
    }
    setError({});
    await handleLogin();
  };

  /**
   * handle form field value change
   */
  const handleChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  /**
   * handle login
   */
  const handleLogin = async () => {
    try {
      setIsPending(true);
      const option = {
        method: "POST",
        url: `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/login`,
        data: loginForm,
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const response = await axios.request(option);
      console.log("Login successful:", response);
      setIsLogin(true);
      navigate("/");
    } catch (error) {
      console.log(error);
      const { data = {} } = error.response || {};
      setError({ errorMessage: data?.message });
    } finally {
      setIsPending(false);
    }
  };

  /**
   * handle password toggle
   */
  const passwordToggle = () => {
    setIsPasswordShow((prev) => !prev);
  };

  /**
   * redirect when user already login
   */
  useEffect(() => {
    if (isLogin) navigate("/");
  }, [isLogin]);
  return (
    !isLogin && (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-8 rounded-md shadow-sm"
        >
          <h2 className="text-center text-2xl font-semibold mb-6">
            Welcome back!
          </h2>
          {/* email field */}
          <div className="w-full mb-4">
            <Input
              type="text"
              placeholder="Enter Email Id"
              value={loginForm.email}
              onChange={handleChange}
              name="email"
              id="email"
              className={
                "w-full px-4 py-2 mb-1 border border-gray-300 rounded-md "
              }
            />
            {error.email && (
              <p className="text-red-500 text-sm font-medium mt-1">
                {error.email}
              </p>
            )}
          </div>

          {/* password field */}
          <div className="w-full relative mb-4">
            <Input
              type={`${isPasswordShow ? "text" : "password"}`}
              placeholder="Password"
              className={`w-full p-2 rounded-md border-2  
                            
                            "text-gray-900 bg-gray-100 border-gray-300 focus:border-gray-600"
                            `}
              value={loginForm?.password}
              onChange={handleChange}
              name={"password"}
            />
            {error.password && (
              <p className="text-red-500 text-sm font-medium mt-1">
                {error.password}
              </p>
            )}

            <div
              onClick={passwordToggle}
              className={`hover:cursor-pointer absolute  right-3  -translate-y-1/2 ${
                loginForm?.password
                  ? "flex items-center justify-center"
                  : "hidden"
              }  ${error.password ? "top-1/3" : "top-1/2"}`}
            >
              {isPasswordShow ? (
                <FaEyeSlash
                  className={`text-gray-900
                                }`}
                />
              ) : (
                <FaEye
                  className={` text-gray-900
                                `}
                />
              )}
            </div>
          </div>

          {error.errorMessage && (
            <div className="w-full mb-4">
              <p className="text-red-500 text-sm font-medium mt-1">
                {error.errorMessage}
              </p>
            </div>
          )}

          {/* submit button */}
          <Button
            btntext={`${isPending ? "Logging..." : "Login"}`}
            className="w-full bg-[#273366] text-white py-2 rounded-md hover:bg-[#1f2954] transition disabled:opacity-50 cursor-pointer"
            disabled={isPending}
            icon={
              isPending ? <BiLoaderAlt className="animate-spin h-6 w-6" /> : ""
            }
          />
          {/* redirection link for registration */}
          <div className={`text-center mt-4 text-gray-60 `}>
            Don't have an account?{" "}
            <Link className="text-blue-500 hover:underline" to={"/register"}>
              sign up
            </Link>
          </div>
        </form>
      </div>
    )
  );
};

export default Login;
