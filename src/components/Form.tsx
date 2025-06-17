// Form.tsx
import React from 'react';

interface FormProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  query: string;
  setQuery: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  loadingTodo: number | null;
}

export const Form: React.FC<FormProps> = ({
  handleSubmit,
  query,
  setQuery,
  inputRef,
  loadingTodo,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={inputRef}
        value={query}
        onChange={event => setQuery(event.target.value)}
        disabled={loadingTodo !== null}
      />
    </form>
  );
};
