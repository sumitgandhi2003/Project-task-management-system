import Task from "../model/task.model.js";
const createTask = async (req, res) => {
  const { title, description, projectId, assignTo, status, priority, dueDate } =
    req.body;
  if (
    [title, description, projectId, assignTo, status, priority, dueDate].some(
      (item) => item?.trim() === ""
    )
  ) {
    throw {
      statusCode: 400,
      message: "required field is missing",
    };
  }
  const createTask = await Task({
    title,
    description,
    projectId,
    assignedTo: assignTo,
    status,
    priority,
    dueDate,
  });
  await createTask.save();

  res
    ?.status(201)
    .json({ sucess: true, message: "task Created", data: createTask });
};
const getAllTask = async (req, res) => {
  try {
    const tasks = await Task.find({}).populate("assignedTo", "name email");
    res.status(200).json({ message: "All tasks", tasks });
  } catch (error) {
    next(error);
  }
};
const getTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId).populate(
      "assignedTo",
      "name email"
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task found", task });
  } catch (error) {
    next(error);
  }
};
export { createTask, getAllTask, getTaskById };
