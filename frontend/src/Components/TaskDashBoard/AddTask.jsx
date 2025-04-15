import { useEffect, useState } from "react";
import { Button, Input, Select, TextArea } from "../../Libs";
import axios from "axios";
import { checkValidation } from "../../utility/constants";

export const AddTask = ({ onClose }) => {
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
  const [projectMemberArr, setProjectMemberArr] = useState([]);
  const [error, setError] = useState({});
  const [isPending, setIsPending] = useState(false);
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
    handleTaskSubmit();
  };

  /***
   * Handle Task Submit to database via backend
   */
  const handleTaskSubmit = async () => {
    try {
      setIsPending(true);
      const option = {
        method: "POST",
        url: `${import.meta.env.VITE_SERVER_URL}/api/v1/task/create-task`,
        data: {
          ...formData,
        },
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const response = await axios.request(option);

      console.log(response);
      onClose();
    } catch (error) {
      console.log(error);
      setError((prev) => ({
        ...prev,
        submitError: error?.response?.data?.message,
      }));
    } finally {
      setIsPending(false);
    }
  };

  /***
   * Get all project data for create task
   */
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

  /***
   * Getting Team member of selected Project
   */
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
      setProjectMemberArr(response.data?.data?.assignedTo);
      console(response);
    } catch (error) {
      console.log(error);
    }
  };
  /***
   * console for debug
   */
  console.log(formData);

  /***
   * caliing function for fetching all prject when project array is empty
   */
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                id={"assignTo"}
                name="assignTo"
                onChange={handleChange}
                value={formData.assignTo}
                disabled={!formData?.projectId}
                displayName={"Selcet member"}
                onFocus={() => console.log("helo")}
                itemArray={projectMemberArr}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Submit Api Error */}
        <div className="space-y-2">
          {error.submitError && (
            <p className="text-red-500 text-sm ml-2 font-medium mt-1">
              {error?.submitError}
            </p>
          )}
        </div>
        {/* submit Button */}
        <div className="pt-4 flex gap-4">
          <Button
            type="submit"
            className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer"
            btntext={`${isPending ? "Creating..." : "Create Task"}`}
            onClick={handleSubmit}
            disabled={isPending}
          />
          <Button
            className="w-full md:w-auto px-8 py-3 bg-blue-300 text-white hover:bg-blue-700 hover:text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer"
            btntext={"Cancel"}
            onClick={onClose}
            disabled={isPending}
          />
        </div>
      </form>
    </div>
  );
};
