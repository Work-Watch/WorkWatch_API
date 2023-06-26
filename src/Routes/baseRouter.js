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

baseRouter.use('/user', passport.authenticate("jwt", { session: false }), userRouter);
baseRouter.use('/rol', passport.authenticate("jwt", { session: false }), rolRouter);
baseRouter.use('/team', passport.authenticate("jwt", { session: false }), teamRouter);
baseRouter.use('/task', passport.authenticate("jwt", { session: false }), taskRouter);
baseRouter.use('/userteam', passport.authenticate("jwt", { session: false }), UserTeamRouter);
baseRouter.use('/auth', authRouter);
baseRouter.use('/verifiedCode', isVerifiedCode);

module.exports = baseRouter;