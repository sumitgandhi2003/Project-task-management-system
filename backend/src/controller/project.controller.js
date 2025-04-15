import Project from "../model/project.model.js";
export const createProject = async (req, res, next) => {
  try {
    const {
      title,
      description,
      team = [],
      status,
      priority,
      dueDate,
    } = req.body;
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    console.log(req.body);
    // return;

    if (
      !title ||
      !description ||
      !team?.length ||
      !status ||
      !priority ||
      !dueDate
    ) {
      throw {
        statusCode: 400,
        message: "All fields are required!",
      };
    }

    const project = new Project({
      title,
      description,
      assignedTo: team,
      status: status?.trim()?.toLowerCase(),
      priority: priority?.trim().toLowerCase(),
      dueDate,
      createdBy: req.user._id,
    });

    await project.save();
    res.status(201).json({ message: "Project created", project });
  } catch (error) {
    next(error);
  }
};

export const getAllProjects = async (req, res, next) => {
  const userId = req.user._id;
  const scope = req.query?.scope;
  console.log(scope);
  let query = {};

  if (req?.user?.role !== "admin" && scope === "me") {
    query.assignedTo = { $in: [userId] };
  }
  console.log(query);
  try {
    const projects = await Project.find(query).populate(
      "createdBy",
      "name email"
    );

    const grouped = {
      "to do": [],
      "in progress": [],
      completed: [],
    };

    projects.forEach((project) => {
      if (grouped[project.status]) {
        grouped[project.status].push(project);
      } else {
        grouped[project.status] = [project]; // handle any new status dynamically
      }
    });

    const formatted = Object.entries(grouped).map(([status, items]) => ({
      status,
      items,
    }));
    res.status(200).json({ message: "All projects", projects: formatted });
  } catch (error) {
    next(error);
  }
};
