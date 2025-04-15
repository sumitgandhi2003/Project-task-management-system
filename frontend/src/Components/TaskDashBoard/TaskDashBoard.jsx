import { useEffect, useState } from "react";
import { useUserDetail } from "../../context/userContext";
import axios from "axios";
import { Button, Select } from "../../Libs";
import { toCapitalizeCase } from "../../utility/constants";
import { BiLoaderAlt } from "react-icons/bi";
import { AddTask } from "./AddTask";
const TaskDashBoard = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskArr, setTaskArr] = useState([]);
  const { userDetail } = useUserDetail();
  const [filterdTaskArr, setFilterdTaskArr] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    assignedTo: "", // assuming this is the last one
  });
  const [isPending, setIsLoading] = useState(false);
  const handleToggle = () => {
    setShowAddTask((prev) => !prev);
  };
  const getAllTask = async () => {
    try {
      setIsLoading(true);
      const option = {
        method: "GET",
        url: `${import.meta.env.VITE_SERVER_URL}/api/v1/task/get-all-task`,

        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const response = await axios.request(option);
      setTaskArr(response.data?.tasks);
      setFilterdTaskArr(response.data?.tasks);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Debug
   * console
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedFilters = {
      ...filters,
      [name]: value,
    };
    setFilters((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });

    setFilters(updatedFilters);

    const isAllEmpty = Object.values(updatedFilters).every((val) => val === "");

    if (isAllEmpty) {
      setFilterdTaskArr(taskArr);
      return;
    }
    const filtered = filterdTaskArr.filter((task) => {
      return Object.entries(updatedFilters).every(([key, val]) => {
        if (!val) return true; // skip if filter is empty
        return task[key]?.toLowerCase() === val?.toLowerCase();
      });
    });
    setFilterdTaskArr(filtered);
  };
  useEffect(() => {
    getAllTask();
  }, [showAddTask]);
  return (
    <div className="flex-1 p-6 bg-gray-50">
      {!showAddTask && (
        <div className="h-full flex flex-col">
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
                className:
                  "w-1/2  border px-3 py-2 rounded-md border-2 cursor-pointer",
                children: [
                  { id: 1, name: "Pending", value: "pending" },
                  { id: 2, name: "In Progress", value: "in progress" },
                  { id: 3, name: "Completed", value: "completed" },
                ],
              },
              {
                name: "priority",
                // value={formData.priority}
                // onChange={handleChange}
                className:
                  " w-1/2 border px-3 py-2 rounded-md border-2 cursor-pointer",
                displayName: "Select Priority",
                children: [
                  { id: 1, name: "Low", value: "low" },
                  { id: 2, name: "Medium", value: "medium" },
                  { id: 3, name: "High", value: "high" },
                  { id: 4, name: "Urgent", value: "urgent" },
                ],
              },
              // {
              //   name: "assignedTo",
              //   // value={formData.priority}
              //   // onChange={handleChange}
              //   className: "w-1/3 border px-3 py-2 rounded",
              //   displayName: "Select Priority",
              //   children: [{ id: 1, name: "Me", value: "me" }],
              // },
            ].map((item) => (
              <Select
                key={item.id}
                name={item.name}
                id={item.id}
                className={item.className}
                displayName={item.displayName}
                itemArray={item.children}
                onChange={handleChange}
              />
            ))}
          </div>

          {/* Task Cards */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6   ${
              (filterdTaskArr?.length < 1 && !isPending) || isPending
                ? "h-full"
                : ""
            }`}
          >
            {filterdTaskArr?.map((task) => (
              <div
                key={task?.["_id"]}
                className="rounded-xl shadow-sm border border-gray-100 p-6 bg-white"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold">
                    {toCapitalizeCase(task?.title)}
                  </h3>
                  <p className="text-sm text-gray-600">{task?.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <img
                      src={task.avatar}
                      alt={task.assignedTo}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-gray-800">
                      {toCapitalizeCase(task?.assignedTo?.name)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 ${
                        task?.status === "pending"
                          ? "bg-blue-100 text-blue-700"
                          : task.status === "n progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {toCapitalizeCase(task.status)}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {toCapitalizeCase(task?.priority)}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      {/* <CalendarDays size={16} /> Due {task.dueDate} */}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {isPending && (
              <div className="flex flex-1/2 h-full justify-center items-center w-full col-span-3">
                <BiLoaderAlt className="animate-spin h-14 w-14" />
              </div>
            )}
            {filterdTaskArr?.length < 1 && !isPending && (
              <div className="flex flex-1/2 col-span-3 h-full justify-center items-center w-full ">
                <p>OOPS Nothing to display</p>
              </div>
            )}
          </div>
        </div>
      )}
      {showAddTask && <AddTask onClose={handleToggle} />}
    </div>
  );
};

export default TaskDashBoard;
