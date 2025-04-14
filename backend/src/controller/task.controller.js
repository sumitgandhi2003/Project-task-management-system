import Task from "../model/task.model.js";
const createTask = async (req, res) => {
  console.log(req);
  res?.status(201);
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
