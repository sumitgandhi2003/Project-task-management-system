import { useEffect, useState } from "react";
import { useUserDetail } from "../../context/userContext";
import axios from "axios";
import {
  getPriorityColor,
  getStatusColor,
  toCapitalizeCase,
} from "../../utility/constants";
import AddProject from "./AddProject";
import { BiLoaderAlt } from "react-icons/bi";
import { Button } from "../../Libs";

const ProjectDashBoard = () => {
  const [showAddProject, setShowAddProject] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [projectArr, setProjectArr] = useState([]);
  const { userDetail } = useUserDetail();
  const handleToggle = () => {
    setShowAddProject((prev) => !prev);
  };

  /***
   * fetching all project
   */
  const getAllProject = async () => {
    try {
      setIsPending(true);
      const option = {
        method: "GET",
        url: `${import.meta.env.VITE_SERVER_URL}/api/v1/project/get-projects`,
        params: {
          scope: "all",
        },
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const response = await axios.request(option);
      console.log(response);
      setProjectArr(() => {
        const allProjects = response.data?.projects.flatMap(
          (statusGroup) => statusGroup.items || []
        );
        return allProjects;
      });
      console.log;
    } catch (error) {
      console.log(error);
    } finally {
      setIsPending(false);
    }
  };

  console.log(projectArr);

  useEffect(() => {
    getAllProject();
  }, []);
  return (
    <div className="flex  flex-1 bg-gray-50 w-full">
      {!showAddProject && (
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Projects Overview</h1>
              <p className="text-gray-500">
                Manage and track your team’s projects
              </p>
            </div>
            {userDetail?.role === "admin" && (
              <Button
                className="p-2 text-white rounded-md bg-blue-600 hover:bg-blue-700 cursor-pointer"
                btntext="Add New Project"
                onClick={handleToggle}
              />
            )}
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 ${
              (projectArr?.length < 1 && !isPending) || isPending
                ? "h-full"
                : ""
            }`}
          >
            {projectArr.map((project, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-semibold text-lg">{project.title}</h2>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {toCapitalizeCase(project.status)}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-2">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        project.priority
                      )}`}
                    >
                      {toCapitalizeCase(project.priority)} Priority
                    </span>
                    <span className="text-gray-500">
                      Due: {project.dueDate}
                    </span>
                  </div>
                  <div className="mt-4 flex -space-x-2">
                    {/* {project.users.map((user, i) => (
                    <Avatar
                      key={i}
                      className="w-7 h-7 border-2 border-white bg-gray-200"
                    >
                      <span className="text-xs">{user}</span>
                    </Avatar>
                  ))} */}
                  </div>
                </div>
              </div>
            ))}
            {isPending && (
              <div className="flex flex-1/2 h-full justify-center items-center w-full col-span-3">
                <BiLoaderAlt className="animate-spin h-14 w-14" />
              </div>
            )}
            {projectArr?.length < 1 && !isPending && (
              <div className="flex flex-1/2 h-full justify-center items-center w-full col-span-3">
                <p>OOPS Nothing to display</p>
              </div>
            )}
          </div>
        </main>
      )}
      {showAddProject && <AddProject onClose={handleToggle} />}
    </div>
  );
};
export default ProjectDashBoard;
