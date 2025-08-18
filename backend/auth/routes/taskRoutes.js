import express from "express";
import Taskcontroller from "../controllers/taskcontroller.js";

const router = express.Router();
const taskController = new Taskcontroller();

router.post("/create", taskController.createTask);
router.get(
  "/:userID/projects/:projectID/tasks",
  taskController.getTaskForProject
);
router.get(
  "/:userID/projects/:projectID/tasks/:taskID",
  taskController.getTaskById
);
router.put("/update-status", taskController.updateTaskStatus);
router.put(
  "/:userID/projects/:projectID/tasks/:taskID/title",
  taskController.updateTaskTitle
);
router.put(
  "/:userID/projects/:projectID/tasks/:taskID/description",
  taskController.updateTaskDescription
);
router.put(
  "/:userID/projects/:projectID/tasks/:taskID/assign",
  taskController.updateTaskAssignTo
);
router.put(
  "/:userID/projects/:projectID/tasks/:taskID/start-date",
  taskController.updateTaskStartDate
);
router.put(
  "/:userID/projects/:projectID/tasks/:taskID/end-date",
  taskController.updateTaskEndDate
);
router.delete(
  "/:userID/projects/:projectID/tasks/:taskID",
  taskController.deleteTask
);

export default router;
