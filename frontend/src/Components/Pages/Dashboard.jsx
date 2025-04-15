import React, { useEffect, useState } from "react";
import { useLogin } from "../../context/loginContext";
import { useNavigate } from "react-router-dom";
import { Button, Input, Select, TextArea } from "../../Libs";
import axios from "axios";
import { MdClose } from "react-icons/md";
import {
  getPriorityColor,
  getStatusColor,
  toCapitalizeCase,
} from "../../utility/constants";
import { BiLoaderAlt } from "react-icons/bi";
import Loader from "../../Libs/Loader/Loader";
import { checkValidation } from "../../utility/constants";
import TaskDashBoard from "../TaskDashBoard/TaskDashBoard";
import { useUserDetail } from "../../context/userContext";
import ProjectDashBoard from "../ProjectDashBoard/ProjectDashBoard";
// import { meta } from "@eslint/js";

const AvatarGroup = ({ count }) => (
  <div className="flex -space-x-2 overflow-hidden">
    {Array(count)
      .fill(0)
      .map((_, i) => (
        <img
          key={i}
          className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
          src={`https://api.dicebear.com/7.x/personas/svg?seed=${i}`}
          alt="avatar"
        />
      ))}
  </div>
);

const CustomCard = ({ item, status }) => (
  <div className="border rounded-xl shadow-sm p-4 bg-white space-y-2 border-gray-200">
    <div className="flex justify-between items-start">
      <h4 className="font-semibold text-sm text-gray-800">{item.title}</h4>
      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 font-semibold text-gray-700">
        {toCapitalizeCase(item?.priority)}
      </span>
    </div>
    <p className="text-sm text-gray-600">{item.description}</p>
    <div className="flex justify-between items-center pt-2">
      <AvatarGroup count={item.teamAvatars} />
      <span className="text-xs text-gray-500">
        {status === "completed" ? "Completed" : "Due"} {item.dueDate}
      </span>
    </div>
  </div>
);

const ActiveProjects = () => {
  const [projectArr, setProjectArr] = useState([]);
  const [isLoading, setIsloading] = useState(false);

  /**
   * Fetching All Project from backend of every user excption is if user is admin fetching all project
   */
  const getAllProject = async () => {
    try {
      setIsloading(true);
      const option = {
        method: "GET",
        url: `${import.meta.env.VITE_SERVER_URL}/api/v1/project/get-projects`,
        params: {
          scope: "me",
        },
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };

      const response = await axios.request(option);
      setProjectArr(response.data?.projects);
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };

  /**
   * calling fetching project function after component mount
   */
  useEffect(() => {
    getAllProject();
  }, []);
  return (
    <div className=" flex-1 p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Active Projects</h1>
        {/* <Button
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          btntext="New Project"
        /> */}
      </div>
      {isLoading && <Loader />}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projectArr?.map((column, idx) => (
          <div
            key={idx}
            className="border-gray-200 border p-4 rounded-xl shadow-sm"
          >
            {}
            <h3 className="text-md font-semibold mb-2">
              {toCapitalizeCase(column.status)}
            </h3>
            <div className="space-y-4 ">
              {column.items.map((item, index) => (
                <CustomCard key={index} item={item} status={column.status} />
              ))}
              {column.items.length < 1 && (
                <div className="flex flex-col h-full items-center  justify-center text-center p-6 border rounded-lg bg-gray-50 text-gray-600">
                  <svg
                    className="w-10 h-10 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m2 6H7a2 2 0 01-2-2V8a2 2 0 012-2h3l1-2h4l1 2h3a2 2 0 012 2v8a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-sm">
                    You don’t have any projects in the{" "}
                    <span className="font-semibold text-gray-700">
                      {toCapitalizeCase(column.status)}
                    </span>{" "}
                    stage.
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { isLogin } = useLogin();
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    {
      id: 1,
      name: "Dashboard",
      component: ActiveProjects,
      icon: "",
    },
    { id: 2, name: "Projects", component: ProjectDashBoard, icon: "" },
    { id: 3, name: "Task", component: TaskDashBoard, icon: "" },
    {
      id: 4,
      name: "Member",
      component: "Member",
      icon: "",
    },
  ];
  const ActiveTabComponent = tabs[activeTab]?.component;

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    }
  }, [isLogin]);
  return (
    <div className="flex flex-1/2">
      <div className="w-64 bg-white border-r p-6">
        <h1 className="text-2xl font-bold mb-8 text-blue-600">ProjectHub</h1>
        <ul>
          {tabs.map((item, index) => (
            <li
              key={item.id}
              className={`mb-4 p-2 rounded-md  cursor-pointer hover:bg-blue-100 ${
                activeTab === index
                  ? "bg-blue-100 text-blue-600 "
                  : "text-gray-700"
              }`}
              onClick={() => setActiveTab(index)}
            >
              {item.name}
            </li>
          ))}
          {/* <li className="mb-4 text-gray-600 hover:text-black cursor-pointer">
            Dashboard
          </li>
          <li className="mb-4 text-blue-600 font-semibold">Projects</li>
          <li className="mb-4 text-gray-600 hover:text-black cursor-pointer">
            Tasks
          </li>
          <li className="text-gray-600 hover:text-black cursor-pointer">
            Team
          </li> */}
        </ul>
      </div>
      <ActiveTabComponent />
    </div>
  );
};

export default Dashboard;
