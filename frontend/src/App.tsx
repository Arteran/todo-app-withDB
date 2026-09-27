/* eslint-disable jsx-a11y/control-has-associated-label */
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { useTodosContext } from './oldContext';

export const App: React.FC = () => {
  const { todos } = useTodosContext();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        {!!todos.length && (
          <>
            <TodoList />
            <Footer />
          </>
        )}
      </div>
    </div>
  );
};

// useReducer;
