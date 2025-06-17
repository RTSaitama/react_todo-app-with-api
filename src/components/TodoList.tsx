import { TodoCard } from './TodoCard';
import { Todo } from '../types/typedefs';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
interface TodoListProps {
  todosFiltered: Todo[];
  tempTodo: Todo | null;
  loadingTodo: number | null;
  editingTodo: Todo | null;
  editingTitle: string;
  toggleTodo: (id: number) => Promise<void>;
  removeTodo: (id: number) => Promise<void>;
  toStartEditing: (todo: Todo) => void;
  toCancelEditing: () => void;
  toSaveEditedTodo: (id: number, title: string) => Promise<void>;
  setEditingTitle: (title: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todosFiltered,
  tempTodo,
  loadingTodo,
  editingTodo,
  editingTitle,
  toggleTodo,
  removeTodo,
  toStartEditing,
  toCancelEditing,
  toSaveEditedTodo,
  setEditingTitle,
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
                editingTitle={editingTitle}
                toggleTodo={toggleTodo}
                removeTodo={removeTodo}
                toStartEditing={toStartEditing}
                toCancelEditing={toCancelEditing}
                toSaveEditedTodo={toSaveEditedTodo}
                setEditingTitle={setEditingTitle}
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
                editingTitle={editingTitle}
                toggleTodo={toggleTodo}
                removeTodo={removeTodo}
                toStartEditing={toStartEditing}
                toCancelEditing={toCancelEditing}
                toSaveEditedTodo={toSaveEditedTodo}
                setEditingTitle={setEditingTitle}
              />
            </CSSTransition>
          )}
        </TransitionGroup>
      </div>
    </section>
  );
};
