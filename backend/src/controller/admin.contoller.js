import User from "../model/user.model.js";

export const getTeamUser = async (req, res) => {
  console.log(req.user, "user in admin controller");
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    const allTeamMember = await User.find({}).select("name  employeeId ");
    console.log(allTeamMember, "all team member");
    if (!allTeamMember) {
      return res.status(404).json({ message: "No team member found" });
    }
    res.status(200).json({ message: "All team members", allTeamMember });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
