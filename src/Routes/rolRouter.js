const { Router } = require('express');
const { getAllRol, createRol, updateRol, deleteRol } = require('../controllers/rol.controllers');

const rolRouter = Router();

rolRouter.get('/', getAllRol);
rolRouter.post('/create', createRol);
rolRouter.put('/update/:id', updateRol);
rolRouter.delete('/delete/:id', deleteRol);

module.exports = rolRouter;