import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
    const quizzes = await req.context.models.Quizz.findAll({where: { userId : req.context.userId } });
    return res.send(quizzes);
});
  
router.get('/:quizzId', async (req, res) => {
    const quizz = await req.context.models.Quizz.findByPk(req.params.quizzId);

    if (!quizz || quizz.userId !== req.context.userId) {
        res.send('Quizz not found!');
    } else {
        res.send(quizz);
    }
    
});

router.put('/:quizzId', async (req,res) => {
    const quizz = await req.context.models.Quizz.findByPk(
        req.params.quizzId,
      );

      if (!quizz) {
        return res.send('Error: Quizz not found!');
    } else {
        if (quizz.userId !== req.context.userId) {
            //this quizz belongs to another user
            return res.send('Error: Quizz not found!');
        }

        quizz.name = req.body.name ;
		quizz.description = req.body.description;
		quizz.duration = req.body.duration;

        quizz.save()
            .then((response) => {
                res.send(response);
            })
            .catch(() => {
                res.send(false);
            });
    }
});

router.post('/', async (req, res) => {
    let quizz = await req.context.models.Quizz.findOne({
        where: {
            // stesso userId e stesso Nome
        }
    });

    quizz = null;

    if (!quizz) {
        const newQuizz = await req.context.models.Quizz.create({
            name: req.body.name ,
            description: req.body.description,
            duration: req.body.duration,
            userId: req.context.userId
          });
        return res.send(newQuizz);
    } else {
        res.send('Error: a quizz with the same name already exists for this user!');
    }
});

router.delete('/:quizzId', async (req,res) => {
    const quizz = await req.context.models.Quizz.findByPk(
        req.params.quizzId,
      );
    
    if(quizz.userId !== req.context.userId) {
        return res.send("Error: Quizz not found!")
    }

    const result = await req.context.models.Quizz.destroy({
        where: { id: req.params.quizzId },
      });
    
      return res.send(true);
});
  
export default router;