const { Router } = require('express');
const { getAllTask, createTask, updateTask, deleteTask, getOneTask } = require('../controllers/task.controllers')
const {authByRoleId} = require('../middlewares/authorize');

const taskRouter = Router();

taskRouter.get('/', getAllTask);
taskRouter.post('/create', authByRoleId, createTask);
taskRouter.put('/update/:id', authByRoleId, updateTask);
taskRouter.delete('/delete/:id', authByRoleId, deleteTask);
taskRouter.get('/getOne/:id', getOneTask);

module.exports = taskRouter;