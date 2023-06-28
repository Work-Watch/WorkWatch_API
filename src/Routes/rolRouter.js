const { Router } = require('express');
const { getAllRol, createRol, updateRol, deleteRol } = require('../controllers/rol.controllers');
const {authByRoleId} = require('../middlewares/authorize');

const rolRouter = Router();

rolRouter.get('/', authByRoleId, getAllRol);
rolRouter.post('/create', authByRoleId, createRol);
rolRouter.put('/update/:id', authByRoleId, updateRol);
rolRouter.delete('/delete/:id', authByRoleId, deleteRol);

module.exports = rolRouter;