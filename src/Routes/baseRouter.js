const Router = require('express');
const rolRouter = require('./rolRouter');
const taskRouter = require('./taskRouter');
const teamRouter = require('./teamRouter');
const userRouter = require('./userRoute');
const { isVerifiedCode } = require('../controllers/user.controllers');
const UserTeamRouter = require('./UserTeamRoute');
const authRouter = require('./authRouter');
const passport = require('passport');

const baseRouter = Router();

baseRouter.use('/api/user', passport.authenticate("jwt", { session: false }), userRouter);
baseRouter.use('/api/rol', passport.authenticate("jwt", { session: false }), rolRouter);
baseRouter.use('/api/team', passport.authenticate("jwt", { session: false }), teamRouter);
baseRouter.use('/api/task', passport.authenticate("jwt", { session: false }), taskRouter);
baseRouter.use('/api/userteam', passport.authenticate("jwt", { session: false }), UserTeamRouter);
baseRouter.use('/api/auth', authRouter);
baseRouter.use('/api/verifiedCode', isVerifiedCode);

module.exports = baseRouter;