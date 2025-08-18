import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
class Projectcontroller {
  createProject = async (req, res) => {
    const { id, projectData } = req.body;
    const { title, description, startDate, endDate, status, tasks } =
      projectData || {};
    try {
      if (!id) {
        return res.status(400).json({ msg: "Missing required field (id)" });
      }

      if (!title) {
        return res
          .status(400)
          .json({ msg: "Missing required project data (title)" });
      }

      const existingUser = await prisma.user.findUnique({
        where: { id: id },
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
          user: { connect: { id: id } },
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
        include: { task: true, user: { select: { id: true, email: true } } },
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
    const { id } = req.params;
    try {
      if (!id) {
        return res.status(400).json({ msg: "User id is required" });
      }

      const userWithProjects = await prisma.user.findUnique({
        where: { id: id },
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
        include: { task: true, user: { select: { id: true, email: true } } },
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
}
export default Projectcontroller;
