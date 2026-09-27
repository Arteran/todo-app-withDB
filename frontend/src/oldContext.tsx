import { createContext, useContext, useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import * as api from './api/todos';

type ContextType = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  filterParam: Filter;
  setFilterParam: React.Dispatch<React.SetStateAction<Filter>>;
  handleChangeStatus: (todo: Todo) => void;
  handleAddNewTodo: (newTodoTitle: string) => void;
  handleDeleteTodo: (id: string) => void;
  handleUpdateTodo: (id: number, title: string) => void;
  handleToggleAll: () => void;
  handleDeleteCompletedTodos: () => void;
};

export const TodosContext = createContext<ContextType | null>(null);

export const useTodosContext = () => {
  const obj = useContext(TodosContext);

  if (!obj) {
    throw new Error('Somthing went wrong');
  }

  return obj;
};

type TodoProviderProps = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterParam, setFilterParam] = useState<Filter>(Filter.all);

  const loadTodos = () => api.getAll().then(setTodos);

  useEffect(() => {
    loadTodos();
  }, []);

  const handleChangeStatus = async (todo: Todo) => {
    await api.update({ ...todo, completed: !todo.completed });

    loadTodos();
  };

  const handleAddNewTodo = async (todoTitle: string) => {
    if (todoTitle.trim()) {
      const newTodo = await api.add(todoTitle);

      setTodos(prev => [newTodo, ...prev]);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    await api.deleteTodo(id);

    loadTodos();
  };

  const handleUpdateTodo = async (id: number, title: string) => {
    const todo = todos.find(item => item.id === id);

    if (!todo) {
      return;
    }

    if (!title.trim()) {
      await handleDeleteTodo(String(id));
    } else {
      await api.update({ ...todo, title: title.trim() });

      loadTodos();
    }
  };

  const handleToggleAll = () => {
    const ishaveingUncompleatedTodo = todos.some(todo => !todo.completed);

    const toUpdate = todos
      .filter(todo => todo.completed !== ishaveingUncompleatedTodo)
      .map(todo => ({ ...todo, completed: ishaveingUncompleatedTodo }));

    api.updateAll(toUpdate).then(loadTodos);
  };

  const handleDeleteCompletedTodos = () => {
    const toDelete = todos.filter(todo => todo.completed === true);

    api.deleteAll(toDelete).then(loadTodos);
  };

  return (
    <TodosContext.Provider
      value={{
        todos,
        setTodos,
        filterParam,
        setFilterParam,
        handleChangeStatus,
        handleAddNewTodo,
        handleDeleteTodo,
        handleUpdateTodo,
        handleToggleAll,
        handleDeleteCompletedTodos,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
