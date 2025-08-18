import prisma from "../utils/prisma.js";
class Projectcontroller {
  createProject = async (req, res) => {
    const { userId, projectData } = req.body;
    const { title, description, startDate, endDate, status, tasks } =
      projectData || {};
    try {
      if (!userId) {
        return res.status(400).json({ msg: "Missing required field (userId)" });
      }

      if (!title) {
        return res
          .status(400)
          .json({ msg: "Missing required project data (title)" });
      }

      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        return res.status(404).json({ msg: "User does not exist" });
      }

      const validStatuses = ["inprogress", "todo", "completed", "overdue"];
      const projectStatus =
        status && validStatuses.includes(status) ? status : undefined;

      const parsedStartDate = startDate ? new Date(startDate) : undefined;
      const parsedEndDate = endDate ? new Date(endDate) : undefined;

      const createdProject = await prisma.project.create({
        data: {
          title: title,
          description: description ?? null,
          ...(projectStatus ? { status: projectStatus } : {}),
          ...(parsedStartDate ? { startDate: parsedStartDate } : {}),
          ...(parsedEndDate ? { endDate: parsedEndDate } : {}),
          user: { connect: { id: userId } },
          ...(Array.isArray(tasks) && tasks.length > 0
            ? {
                task: {
                  create: tasks.map((task) => {
                    const taskValidStatus =
                      task?.status && validStatuses.includes(task.status)
                        ? task.status
                        : undefined;
                    const taskStart = task?.startDate
                      ? new Date(task.startDate)
                      : undefined;
                    const taskEnd = task?.endDate
                      ? new Date(task.endDate)
                      : undefined;
                    return {
                      content: task?.content,
                      assignedTo: task?.assignedTo ?? null,
                      ...(taskValidStatus ? { status: taskValidStatus } : {}),
                      ...(taskStart ? { startDate: taskStart } : {}),
                      ...(taskEnd ? { endDate: taskEnd } : {}),
                    };
                  }),
                },
              }
            : {}),
        },
        include: {
          task: true,
          user: { select: { id: true, email: true } },
        },
      });

      return res
        .status(201)
        .json({ msg: "Project created successfully", project: createdProject });
    } catch (err) {
      return res
        .status(500)
        .json({ msg: "Something went wrong", error: err.message });
    }
  };

  getProjectForUser = async (req, res) => {
    const { userId } = req.params;
    try {
      if (!userId) {
        return res.status(400).json({ msg: "User userId is required" });
      }

      const userWithProjects = await prisma.user.findUnique({
        where: { id: userId },
        include: { project: { include: { task: true } } },
      });

      if (!userWithProjects) {
        return res.status(404).json({ msg: "User not found" });
      }

      return res.status(200).json({ projects: userWithProjects.project });
    } catch (err) {
      return res
        .status(500)
        .json({ msg: "Error finding projects", error: err.message });
    }
  };

  getProjectForId = async (req, res) => {
    const { projectId } = req.params;
    try {
      const ProjectId = Number(projectId);
      if (!projectId || Number.isNaN(ProjectId)) {
        return res.status(400).json({ msg: "Valid projectId is required" });
      }

      const project = await prisma.project.findUnique({
        where: { id: ProjectId },
        include: {
          task: true,
          user: { select: { id: true, email: true } },
        },
      });

      if (!project) {
        return res.status(404).json({ msg: "Project not found" });
      }

      return res.status(200).json(project);
    } catch (err) {
      return res
        .status(500)
        .json({ msg: "Error finding project", error: err.message });
    }
  };

  updateProjectTitle = async (req, res) => {
    const { userId, projectId } = req.params;
    const { title } = req.body;

    if (!title) return res.status(400).json({ msg: "Name is required" });

    try {
      const ProjectId = Number(projectId);
      if (!projectId || Number.isNaN(ProjectId)) {
        return res.status(400).json({ msg: "Valid projectId is required" });
      }

      const existingProject = await prisma.project.findFirst({
        where: { id: ProjectId, userId: userId },
      });
      if (!existingProject) {
        return res.status(404).json({ msg: "Project not found for this user" });
      }

      const updatedProject = await prisma.project.update({
        where: { id: ProjectId },
        data: { title: title },
        include: {
          task: true,
          user: { select: { id: true, email: true } },
        },
      });

      return res.status(200).json({
        msg: "Project title updated successfully",
        project: updatedProject,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ msg: "Error updating Project title", error: err.message });
    }
  };

  updateProjectDescription = async (req, res) => {
    const { userId, projectId } = req.params;
    const { description } = req.body;

    try {
      const ProjectId = Number(projectId);
      if (!projectId || Number.isNaN(ProjectId)) {
        return res.status(400).json({ msg: "Valid projectId is required" });
      }

      const existingProject = await prisma.project.findFirst({
        where: { id: ProjectId, userId: userId },
      });
      if (!existingProject) {
        return res.status(404).json({ msg: "Project not found for this user" });
      }

      const updatedProject = await prisma.project.update({
        where: { id: ProjectId },
        data: { description: description ?? null },
        include: {
          task: true,
          user: { select: { id: true, email: true } },
        },
      });

      return res.status(200).json({
        msg: "Project description updated successfully",
        project: updatedProject,
      });
    } catch (err) {
      return res.status(500).json({
        msg: "Error updating Project description",
        error: err.message,
      });
    }
  };

  updateProjectStartDate = async (req, res) => {
    const { userId, projectId } = req.params;
    const { startDate } = req.body;

    if (!startDate)
      return res.status(400).json({ msg: "Start date is required" });

    const newStartDate = new Date(startDate);
    if (isNaN(newStartDate.getTime())) {
      return res.status(400).json({ msg: "Invalid start date format" });
    }

    try {
      const ProjectId = Number(projectId);
      if (!projectId || Number.isNaN(ProjectId)) {
        return res.status(400).json({ msg: "Valid projectId is required" });
      }

      const existingProject = await prisma.project.findFirst({
        where: { id: ProjectId, userId: userId },
      });
      if (!existingProject) {
        return res.status(404).json({ msg: "Project not found for this user" });
      }

      if (
        existingProject.endDate &&
        newStartDate >= new Date(existingProject.endDate)
      ) {
        return res
          .status(400)
          .json({ msg: "Start date must be before end date" });
      }

      const updatedProject = await prisma.project.update({
        where: { id: ProjectId },
        data: { startDate: newStartDate },
        include: {
          task: true,
          user: { select: { id: true, email: true } },
        },
      });

      return res.status(200).json({
        msg: "Project start date updated successfully",
        project: updatedProject,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ msg: "Error updating Project start date", error: err.message });
    }
  };

  updateProjectEndDate = async (req, res) => {
    const { userId, projectId } = req.params;
    const { endDate } = req.body;

    if (!endDate) return res.status(400).json({ msg: "End date is required" });

    const newEndDate = new Date(endDate);
    if (isNaN(newEndDate.getTime())) {
      return res.status(400).json({ msg: "Invalid end date format" });
    }

    try {
      const ProjectId = Number(projectId);
      if (!projectId || Number.isNaN(ProjectId)) {
        return res.status(400).json({ msg: "Valid projectId is required" });
      }

      const existingProject = await prisma.project.findFirst({
        where: { id: ProjectId, userId: userId },
      });
      if (!existingProject) {
        return res.status(404).json({ msg: "Project not found for this user" });
      }

      if (
        existingProject.startDate &&
        newEndDate <= new Date(existingProject.startDate)
      ) {
        return res
          .status(400)
          .json({ msg: "End date must be after start date" });
      }

      const updatedProject = await prisma.project.update({
        where: { id: ProjectId },
        data: { endDate: newEndDate },
        include: {
          task: true,
          user: { select: { id: true, email: true } },
        },
      });

      return res.status(200).json({
        msg: "Project end date updated successfully",
        project: updatedProject,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ msg: "Error updating Project end date", error: err.message });
    }
  };

  updateStatus = async (req, res) => {
    const { userId, projectId } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ msg: "Status is required" });
    const validStatuses = ["inprogress", "todo", "completed", "overdue"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        msg: "Invalid status. Must be one of: inprogress, todo, completed, overdue",
      });
    }

    try {
      const ProjectId = Number(projectId);
      if (!projectId || Number.isNaN(ProjectId)) {
        return res.status(400).json({ msg: "Valid projectId is required" });
      }

      const existingProject = await prisma.project.findFirst({
        where: { id: ProjectId, userId: userId },
      });
      if (!existingProject) {
        return res.status(404).json({ msg: "Project not found for this user" });
      }

      const updatedProject = await prisma.project.update({
        where: { id: ProjectId },
        data: { status },
        include: {
          task: true,
          user: { select: { id: true, email: true } },
        },
      });

      return res.status(200).json({
        msg: "Project status updated successfully",
        project: updatedProject,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ msg: "Error updating Project status", error: err.message });
    }
  };

  deleteProject = async (req, res) => {
    const { userId, projectId } = req.params;
    try {
      const ProjectId = Number(projectId);
      if (!projectId || Number.isNaN(ProjectId)) {
        return res.status(400).json({ msg: "Valid projectId is required" });
      }

      const existingProject = await prisma.project.findFirst({
        where: { id: ProjectId, userId: userId },
      });
      if (!existingProject) {
        return res.status(404).json({ msg: "Project not found for this user" });
      }

      await prisma.project.delete({ where: { id: ProjectId } });

      return res.status(200).json({ msg: "Project deleted successfully" });
    } catch (err) {
      return res
        .status(500)
        .json({ msg: "Error deleting Project", error: err.message });
    }
  };
}
export default Projectcontroller;
