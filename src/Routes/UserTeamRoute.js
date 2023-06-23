const { Router } = require('express');
const { getAllUserTeam, createUserTeam, updateUserTeam, deleteUserTeam } = require('../controllers/User.Team.controllers')
const {authByRoleId} = require('../middlewares/authorize');

const UserTeamRouter = Router();

UserTeamRouter.get('/', getAllUserTeam);
UserTeamRouter.post('/create', authByRoleId, createUserTeam);
UserTeamRouter.put('/update/:id', authByRoleId, updateUserTeam);
UserTeamRouter.delete('/delete/:id', authByRoleId, deleteUserTeam);
module.exports = UserTeamRouter;