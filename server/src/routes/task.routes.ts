import { Router } from 'express';
import { getTasks, getTaskById, createTask, updateTask, updateTaskStatus, deleteTask } from '../controllers/task.controller';
import { validateCreateTask, validateUpdateTask, validateUpdateStatus } from '../validators/task.validator';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', validateCreateTask, createTask);
router.put('/:id', validateUpdateTask, updateTask);
router.patch('/:id/status', validateUpdateStatus, updateTaskStatus);
router.delete('/:id', deleteTask);

export default router;
