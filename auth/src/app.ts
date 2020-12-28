import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.set('trust proxy', true); // https
app.use(json());

app.use(
  cookieSession({
    signed: false, // no encryption
    secure: process.env.NODE_ENV !== 'test' // https but not in test env
  })
);

app.use(signinRouter);
app.use(currentUserRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

/*
without express-async-errors pkg
app.all('*', async (req, res, next) => {
  next(new NotFoundError());
});
*/

app.use(errorHandler);

export { app };