import { useTodos } from '../hooks/useTodos';
import { TodoCard } from './TodoCard';

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
        {todoListState.todosFiltered.map(todo => (
          <TodoCard key={todo.id} todoListState={todoListState} todo={todo} />
        ))}
        {todoListState.tempTodo && (
          <TodoCard
            key="temp-todo"
            todo={todoListState.tempTodo}
            todoListState={todoListState}
          />
        )}
      </div>
    </section>
  );
};
