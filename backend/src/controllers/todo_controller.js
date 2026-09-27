import * as todoService from '../services/todo_service.js';

export const get = async (req, res) => {
  res.send(await todoService.getAll());
};

export const getOne = async (req, res) => {
  const { id } = req.params;
  const todo = await todoService.getById(id);
  if (!todo) {
    res.sendStatus(404);

    return
  }

  res.send(todo);
}

export const create = async (req, res) => {
  const { title } = req.body;
  if (!title) {
    res.sendStatus(422);

    return;
  }
  const todo = await todoService.createTodo(title);

  res.statusCode = 201;

  res.send(todo);
}

export const remove = async (req, res) => {
  const { id } = req.params;
  if (!(await todoService.getById(id))) {
    res.sendStatus(404);

    return;
  }

  await todoService.remove(id);

  res.sendStatus(204);
}

export const update = async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const todo = await todoService.getById(id);
  if (!todo) {
    res.sendStatus(404);

    return
  }

  if (typeof title !== 'string' || typeof completed !== 'boolean') {
    res.sendStatus(422);
    return;
  }

  await todoService.update({ id, title, completed });

  const updatedTodo = await todoService.getById(id);

  res.send(updatedTodo);
}

export const removeMany = (req, res, next) => {
  if (req.query.action !== 'delete') {
    next();
    return;
  }

  const {ids} = req.body;

  if (!Array.isArray(ids)) {
    res.sendStatus(422);
    return;
  }

  if (!ids.every(id => todoService.getById(id))) {
    throw new Error('One or more ids do not exist');
  }
  todoService.removeMany(ids);
  res.sendStatus(204);

  return;
}

export const updateMany = (req, res) => {
  if (req.query.action !== 'update') {
    next();
    return;
  }

  const {items} = req.body;

  if (!Array.isArray(items)) {
    res.sendStatus(422);
    return;
  }

  const errors = [];
  const results = [];
  for (const {id, title, completed} of items) {
    const todo = todoService.getById(id);
    if (!todo) {
      errors.push({id, title, completed, error: 'Todo not found'});
    } else {
      const result = todoService.update({id, title, completed});
      results.push(result);
    }
  }

  res.send({ errors, results });
  return;
}