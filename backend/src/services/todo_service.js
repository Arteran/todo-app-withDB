import path from 'path';
import fs from 'fs/promises'
import { v4 as uuidv4 } from 'uuid';
import { sequelize } from './db.js';
import { DataTypes, Op, QueryTypes } from 'sequelize';

export const Todo = sequelize.define(
  'Todo',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'todos',
  },
);

export const normalize = ({ id, title, completed }) => ({
  id,
  title,
  completed,
})

export const getAll = async () => {
  const result = await Todo.findAll({
    order: [['createdAt', 'DESC']],
  });

  return result;
}

export const getById = async ( id ) => {
  return Todo.findByPk(id);
}

export const createTodo = async ( title ) => {
  return Todo.create({ title });
}

export const update = async ( { id, title, completed } ) => {
  await Todo.update({ title, completed }, { where: { id } });
}

export const remove = async ( id ) => {
  await Todo.destroy({ where: { id } });
}

export const removeMany = async ( ids ) => {
  await Todo.destroy({ where: { id: { [Op.in]: ids } } });

  // sequelize.query(
  //   `DELETE FROM todos
  //   WHERE id in (:ids)`,
  //   {
  //     replacements: { ids },
  //     type: QueryTypes.BULKDELETE,
  //   }
  // );
}

export const updateMany = async ( todos ) => {
  return await sequelize.transaction(async (t) => {
    for (const { id, title, completed } of todos) {
      await Todo.update({ title, completed }, { where: { id }, transaction: t });
    }
  });

  // await Todo.bulkCreate(todos, {
  //   updateOnDuplicate: ['title', 'completed'],
  // });
}
