import { useTodos } from '../hooks/useTodos';
import { TodoCard } from './TodoCard';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
interface TodoListProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  todoListState: ReturnType<typeof useTodos>;
  loadingTodoId: number | null;
  setLoadingTodoId: (id: number | null) => void;
}

export const TodoList: React.FC<TodoListProps> = ({ todoListState }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <div>
        <TransitionGroup>
          {todoListState.todosFiltered.map(todo => (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <TodoCard
                key={todo.id}
                todoListState={todoListState}
                todo={todo}
              />
            </CSSTransition>
          ))}
          {todoListState.tempTodo && (
            <CSSTransition key="temp-todo" timeout={300} classNames="temp-item">
              <TodoCard
                key="temp-todo"
                todo={todoListState.tempTodo}
                todoListState={todoListState}
              />
            </CSSTransition>
          )}
        </TransitionGroup>
      </div>
    </section>
  );
};
