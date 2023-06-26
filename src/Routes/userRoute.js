const { Router } = require('express');
const { getAllUser, createUser, updateUser, deleteUser, getOneUser, getFindName, getOwn, isCreatedCode } = require('../controllers/user.controllers');
const {authByRoleId} = require('../middlewares/authorize');

const userRouter = Router();

userRouter.get('/', authByRoleId, getAllUser);
userRouter.get('/me', getOwn);
userRouter.post('/create', createUser);
userRouter.put('/update/:id', updateUser);
userRouter.delete('/delete/:id', deleteUser);
userRouter.get('/getOne/:id', getOneUser);
userRouter.get('/getName', getFindName);
userRouter.post('/createCode', isCreatedCode);

module.exports = userRouter;