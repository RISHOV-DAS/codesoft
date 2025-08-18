import express from "express";
import Projectcontroller from "../controllers/projectcontroller.js";

const router = express.Router();
const projectcontroller = new Projectcontroller();

//create project
router.post("/create", projectcontroller.createProject);

//project by userId
router.get("/:userId", projectcontroller.getProjectForUser);

//project by projectId
router.get("/:userId/:projectId", projectcontroller.getProjectForId);

//update title
router.put("/:userId/:projectId/title", projectcontroller.updateProjectTitle);

//update description
router.put(
  "/:userId/:projectId/description",
  projectcontroller.updateProjectDescription
);

//update startdate
router.put(
  "/:userId/:projectId/start-date",
  projectcontroller.updateProjectStartDate
);

//update endate
router.put(
  "/:userId/:projectId/end-date",
  projectcontroller.updateProjectEndDate
);

//update status
router.put("/:userId/:projectId/status", projectcontroller.updateStatus);

//delete project
router.delete("/:userId/:projectId", projectcontroller.deleteProject);
export default router;
