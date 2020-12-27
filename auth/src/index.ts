import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
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
    secure: true // https
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

const start = async () => {
  if(!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }
}
start();
app.listen(3000, () => {
  console.log("Listening on Port 3000!!!");
});