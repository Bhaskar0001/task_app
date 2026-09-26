import { body, param } from 'express-validator';
import { validationHandler } from './auth.validator';

export const validateTaskId = [
  param('id').isMongoId().withMessage('Invalid task ID'),
  validationHandler,
];

export const validateCreateTask = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }).withMessage('Title must be 200 characters or less'),
  body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description must be 2000 characters or less'),
  body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Priority must be Low, Medium, or High'),
  body('status').optional().isIn(['Pending', 'In Progress', 'Completed']).withMessage('Status must be Pending, In Progress, or Completed'),
  body('dueDate').optional({ values: 'null' }).isISO8601().withMessage('Invalid date format'),
  validationHandler,
];

export const validateUpdateTask = [
  param('id').isMongoId().withMessage('Invalid task ID'),
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty').isLength({ max: 200 }).withMessage('Title must be 200 characters or less'),
  body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description must be 2000 characters or less'),
  body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Priority must be Low, Medium, or High'),
  body('status').optional().isIn(['Pending', 'In Progress', 'Completed']).withMessage('Status must be Pending, In Progress, or Completed'),
  body('dueDate').optional({ values: 'null' }).isISO8601().withMessage('Invalid date format'),
  validationHandler,
];

export const validateUpdateStatus = [
  param('id').isMongoId().withMessage('Invalid task ID'),
  body('status').notEmpty().withMessage('Status is required').isIn(['Pending', 'In Progress', 'Completed']).withMessage('Status must be Pending, In Progress, or Completed'),
  validationHandler,
];
