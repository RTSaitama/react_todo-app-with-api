// TodoCard.tsx
import { Todo } from '../types/typedefs';
import classNames from 'classnames';
import { useEffect, useRef } from 'react';

interface TodoCardProps {
  todo: Todo;
  loadingTodo: number | 'initial' | null;
  editingTodo: Todo | null;
  onToggle: (todoId: number) => Promise<void>;
  onRemove: (todoId: number) => Promise<void>;
  onStartEdit: (todo: Todo) => void;
  onCancelEdit: () => void;
  onSaveEdit: (todoId: number, newTitle: string) => Promise<void>;
  onUpdateEditingTitle: (newTitle: string) => void;
}

export const TodoCard: React.FC<TodoCardProps> = ({
  todo,
  loadingTodo,
  editingTodo,
  onToggle,
  onRemove,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onUpdateEditingTitle,
}) => {
  const isLoadingThisTodo = loadingTodo === todo.id;
  const isTemp = todo.id === 0;
  const isEditing = editingTodo?.id === todo.id;
  const editingTitle = editingTodo?.title || '';

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    if (!isLoadingThisTodo && !isTemp) {
      onStartEdit(todo);
    }
  };

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSaveEdit(todo.id, editingTitle);
  };

  const handleEditBlur = () => {
    onSaveEdit(todo.id, editingTitle);
  };

  const handleEditKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      onCancelEdit();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
        'item-enter-done': !isTemp && !isLoadingThisTodo,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          aria-label="todostatus-label"
          disabled={isLoadingThisTodo || isTemp}
        />
      </label>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isTemp || isLoadingThisTodo,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <input
            ref={editInputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editingTitle}
            onChange={event => onUpdateEditingTitle(event.target.value)}
            onBlur={handleEditBlur}
            onKeyUp={handleEditKeyUp}
            disabled={isLoadingThisTodo}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onRemove(todo.id)}
            disabled={isLoadingThisTodo || isTemp}
          >
            ×
          </button>
        </>
      )}
    </div>
  );
};
