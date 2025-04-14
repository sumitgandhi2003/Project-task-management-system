import React, { useEffect, useState } from "react";
import { useLogin } from "../../context/loginContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Button, Input, Select, TextArea } from "../../Libs";
import axios from "axios";
import { MdClose } from "react-icons/md";
import { toCapitalizeCase } from "../../utility/constants";
import { BiLoaderAlt } from "react-icons/bi";
import Loader from "../../Libs/Loader/Loader";
import { useUserDetail } from "../../context/userContext";
import { checkValidation } from "../../utility/constants";
import { meta } from "@eslint/js";

const Project = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    team: [],
    status: "",
    priority: "",
    dueDate: "",
  });
  const [errors, setErrors] = useState({});
  const [showDropDown, setShowDropDown] = useState(false);
  const [memberArr, setMemberArr] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * handle field value change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handle getching All user from backend
   * this use for assigning project specific or group of user
   */
  const getAllUser = async () => {
    try {
      const option = {
        method: "GET",
        url: `${import.meta.env.VITE_SERVER_URL}/api/v1/admin/get-team-user`,
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const response = await axios.request(option);
      setMemberArr(response.data?.allTeamMember);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * handle form submit
   * check vlaidation
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const error = checkValidation(formData);

    if (error) {
      setErrors({ ...error });
      return;
    }
    handleSubmitProject();
  };

  /**
   * handle creating project
   */
  const handleSubmitProject = async () => {
    setIsLoading(true);
    try {
      const option = {
        method: "POST",
        url: `${import.meta.env.VITE_SERVER_URL}/api/v1/project/create-project`,
        data: formData,
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const response = await axios.request(option);
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  /**
   * calling getUer function fetching all user backend when dropdown is open
   *
   */
  useEffect(() => {
    if (showDropDown && memberArr.length < 1) {
      getAllUser();
      return;
    }
  }, [showDropDown]);
  return (
    <div className="flex-1 p-5 bg-gray-50 flex flex-col items-center">
      <h2 className="text-3xl font-semibold mb-6">Create New Project</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-3xl space-y-4 "
      >
        {/* Project title field */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Project Title
          </label>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter project title"
          />
          {errors?.title && (
            <p className="text-red-500 text-sm font-medium mt-1">
              {errors?.title}
            </p>
          )}
        </div>

        {/* Project description field */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Project Description
          </label>
          <TextArea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter project description"
            rows="4"
          />
          {errors?.description && (
            <p className="text-red-500 text-sm font-medium mt-1">
              {errors?.description}
            </p>
          )}
        </div>

        {/* assign user dropdown */}
        <div className="flex flex-col gap-4">
          <label className="block mb-1 text-sm font-medium">
            Assign Team Members
          </label>

          <div className="relative">
            <Input
              className={`w-full border px-3 py-2 rounded transition-all duration-150 ${
                showDropDown ? "rounded-b-none" : ""
              }`}
              placeholder={"Enter Team Member Name"}
              onFocus={() => setShowDropDown(true)}
              onBlur={() => setTimeout(() => setShowDropDown(false), 150)}
            />

            {showDropDown && (
              <ul
                className={`absolute bg-white shadow w-full rounded-md ${
                  showDropDown
                    ? "rounded-t-none border-2 border-gray-600 border-t-0"
                    : ""
                }  min-h-40 max-h-72 overflow-y-scroll`}
              >
                {memberArr.map((item) => (
                  <li
                    key={item?._id}
                    className="p-2 even:bg-gray-200 cursor-pointer"
                    onClick={() => {
                      if (
                        !formData.team.find((member) => member._id === item._id)
                      ) {
                        setFormData((prev) => ({
                          ...prev,
                          team: [...prev.team, item],
                        }));
                      }
                    }}
                  >
                    {item?.name}
                  </li>
                ))}
                {memberArr.length < 1 && (
                  <div className="flex w-full min-h-full  absolute items-center justify-center">
                    <BiLoaderAlt className="animate-spin h-10 w-10" />
                  </div>
                )}
              </ul>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Selected Team Member
            </label>
            <div className="w-full p-2">
              {formData.team?.length < 1 ? (
                <p className="text-center text-sm p-2">
                  No Team Member Selected
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {formData.team?.map((item) => (
                    <span className="rounded-full bg-gray-400 px-3 py-2 text-white flex items-center justify-center gap-2">
                      {item?.name}
                      <MdClose
                        className="text-white font-bold cursor-pointer  "
                        onClick={() => {
                          setFormData((prev) => {
                            const filteredMember = prev.team?.filter(
                              (member) => member._id !== item?._id
                            );
                            return {
                              ...prev,
                              team: filteredMember,
                            };
                          });
                        }}
                      />
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {errors?.team && (
            <p className="text-red-500 text-sm font-medium mt-1">
              {errors?.team}
            </p>
          )}
        </div>

        {/* project status Priority field  */}
        <div className="flex gap-4">
          {/* project status field  */}
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium">
              Project Status
            </label>

            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              itemArray={[
                { id: 1, name: "To Do", value: "to do" },
                { id: 2, name: "In Progress", value: "in progress" },
                { id: 3, name: "Completed", value: "completed" },
              ]}
              displayName={"Select Status"}
            />
            {errors?.status && (
              <p className="text-red-500 text-sm font-medium mt-1">
                {errors?.status}
              </p>
            )}
          </div>

          {/* Priority field */}
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium">
              Priority Level
            </label>
            <Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              displayName={"Select Priority"}
              itemArray={[
                { id: 1, name: "Low", value: "low" },
                { id: 2, name: "Medium", value: "medium" },
                { id: 3, name: "High", value: "high" },
                { id: 4, name: "Urgent", value: "urgent" },
              ]}
            />
            {errors?.priority && (
              <p className="text-red-500 text-sm font-medium mt-1">
                {errors?.priority}
              </p>
            )}
          </div>
        </div>

        {/* dueDate field */}
        <div>
          <label className="block mb-1 text-sm font-medium">Due Date</label>
          <Input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          {errors?.dueDate && (
            <p className="text-red-500 text-sm font-medium mt-1">
              {errors?.dueDate}
            </p>
          )}
        </div>

        {/* Submit Button  */}
        <Button
          type={`${isLoading ? "Submiting..." : "Submit"}`}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 cursor-pointer"
          btntext="Create Project"
          icon={
            isLoading ? <BiLoaderAlt className="animate-spin h-6 w-6" /> : ""
          }
        />
      </form>
    </div>
  );
};

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

  const projects = [
    {
      status: "To Do",
      items: [
        {
          title: "Website Redesign",
          priority: "High",
          description: "Update the landing page with new brand guidelines",
          dueDate: "Jan 20, 2025",
          teamAvatars: 3,
        },
        {
          title: "API Integration",
          priority: "Medium",
          description: "Implement payment gateway integration",
          dueDate: "Jan 25, 2025",
          teamAvatars: 1,
        },
      ],
    },
    {
      status: "In Progress",
      items: [
        {
          title: "Mobile App Development",
          priority: "High",
          description: "Build iOS and Android versions",
          dueDate: "Feb 15, 2025",
          teamAvatars: 3,
        },
      ],
    },
    {
      status: "Completed",
      items: [
        {
          title: "User Research",
          priority: "Completed",
          description: "Conduct user interviews and surveys",
          dueDate: "Jan 10, 2025",
          teamAvatars: 2,
        },
      ],
    },
  ];

  /**
   * calling fetching project function after component mount
   */
  useEffect(() => {
    getAllProject();
  }, []);
  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Active Projects</h2>
        <Button
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          btntext="New Project"
        />
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

const tasks = [
  {
    title: "Website Redesign",
    description: "Update the company website with new branding guidelines",
    assignedTo: "Sarah Johnson",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    status: "In Progress",
    priority: "High Priority",
    dueDate: "Jan 15, 2025",
  },
  {
    title: "Mobile App Testing",
    description: "Conduct user testing for the new mobile app features",
    assignedTo: "Mike Chen",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    status: "Pending",
    priority: "Low Priority",
    dueDate: "Jan 20, 2025",
  },
];

const AddTask = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    assignTo: "",
    status: "",
    priority: "",
    dueDate: "",
  });
  const [projectArr, setProjectArr] = useState([]);
  const [error, setError] = useState({});
  /**
   * Handle input field value change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  /**
   * handle submit the form
   * check validation
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const error = checkValidation(formData, Object.keys(formData));
    if (error) {
      setError({ ...error });
      return;
    }
    setError({});
  };
  const handleTaskSubmit = async () => {
    try {
      const option = {
        method: "GET",
        url: `${import.meta.env.VITE_SERVER_URL}/api/v1/admin/get-team-user`,
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const response = await axios.request(option);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  const getAllProject = async () => {
    try {
      // setIsloading(true);
      const option = {
        method: "GET",
        url: `${import.meta.env.VITE_SERVER_URL}/api/v1/project/get-projects`,
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };

      const response = await axios.request(option);
      setProjectArr(() => {
        return response?.data?.projects?.flatMap((project) =>
          (project.items || []).map((item) => ({
            id: item?._id,
            value: item?._id,
            name: item?.title,
          }))
        );
        // });
      });
    } catch (error) {
      console.log(error);
    } finally {
      // setIsloading(false);
    }
  };

  const getProjectTeamMember = async () => {
    try {
      const option = {
        method: "GET",
        url: `${
          import.meta.env.VITE_SERVER_URL
        }/api/v1/admin/get-project-members`,
        params: {
          projectId: formData.projectId || "dskjdk",
        },
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const response = await axios.request(option);
      console(response);
    } catch (error) {
      console.log(error);
    }
  };
  /***
   * console for debug
   */
  console.log(formData);
  useEffect(() => {
    if (projectArr.length < 1) {
      getAllProject();
    }
  }, [projectArr]);
  useEffect(() => {
    if (formData.projectId) {
      getProjectTeamMember();
    }
  }, [formData.projectId]);
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Create New Task
        </h1>
        <p className="text-gray-500 mt-1">
          Fill in the details below to create a new task
        </p>
      </div>

      <form className="space-y-6">
        {/* title field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Task Title
          </label>
          <Input
            type="text"
            name={"title"}
            id={"title"}
            className={"w-full px-4 py-3 rounded-lg border border-gray-200"}
            placeholder="Enter task title"
            onChange={handleChange}
            value={formData.title}
          />
          {error.title && (
            <p className="text-red-500 text-sm ml-2 font-medium mt-1">
              {error?.title}
            </p>
          )}
        </div>
        {/* description field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>

          <TextArea
            className={
              "w-full px-4 py-3 rounded-lg border border-gray-200   h-32"
            }
            placeholder="Enter task description"
            name={"description"}
            id={"description"}
            onChange={handleChange}
            value={formData.description}
          />
          {error.description && (
            <p className="text-red-500 text-sm ml-2 font-medium mt-1">
              {error?.description}
            </p>
          )}
        </div>

        {/* ProjectId field Assign to field */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ProjectId field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Project
            </label>
            <div className="relative">
              <Select
                className={
                  "w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200"
                }
                name="projectId"
                onChange={handleChange}
                id={"projectId"}
                value={formData.projectId}
                itemArray={projectArr}
                displayName={"Select Project Name"}
              />
            </div>

            {error.projectId && (
              <p className="text-red-500 text-sm ml-2 font-medium mt-1">
                {error?.projectId}
              </p>
            )}
          </div>

          {/* Assign to field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Assigned To
            </label>
            <div className="relative">
              <Select
                className={
                  "w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 disabled:opacity-60"
                }
                id={"assinTo"}
                name="assignTo"
                onChange={handleChange}
                value={formData.assignTo}
                disabled={!formData?.projectId}
                displayName={"Selcet member"}
                onFocus={() => console.log("helo")}
              />
            </div>
            {error.assignTo && (
              <p className="text-red-500 text-sm ml-2 font-medium mt-1">
                {error?.assignTo}
              </p>
            )}
          </div>
        </div>
        {/* status priority dueDate field */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* status field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            {/* <div className="relative"> */}

            <Select
              className={
                "w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200"
              }
              displayName={"Select Status"}
              id="status"
              name="status"
              itemArray={[
                { id: 1, name: "Pending", value: "pending" },
                { id: 2, name: "In Progress", value: "in progress" },
                { id: 3, name: "Completed", value: "completed" },
              ]}
              value={formData.status}
              onChange={handleChange}
            />
            {error.status && (
              <p className="text-red-500 text-sm ml-2 font-medium mt-1">
                {error?.status}
              </p>
            )}
          </div>

          {/* priority field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Priority
            </label>

            <Select
              displayName={"Select Priority"}
              id="priority"
              name="priority"
              className={
                "w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200"
              }
              itemArray={[
                {
                  id: 1,
                  name: "Low",
                  value: "low",
                },
                {
                  id: 2,
                  name: "Medium",
                  value: "medium",
                },
                {
                  id: 3,
                  name: "High",
                  value: "high",
                },
              ]}
              value={formData.priority}
              onChange={handleChange}
            />
            {error.priority && (
              <p className="text-red-500 text-sm ml-2 font-medium mt-1">
                {error?.priority}
              </p>
            )}
          </div>

          {/*dueDate Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Due Date
            </label>

            <Input
              type="date"
              name={"dueDate"}
              id="dueDate"
              className={
                "w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200"
              }
              value={formData.dueDate}
              onChange={handleChange}
            />
            {error.dueDate && (
              <p className="text-red-500 text-sm ml-2 font-medium mt-1">
                {error?.dueDate}
              </p>
            )}
          </div>
        </div>
        {/* submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            btntext="Create Task"
            onClick={handleSubmit}
          />
        </div>
      </form>
    </div>
  );
};

const TaskDashboard = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const { userDetail } = useUserDetail();
  const handleToggle = () => {
    setShowAddTask((prev) => !prev);
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      {showAddTask && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Tasks Overview</h2>
              <p className="text-sm text-gray-500">
                Manage and track your team’s tasks
              </p>
            </div>
            {userDetail?.role === "admin" && (
              <Button
                className="p-2 text-white rounded-md bg-blue-600 hover:bg-blue-700 cursor-pointer"
                btntext="Add New Task"
                onClick={handleToggle}
              />
            )}
          </div>

          <div className="flex gap-4 mb-6">
            {[
              {
                id: "status",
                name: "status",
                displayName: "All Status",
                className: "w-1/3  border px-3 py-2 rounded",
                children: [
                  { id: 1, name: "To Do", value: "to do" },
                  { id: 2, name: "In Progress", value: "in progress" },
                  { id: 3, name: "Completed", value: "completed" },
                ],
              },
              {
                name: "priority",
                // value={formData.priority}
                // onChange={handleChange}
                className: " w-1/3 border px-3 py-2 rounded",
                displayName: "Select Priority",
                children: [
                  { id: 1, name: "Low", value: "low" },
                  { id: 2, name: "Medium", value: "medium" },
                  { id: 3, name: "High", value: "high" },
                  { id: 4, name: "Urgent", value: "urgent" },
                ],
              },
              {
                name: "priority",
                // value={formData.priority}
                // onChange={handleChange}
                className: "w-1/3 border px-3 py-2 rounded",
                displayName: "Select Priority",
                children: [{ id: 1, name: "Me", value: "me" }],
              },
            ].map((item) => (
              <Select
                key={item.id}
                name={item.name}
                id={item.id}
                className={item.className}
                displayName={item.displayName}
                itemArray={item.children}
              />
            ))}
          </div>

          {/* Task Cards */}
          <div className="space-y-4">
            {tasks.map((task, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 shadow-sm bg-white"
              >
                <div className="p-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <img
                        src={task.avatar}
                        alt={task.assignedTo}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-gray-800">
                        {task.assignedTo}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 ${
                          task.status === "Pending"
                            ? "bg-blue-100 text-blue-700"
                            : task.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {task.status}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          task.priority === "High Priority"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        {/* <CalendarDays size={16} /> Due {task.dueDate} */}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {!showAddTask && <AddTask />}
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
    { id: 2, name: "Projects", component: Project, icon: "" },
    { id: 3, name: "Task", component: TaskDashboard, icon: "" },
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
