import { useTodosContext } from '../oldContext';
import cn from 'classnames';
import { Filter } from '../types/Filter';
import { useState } from 'react';

type Props = {};

export const TodoList: React.FC<Props> = ({}) => {
  const {
    todos,
    filterParam,
    handleChangeStatus,
    handleDeleteTodo,
    handleUpdateTodo,
  } = useTodosContext();

  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const filteredTodos = todos.filter(todo => {
    if (filterParam === Filter.active) {
      return !todo.completed;
    }

    if (filterParam === Filter.completed) {
      return todo.completed;
    }

    return true;
  });

  const handleSubmit = () => {
    if (isEditing !== null) {
      handleUpdateTodo(isEditing, newTitle);
    }

    setIsEditing(null);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {filteredTodos.map(todo => (
        <div
          data-cy="Todo"
          className={cn('todo', { completed: todo.completed })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => handleChangeStatus(todo)}
            />
          </label>
          {isEditing === todo.id ? (
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                onBlur={() => handleSubmit()}
                onKeyDown={e => {
                  if (e.key === 'Escape') {
                    setIsEditing(null);
                  }
                }}
              />
            </form>
          ) : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => {
                  setIsEditing(todo.id);
                  setNewTitle(todo.title);
                }}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => handleDeleteTodo(`${todo.id}`)}
              >
                ×
              </button>
            </>
          )}
        </div>
      ))}
    </section>
  );
};
