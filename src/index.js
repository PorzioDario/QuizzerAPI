import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

import models, { sequelize } from './models';
import routes from './routes';
import auth from './authentication';

const app = express();

// Application level Middleware
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  req.context = {
    models
    //me: await models.User.findByLogin('rwieruch'),
  };
  next();
});

app.use(async (req,res,next) => {
  if (req.path.startsWith('/auth')) { 
    next();
  } else {
    const token = req.headers.token;
    const userId = auth.getUserByToken(token);

    if (userId === 'Token not valid' || userId === 'Token expired') {
      return res.send({
        status: 'error',
        message: 'Error: ' + userId
      });
    } else {
      req.context.userId = userId;
    }

    next();
  }
});


// Routes
app.use('/auth', routes.auth);
app.use('/user', routes.user);
app.use('/quizz', routes.quizz);


// Start

const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createDefaultUsersWithQuizzes();
  }

  app.listen(process.env.PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT}!`),
  );
});

const createDefaultUsersWithQuizzes = async () => {
   await models.User.create({
    username: 'Dario',
    email: 'dario.porzio@gmail.com',
    password: 'TestPsw',

    quizzes: [
      {
        name: 'Angular 8',
        description: 'This test is about Angular!',
        duration: 60
      }
    ]
  },
  {
    include: [models.Quizz],
  });

  await models.User.create({
    username: 'Tester',
    email: 'test@test.com',
    password: 'Qwerty123',

    quizzes: [
      {
        name: 'React',
        description: 'This test is about React.js 16.8.0',
        duration: 45
      }
    ]
  },
  {
    include: [models.Quizz],
  });
};