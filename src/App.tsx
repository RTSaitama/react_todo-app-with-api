/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-console */
import React from 'react';
import classNames from 'classnames';
import { USER_ID } from './api/todosMethods';
import { UserWarning } from './UserWarning';
import { useTodos, FilterStatus } from './hooks/useTodos';
import { TodoList } from './components/TodoList';
import { Form } from './components/Form';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const todoListState = useTodos();
  const {
    todos,
    error,
    setError,
    filterStatus,
    setFilterStatus,
    loadingTodo,
    setLoadingTodo,
    query,
    setQuery,
    allCompleted,
    someCompleted,
    activeCount,
    toggleAll,
    clearCompleted,
    isLoading,
    handleSubmit,
    inputRef,
  } = todoListState;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && !isLoading && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: allCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={toggleAll}
            />
          )}
          <Form
            loadingTodo={loadingTodo}
            inputRef={inputRef}
            setQuery={setQuery}
            query={query}
            handleSubmit={handleSubmit}
          />
        </header>

        <TodoList
          todoListState={todoListState}
          query={query}
          setQuery={setQuery}
          loadingTodoId={loadingTodo}
          setLoadingTodoId={setLoadingTodo}
        />

        {todos.length > 0 ? (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeCount} items left
            </span>

            <nav className="filter" data-cy="Filter">
              {Object.values(FilterStatus).map(value => (
                <a
                  key={value}
                  href="#/"
                  className={classNames('filter__link', {
                    selected: filterStatus === value,
                  })}
                  data-cy={`FilterLink${value}`}
                  onClick={() => setFilterStatus(value)}
                >
                  {value}
                </a>
              ))}
            </nav>
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={clearCompleted}
              disabled={!someCompleted}
            >
              Clear completed
            </button>
          </footer>
        ) : (
          <>no Todos Left</>
        )}
      </div>
      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
