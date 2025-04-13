import Project from "../model/project.model.js";
export const createProject = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    // if (!title || !description) {
    //   throw {
    //     statusCode: 400,
    //     message: "All fields are required!",
    //   };
    // }
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const project = new Project({
      title,
      description,
      createdBy: req.user._id,
    });

    await project.save();
    res.status(201).json({ message: "Project created", project });
  } catch (error) {
    next(error);
  }
};

export const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({}).populate("createdBy", "name email");
    res.status(200).json({ message: "All projects", projects });
  } catch (error) {
    next(error);
  }
};
