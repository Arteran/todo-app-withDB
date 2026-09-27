import express from 'express';
import * as todoController from '../controllers/todo_controller.js';

const router = express.Router();

router.get('/', todoController.get);

router.get('/:id', todoController.getOne);

router.post('/', todoController.create);

router.put('/:id', todoController.update);

router.delete('/:id', todoController.remove);

const isAction = (action) => {
  return ((req, res, next) => {
    if (req.query.action === action) {
      next();
      return;
    } else {
      next('route');
    }
  })
}
router.patch('/', isAction('delete'), todoController.removeMany);
router.patch('/', isAction('update'), todoController.updateMany);

export { router }; 