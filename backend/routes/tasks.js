const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { taskRules, taskStatusRules, validate } = require('../middleware/validate');

// All task routes are protected
router.use(protect);

router.route('/').get(getTasks).post(taskRules, validate, createTask);
router.route('/:id').get(getTask).put(taskRules, validate, updateTask).delete(deleteTask);
router.patch('/:id/status', taskStatusRules, validate, updateTaskStatus);

module.exports = router;
