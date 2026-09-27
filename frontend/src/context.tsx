import { createContext, useContext, useEffect, useReducer } from 'react';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';

type ContextType = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  filterParam: Filter;
  setFilterParam: (param: Filter) => void;
  handleChangeStatus: (id: number) => void;
  handleAddNewTodo: (newTodoTitle: string) => void;
  handleToggleAll: () => void;
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

interface State {
  todos: Todo[];
  filterParam: Filter;
}

type Action =
  | { type: 'setTodos'; payload: Todo[] }
  | { type: 'handleChangeStatus'; payload: number }
  | { type: 'setFilterParam'; payload: Filter }
  | { type: 'handleAddNewTodo'; payload: string }
  | { type: 'handleToggleAll' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setTodos':
      return { ...state, todos: action.payload };

    case 'setFilterParam':
      return { ...state, filterParam: action.payload };

    case 'handleChangeStatus':
      return {
        ...state,
        todos: state.todos.map(item =>
          item.id === action.payload
            ? { ...item, completed: !item.completed }
            : item,
        ),
      };

    case 'handleAddNewTodo':
      if (!action.payload.trim()) {
        return state;
      }

      const newTodo = {
        id:
          state.todos.reduce(
            (max, todo) => (todo.id > max ? todo.id : max),
            0,
          ) + 1,
        title: action.payload,
        completed: false,
      };

      return {
        ...state,
        todos: [...state.todos, newTodo],
      };

    case 'handleToggleAll':
      const ishaveingUncompleatedTodo =
        state.todos.filter(todo => !todo.completed).length !== 0;

      return {
        ...state,
        todos: state.todos.map(todo =>
          ishaveingUncompleatedTodo
            ? { ...todo, completed: true }
            : { ...todo, completed: false },
        ),
      };

    default:
      return state;
  }
}

const initialState: State = {
  todos: (() => {
    const checked = localStorage.getItem('todos');

    if (!checked) {
      return [];
    }

    return JSON.parse(checked) || [];
  })(),
  filterParam: Filter.all,
};

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [{ todos, filterParam }, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const setTodos = (newTodos: Todo[]) =>
    dispatch({ type: 'setTodos', payload: newTodos });

  const setFilterParam = (newParam: Filter) =>
    dispatch({ type: 'setFilterParam', payload: newParam });

  const handleChangeStatus = (id: number) =>
    dispatch({ type: 'handleChangeStatus', payload: id });

  const handleAddNewTodo = (todoTitle: string) =>
    dispatch({ type: 'handleAddNewTodo', payload: todoTitle });

  const handleToggleAll = () => dispatch({ type: 'handleToggleAll' });

  return (
    <TodosContext.Provider
      value={{
        todos,
        setTodos,
        filterParam,
        setFilterParam,
        handleChangeStatus,
        handleAddNewTodo,
        handleToggleAll,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
