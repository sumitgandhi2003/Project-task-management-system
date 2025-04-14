import Project from "../model/project.model.js";
import User from "../model/user.model.js";
import mongoose, { Schema } from "mongoose";
export const getTeamUser = async (req, res, next) => {
  console.log(req.user, "user in admin controller");
  // const projectId = req.body.projectId;
  // const query = {
  //   role: "team",
  // };
  // if (projectId && Schema.Types.ObjectId(projectId)) query;
  try {
    if (req.user?.role !== "admin") {
      throw {
        statusCode: 403,
        message: "Access Denied you are not admin",
      };
      // return res.status(403).json({ message: "Access denied" });
    }
    const allTeamMember = await User.find({ role: "team" }).select(
      "name  employeeId "
    );
    console.log(allTeamMember, "all team member");
    if (!allTeamMember) {
      throw {
        statusCode: 404,
        message: "No team member found",
      };
      // return res.status(404).json({ message: "No team member found" });
    }
    res.status(200).json({ message: "All team members", allTeamMember });
  } catch (error) {
    console.log(error.message);
    // res.status(500).json({ message: "Internal server error" });
    next(error);
  }
};

export const getTeamMemberOfProject = async (req, res, next) => {
  try {
    const projectId = req.query?.projectId;
    console.log(req.query);
    if (req.user?.role !== "admin") {
      throw {
        statusCode: 403,
        message: "Access Denied you are not admin",
      };
    }

    if (!projectId) {
      throw {
        statusCode: 403,
        message: "projectId not provided!",
      };
    }
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw {
        status: 403,
        message: "Invalid project Id pass",
      };
    }
    const projectMemberDetail = await Project.findById(projectId)
      .populate("assignedTo", "name email")
      .select("assignedTo")
      .lean();
    console.log(projectMemberDetail);
    res.status(200).json({
      sucess: true,
      message: "data fetched successfully",
      data: projectMemberDetail,
    });
  } catch (error) {
    next(error);
  }
};
