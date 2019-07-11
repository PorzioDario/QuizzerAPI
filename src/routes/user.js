import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
    const users = await req.context.models.User.findAll();
    return res.send(users);
  });
  
router.get('/:userId', async (req, res) => {
    const user = await req.context.models.User.findByPk(
      req.params.userId,
    );
    return res.send(user);
  });  
  
router.post('/', async (req,res) => {
    let user = await req.context.models.User.findOne({
        where: { email: req.body.email }
    });

    if ( !user ) {
        const newUser = await req.context.models.User.create({
            username: req.body.username,
            email: req.body.email
          });
        return res.send(newUser);
    } else {
        res.send('Error: An User with the same email is already present');
    }
});

router.put('/:userId', async (req,res) => {
    const user = await req.context.models.User.findByPk(
        req.params.userId,
      );
    
    if (!user) {
        res.send('Error: User not found!');
    } else {
        user.username = req.body.username;
        user.email = req.body.email;

        user.save()
            .then((response) => {
                res.send(response);
            })
            .catch(() => {
                res.send(false);
            });
    }
});

router.delete('/:userId', async (req,res) => {
    const result = await req.context.models.User.destroy({
        where: { id: req.params.userId },
      });
    
      return res.send(true);
});

export default router;