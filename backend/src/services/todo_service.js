import path from 'path';
import fs from 'fs/promises'
import { v4 as uuidv4 } from 'uuid';
import { client } from './db.js';

let todos = [
  {
    id: '1',
    title: 'Learn Express',
    completed: false
  },
  {
    id: '2',
    title: 'Learn React',
    completed: true
  },
  {
    id: '3',
    title: 'Learn Node.js',
    completed: false
  }
];

export async function read () {
  const filePath = path.resolve('data', 'todos.json');

  const data = await fs.readFileS(filePath, 'utf-8')

  return JSON.parse(data);
}

export async function write (todos) {
  const filePath = path.resolve('data', 'todos.json');

  await fs.writeFile(
    filePath,
    JSON.stringify(todos, null, 2),
    'utf-8'
  )
}

export const getAll = async () => {
  const result = await client.query(`
    SELECT * FROM todos
    ORDER BY created_at ASC
  `)

  return result.rows;
}

export const getById = async ( id ) => {
  const result = await client.query(`
    SELECT * FROM todos
    WHERE id = $1
  `, [id])

  return result.rows[0] || null;
}

export const createTodo = async ( title ) => {
  const id = uuidv4();
  const result = await client.query(`
    INSERT INTO todos (id, title)
    VALUES ($1, $2)
  `, [id, title])

  return await getById(id);
}

export const update = async ( { id, title, completed } ) => {
  const result = await client.query(`
    UPDATE todos
    SET title = $1, completed = $2
    WHERE id = $3
  `, [title, completed, id])
}

export const remove = async ( id ) => {
  const result = await client.query(`
    DELETE FROM todos
    WHERE id = $1
  `, [id])
}

function isUUID(id) {
  const pattern = /^[0-9a-f\-]+$/;

  return pattern.test(id); 
}

export const removeMany = async ( ids ) => {
  if (!ids.every(isUUID)) {
    throw new Error('Invalid ID format');
  }

  const indexes = ids.map((_, index) => `$${index + 1}`);
  const result = await client.query(`
    DELETE FROM todos
    WHERE id in ('${ids.join(`','`)}')
  `)
}

export const updateMany = async ( todos ) => {
  for (const {id, title, completed} of todos) {
    await update({id, title, completed})
  }
}

