const Router = require('express');
const rolRouter = require('./rolRouter');
const taskRouter = require('./taskRouter');
const teamRouter = require('./teamRouter');
const userRouter = require('./userRoute');
const UserTeamRouter = require('./UserTeamRoute');
const authRouter = require('./authRouter');
const passport = require('passport');

const baseRouter = Router();

baseRouter.use('/user', passport.authenticate("jwt", { session: false }), userRouter);
baseRouter.use('/rol', rolRouter);
baseRouter.use('/team', passport.authenticate("jwt", { session: false }), teamRouter);
baseRouter.use('/task', passport.authenticate("jwt", { session: false }), taskRouter);
baseRouter.use('/userteam', passport.authenticate("jwt", { session: false }), UserTeamRouter);
baseRouter.use('/auth', authRouter);

module.exports = baseRouter;