import 'dotenv/config';
import { Router } from 'express';
import auth from '../authentication';

const router = Router();

router.post('/login', async (req, res) => {
    const userEmail = req.body.email;
    const userPsw = req.body.psw;
    
    let user = await req.context.models.User.findOne({
        where: { email: userEmail, password: userPsw }
    });

    if(!user) {
        res.statusCode = 404;
        res.send({status: 'error', message: 'Invalid email or password'});
    } else {
        const token = auth.getTokenForUser(user.id);
        res.send({
            idToken: token,
            expiresIn: process.env.TOKEN_DURATION,
            username: user.username
        });
    }
});

// signIn
router.post('/signin', async (req, res) => {
    const userName = req.body.username;
    const userEmail = req.body.email;
    const userPsw = req.body.psw;
    
    let userByEmail = await req.context.models.User.findOne({
        where: { email: userEmail }
    });
    let userByUsername = await req.context.models.User.findOne({
        where: { username: userName }
    });

    if(userByEmail || userByUsername) {
        res.statusCode = 404;
        res.send({status: 'error', message: 'Email or username already in use!'});
    } else {
        const newUser = await req.context.models.User.create({
            username: userName,
            email: userEmail,
            password: userPsw
          });

        const token = auth.getTokenForUser(newUser.id);
        res.send({
            username: userName,
            idToken: token,
            expiresIn: process.env.TOKEN_DURATION
        });
    }
});

// reset psw

// logout 
router.get('/logout', async (req,res) => {
    auth.removeToken(req.headers.token);
    res.send({status: 'ok'});
});

//...
 

export default router;