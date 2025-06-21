import { TodoCard } from './TodoCard';
import { Todo } from '../types/typedefs';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

interface TodoListProps {
  todosFiltered: Todo[];
  tempTodo: Todo | null;
  loadingTodo: number | 'initial' | null;
  editingTodo: Todo | null;
  toggleTodo: (todoId: number) => Promise<void>;
  removeTodo: (todoId: number) => Promise<void>;
  toStartEditing: (todo: Todo) => void;
  toCancelEditing: () => void;
  toSaveEditedTodo: (todoId: number, newTitle: string) => Promise<void>;
  updateEditingTodoTitle: (newTitle: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todosFiltered,
  tempTodo,
  loadingTodo,
  editingTodo,
  toggleTodo,
  removeTodo,
  toStartEditing,
  toCancelEditing,
  toSaveEditedTodo,
  updateEditingTodoTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <div>
        <TransitionGroup>
          {todosFiltered.map(todo => (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <TodoCard
                key={todo.id}
                todo={todo}
                loadingTodo={loadingTodo}
                editingTodo={editingTodo}
                onToggle={toggleTodo}
                onRemove={removeTodo}
                onStartEdit={toStartEditing}
                onCancelEdit={toCancelEditing}
                onSaveEdit={toSaveEditedTodo}
                onUpdateEditingTitle={updateEditingTodoTitle}
              />
            </CSSTransition>
          ))}
          {tempTodo && (
            <CSSTransition key="temp-todo" timeout={300} classNames="temp-item">
              <TodoCard
                key="temp-todo"
                todo={tempTodo}
                loadingTodo={loadingTodo}
                editingTodo={editingTodo}
                onToggle={toggleTodo}
                onRemove={removeTodo}
                onStartEdit={toStartEditing}
                onCancelEdit={toCancelEditing}
                onSaveEdit={toSaveEditedTodo}
                onUpdateEditingTitle={updateEditingTodoTitle}
              />
            </CSSTransition>
          )}
        </TransitionGroup>
      </div>
    </section>
  );
};
