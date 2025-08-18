import prisma from "../utils/prisma.js";

class Taskcontroller {
  createTask = async (req, res) => {
    const { userID, projectID, taskData } = req.body;
    const { content, assignedTo, startDate, endDate, status } = taskData;

    if (!content || !startDate || !endDate) {
      return res.status(400).json({
        msg: "Missing required task data (content, startDate, endDate)",
      });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userID },
      });
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      const project = await prisma.project.findFirst({
        where: {
          id: parseInt(projectID),
          userId: userID,
        },
      });
      if (!project) {
        return res.status(404).json({ msg: "Project not found" });
      }

      // Validate status
      const validStatuses = ["todo", "inprogress", "completed", "overdue"];
      if (status && !validStatuses.includes(status)) {
        return res.status(400).json({
          msg: "Invalid status. Must be one of: todo, inprogress, completed, overdue",
        });
      }

      // Validate dates
      const newStartDate = new Date(startDate);
      const newEndDate = new Date(endDate);

      if (isNaN(newStartDate.getTime()) || isNaN(newEndDate.getTime())) {
        return res.status(400).json({ msg: "Invalid date format" });
      }

      if (newStartDate >= newEndDate) {
        return res
          .status(400)
          .json({ msg: "Start date must be before end date" });
      }

      const newTask = await prisma.task.create({
        data: {
          content,
          assignedTo,
          startDate: newStartDate,
          endDate: newEndDate,
          status: status || "todo",
          projectId: parseInt(projectID),
        },
      });

      res.status(201).json(newTask);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Error creating task", err: err.message });
    }
  };

  getTaskForProject = async (req, res) => {
    const { userID, projectID } = req.params;

    try {
      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: userID },
      });
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      // Verify project exists and belongs to user
      const project = await prisma.project.findFirst({
        where: {
          id: parseInt(projectID),
          userId: userID,
        },
      });
      if (!project) {
        return res.status(404).json({ msg: "Project not found" });
      }

      const tasks = await prisma.task.findMany({
        where: { projectId: parseInt(projectID) },
      });

      res.status(200).json(tasks);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Error fetching tasks", err: err.message });
    }
  };

  updateTaskStatus = async (req, res) => {
    const { userID, projectID, taskID, status } = req.body;

    if (!status) {
      return res.status(400).json({ msg: "Status is required" });
    }

    const validStatuses = ["todo", "inprogress", "completed", "overdue"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        msg: "Invalid status. Must be one of: todo, inprogress, completed, overdue",
      });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userID },
      });
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      const project = await prisma.project.findFirst({
        where: {
          id: parseInt(projectID),
          userId: userID,
        },
      });
      if (!project) {
        return res.status(404).json({ msg: "Project not found" });
      }

      // Verify task exists and belongs to project
      const task = await prisma.task.findFirst({
        where: {
          id: parseInt(taskID),
          projectId: parseInt(projectID),
        },
      });
      if (!task) {
        return res.status(404).json({ msg: "Task not found" });
      }

      // Update task status
      const updatedTask = await prisma.task.update({
        where: { id: parseInt(taskID) },
        data: { status },
      });

      res.status(200).json({
        msg: "Task status updated successfully",
        task: updatedTask,
      });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ msg: "Error updating task status", err: err.message });
    }
  };

  updateTaskTitle = async (req, res) => {
    const { userID, projectID, taskID } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ msg: "Content is required" });
    }

    try {
      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: userID },
      });
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      // Verify project exists and belongs to user
      const project = await prisma.project.findFirst({
        where: {
          id: parseInt(projectID),
          userId: userID,
        },
      });
      if (!project) {
        return res.status(404).json({ msg: "Project not found" });
      }

      // Verify task exists and belongs to project
      const task = await prisma.task.findFirst({
        where: {
          id: parseInt(taskID),
          projectId: parseInt(projectID),
        },
      });
      if (!task) {
        return res.status(404).json({ msg: "Task not found" });
      }

      // Update task content
      const updatedTask = await prisma.task.update({
        where: { id: parseInt(taskID) },
        data: { content },
      });

      res.status(200).json({
        msg: "Task content updated successfully",
        task: updatedTask,
      });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ msg: "Error updating task content", err: err.message });
    }
  };

  updateTaskDescription = async (req, res) => {
    const { userID, projectID, taskID } = req.params;
    const { content } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userID },
      });
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      // Verify project exists and belongs to user
      const project = await prisma.project.findFirst({
        where: {
          id: parseInt(projectID),
          userId: userID,
        },
      });
      if (!project) {
        return res.status(404).json({ msg: "Project not found" });
      }

      // Verify task exists and belongs to project
      const task = await prisma.task.findFirst({
        where: {
          id: parseInt(taskID),
          projectId: parseInt(projectID),
        },
      });
      if (!task) {
        return res.status(404).json({ msg: "Task not found" });
      }

      // Update task content
      const updatedTask = await prisma.task.update({
        where: { id: parseInt(taskID) },
        data: { content },
      });

      res.status(200).json({
        msg: "Task content updated successfully",
        task: updatedTask,
      });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ msg: "Error updating task content", err: err.message });
    }
  };

  updateTaskAssignTo = async (req, res) => {
    const { userID, projectID, taskID } = req.params;
    const { assignedTo } = req.body;

    try {
      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: userID },
      });
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      // Verify project exists and belongs to user
      const project = await prisma.project.findFirst({
        where: {
          id: parseInt(projectID),
          userId: userID,
        },
      });
      if (!project) {
        return res.status(404).json({ msg: "Project not found" });
      }

      // Verify task exists and belongs to project
      const task = await prisma.task.findFirst({
        where: {
          id: parseInt(taskID),
          projectId: parseInt(projectID),
        },
      });
      if (!task) {
        return res.status(404).json({ msg: "Task not found" });
      }

      // Update task assignment
      const updatedTask = await prisma.task.update({
        where: { id: parseInt(taskID) },
        data: { assignedTo },
      });

      res.status(200).json({
        msg: "Task assignment updated successfully",
        task: updatedTask,
      });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ msg: "Error updating task assignment", err: err.message });
    }
  };

  updateTaskStartDate = async (req, res) => {
    const { userID, projectID, taskID } = req.params;
    const { startDate } = req.body;

    if (!startDate) {
      return res.status(400).json({ msg: "Start date is required" });
    }

    const newStartDate = new Date(startDate);
    if (isNaN(newStartDate.getTime())) {
      return res.status(400).json({ msg: "Invalid start date format" });
    }

    try {
      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: userID },
      });
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      // Verify project exists and belongs to user
      const project = await prisma.project.findFirst({
        where: {
          id: parseInt(projectID),
          userId: userID,
        },
      });
      if (!project) {
        return res.status(404).json({ msg: "Project not found" });
      }

      // Verify task exists and belongs to project
      const task = await prisma.task.findFirst({
        where: {
          id: parseInt(taskID),
          projectId: parseInt(projectID),
        },
      });
      if (!task) {
        return res.status(404).json({ msg: "Task not found" });
      }

      // Check if new start date is before end date
      if (task.endDate && newStartDate >= new Date(task.endDate)) {
        return res
          .status(400)
          .json({ msg: "Start date must be before end date" });
      }

      // Update task start date
      const updatedTask = await prisma.task.update({
        where: { id: parseInt(taskID) },
        data: { startDate: newStartDate },
      });

      res.status(200).json({
        msg: "Task start date updated successfully",
        task: updatedTask,
      });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ msg: "Error updating task start date", err: err.message });
    }
  };

  updateTaskEndDate = async (req, res) => {
    const { userID, projectID, taskID } = req.params;
    const { endDate } = req.body;

    if (!endDate) {
      return res.status(400).json({ msg: "End date is required" });
    }

    const newEndDate = new Date(endDate);
    if (isNaN(newEndDate.getTime())) {
      return res.status(400).json({ msg: "Invalid end date format" });
    }

    try {
      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: userID },
      });
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      // Verify project exists and belongs to user
      const project = await prisma.project.findFirst({
        where: {
          id: parseInt(projectID),
          userId: userID,
        },
      });
      if (!project) {
        return res.status(404).json({ msg: "Project not found" });
      }

      // Verify task exists and belongs to project
      const task = await prisma.task.findFirst({
        where: {
          id: parseInt(taskID),
          projectId: parseInt(projectID),
        },
      });
      if (!task) {
        return res.status(404).json({ msg: "Task not found" });
      }

      // Check if new end date is after start date
      if (newEndDate <= new Date(task.startDate)) {
        return res
          .status(400)
          .json({ msg: "End date must be after start date" });
      }

      // Update task end date
      const updatedTask = await prisma.task.update({
        where: { id: parseInt(taskID) },
        data: { endDate: newEndDate },
      });

      res.status(200).json({
        msg: "Task end date updated successfully",
        task: updatedTask,
      });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ msg: "Error updating task end date", err: err.message });
    }
  };

  getTaskById = async (req, res) => {
    const { userID, projectID, taskID } = req.params;

    try {
      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: userID },
      });
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      // Verify project exists and belongs to user
      const project = await prisma.project.findFirst({
        where: {
          id: parseInt(projectID),
          userId: userID,
        },
      });
      if (!project) {
        return res.status(404).json({ msg: "Project not found" });
      }

      // Get task by ID and verify it belongs to project
      const task = await prisma.task.findFirst({
        where: {
          id: parseInt(taskID),
          projectId: parseInt(projectID),
        },
      });
      if (!task) {
        return res.status(404).json({ msg: "Task not found" });
      }

      res.status(200).json(task);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Error fetching task", err: err.message });
    }
  };

  deleteTask = async (req, res) => {
    const { userID, projectID, taskID } = req.params;

    try {
      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: userID },
      });
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      // Verify project exists and belongs to user
      const project = await prisma.project.findFirst({
        where: {
          id: parseInt(projectID),
          userId: userID,
        },
      });
      if (!project) {
        return res.status(404).json({ msg: "Project not found" });
      }

      // Verify task exists and belongs to project
      const task = await prisma.task.findFirst({
        where: {
          id: parseInt(taskID),
          projectId: parseInt(projectID),
        },
      });
      if (!task) {
        return res.status(404).json({ msg: "Task not found" });
      }

      // Delete the task
      await prisma.task.delete({
        where: { id: parseInt(taskID) },
      });

      res.status(200).json({ msg: "Task deleted successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Error deleting task", err: err.message });
    }
  };
}

export default Taskcontroller;
