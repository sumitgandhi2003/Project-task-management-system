import { useEffect, useState } from "react";
import { checkValidation } from "../../utility/constants";
import axios from "axios";
import { Button, Input, Select, TextArea } from "../../Libs";
import { BiLoaderAlt } from "react-icons/bi";
import { MdClose } from "react-icons/md";

const AddProject = ({ onClose }) => {
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
  const [isPending, setIsPending] = useState(false);

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
    setIsPending(true);
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
      onClose();
    } catch (error) {
      console.log(error);
      setErrors((prev) => ({
        ...prev,
        submitError: error?.response?.data?.message,
      }));
    } finally {
      setIsPending(false);
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
                {memberArr?.map((item) => (
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
                {memberArr?.length < 1 && (
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
        {/* Submit Api Error */}
        <div className="space-y-2">
          {errors.submitError && (
            <p className="text-red-500 text-sm ml-2 font-medium mt-1">
              {errors?.submitError}
            </p>
          )}
        </div>
        {/* Submit Button  */}
        <div className="pt-4 flex gap-4">
          <Button
            type={`${isPending ? "Submiting..." : "Submit"}`}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 cursor-pointer"
            btntext="Create Project"
            icon={
              isPending ? <BiLoaderAlt className="animate-spin h-6 w-6" /> : ""
            }
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
export default AddProject;
