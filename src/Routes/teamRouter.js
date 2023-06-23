const { Router } = require('express');
const { getAllTeam, createTeam, updateTeam, deleteTeam, getOneTeam, getNameTeam, teamUser, nameTeamUser} = require('../controllers/team.controllers')
const {authByRoleId} = require('../middlewares/authorize');

const teamRouter = Router();

teamRouter.get('/', getAllTeam);
teamRouter.post('/create', authByRoleId, createTeam);
teamRouter.put('/update/:id', authByRoleId, updateTeam);
teamRouter.delete('/delete/:id', authByRoleId, deleteTeam);
teamRouter.get('/getOne/:id', getOneTeam);
teamRouter.get('/getName', getNameTeam);
teamRouter.get('/:id/users', teamUser);
teamRouter.get('/users', nameTeamUser);

module.exports = teamRouter;