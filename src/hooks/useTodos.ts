import { useEffect, useState, useRef } from 'react';
import { Todo, TodoError } from '../types/typedefs';
import {
  postTodo,
  getTodos,
  deleteTodo,
  updateTodo,
  USER_ID,
} from '../api/todosMethods';

export enum FilterStatus {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}

export const ToDoServiceErrors = {
  Unknown: 'Something went wrong',
  UnableToLoad: 'Unable to load todos',
  Title: 'Title should not be empty',
  UnableToAddTodo: 'Unable to add a todo',
  UnableToDeleteTodo: 'Unable to delete a todo',
  UnableToUpdateTodo: 'Unable to update a todo',
} as const;

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<TodoError | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.ALL,
  );
  const [loadingTodo, setLoadingTodo] = useState<number | null>(null);
  const [title, setTitle] = useState<string>('');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const showError = (error: TodoError) => {
    setErrorMessage(error);
  };

  useEffect(() => {
    const loadTodos = () => {
      setIsLoading(true);
      getTodos()
        .then(setTodos)
        .catch(() => {
          showError(ToDoServiceErrors.UnableToLoad);
        })
        .finally(() => setIsLoading(false));
    };

    loadTodos();
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos, loadingTodo]);

  const allCompleted = todos.length > 0 && todos.every(td => td.completed);

  const someCompleted = todos.some(td => td.completed);

  const activeCount = todos.filter(todo => !todo.completed).length;

  const completedCount = todos.filter(todo => todo.completed).length;

  const todosFiltered = (() => {
    switch (filterStatus) {
      case FilterStatus.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case FilterStatus.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  })();

  const addTodo = async (todoTitle: string) => {
    const noSpacetitle = todoTitle.trim();

    if (!noSpacetitle) {
      showError(ToDoServiceErrors.Title);

      return false;
    }

    const newTempTodo = {
      id: 0,
      title: noSpacetitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTempTodo);
    setLoadingTodo(0);

    try {
      const newTodo = await postTodo({
        title: noSpacetitle,
        completed: false,
        userId: USER_ID,
      });

      setTodos([...todos, newTodo]);

      return true;
    } catch {
      showError(ToDoServiceErrors.UnableToAddTodo);

      return false;
    } finally {
      setTempTodo(null);
      setLoadingTodo(null);
    }
  };

  const toggleTodo = async (todoId: number) => {
    const todo = todos.find(td => td.id === todoId);

    if (!todo) {
      return;
    }

    setLoadingTodo(todoId);

    try {
      await updateTodo(todoId, { completed: !todo.completed });

      setTodos(prevTodos =>
        prevTodos.map(td =>
          td.id === todoId ? { ...td, completed: !td.completed } : td,
        ),
      );
    } catch (err) {
      showError(ToDoServiceErrors.UnableToUpdateTodo);
    } finally {
      setLoadingTodo(null);
    }
  };

  const removeTodo = async (todoId: number) => {
    try {
      setLoadingTodo(todoId);
      await deleteTodo(todoId);

      const todosAfterDelete = todos.filter(td => td.id !== todoId);

      setTodos(todosAfterDelete);
    } catch (err) {
      showError(ToDoServiceErrors.UnableToDeleteTodo);
    } finally {
      setLoadingTodo(null);
    }
  };

  const clearCompleted = async () => {
    const todosDone = todos.filter(td => td.completed === true);

    if (todosDone.length === 0) {
      return;
    }

    const deleteResults = [];

    for (const todo of todosDone) {
      try {
        await deleteTodo(todo.id);
        deleteResults.push({ id: todo.id, success: true });
      } catch (err) {
        deleteResults.push({ id: todo.id, success: false });
        showError(ToDoServiceErrors.UnableToDeleteTodo);
      }
    }

    const deletedTodos = deleteResults
      .filter(result => result.success)
      .map(result => result.id);

    const stayingTodos = todos.filter(todo => !deletedTodos.includes(todo.id));

    setTodos(stayingTodos);
  };

  const toggleAll = async () => {
    const newCompletedStatus = !allCompleted;

    const todosToUpdate = todos.filter(
      todo => todo.completed !== newCompletedStatus,
    );

    if (todosToUpdate.length === 0) {
      return;
    }

    try {
      await Promise.all(
        todosToUpdate.map(todo =>
          updateTodo(todo.id, { completed: newCompletedStatus }),
        ),
      );

      setTodos(prevTodos =>
        prevTodos.map(todo => {
          const wasUpdated = todosToUpdate.some(
            updatedTodo => updatedTodo.id === todo.id,
          );

          return wasUpdated ? { ...todo, completed: newCompletedStatus } : todo;
        }),
      );
    } catch (err) {
      showError(ToDoServiceErrors.UnableToUpdateTodo);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addTodo(title).then(success => {
      if (success) {
        setTitle('');
      }
    });
  };

  const toStartEditing = (todo: Todo) => {
    setEditingTodo(todo);
    setEditingTitle(todo.title);
  };

  const toCancelEditing = () => {
    setEditingTodo(null);
    setEditingTitle('');
  };

  const toSaveEditedTodo = async (todoId: number, newTitle: string) => {
    const trimmedTitle = newTitle.trim();
    const originalTodo = todos.find(t => t.id === todoId);

    if (!originalTodo) {
      return;
    }

    if (trimmedTitle === originalTodo.title) {
      toCancelEditing();

      return;
    }

    if (!trimmedTitle) {
      try {
        setLoadingTodo(todoId);
        await deleteTodo(todoId);

        const todosAfterDelete = todos.filter(td => td.id !== todoId);

        setTodos(todosAfterDelete);
        toCancelEditing();
      } catch (err) {
        showError(ToDoServiceErrors.UnableToDeleteTodo);
      } finally {
        setLoadingTodo(null);
      }

      return;
    }

    try {
      setLoadingTodo(todoId);
      await updateTodo(todoId, { title: trimmedTitle });

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === todoId ? { ...todo, title: trimmedTitle } : todo,
        ),
      );
      toCancelEditing();
    } catch (err) {
      showError(ToDoServiceErrors.UnableToUpdateTodo);
    } finally {
      setLoadingTodo(null);
    }
  };

  return {
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    isLoading,
    setIsLoading,
    filterStatus,
    setFilterStatus,
    todosFiltered,
    tempTodo,
    setTempTodo,
    loadingTodo,
    setLoadingTodo,
    addTodo,
    toggleTodo,
    removeTodo,
    clearCompleted,
    toggleAll,
    showError,
    title,
    setTitle,
    inputRef,
    handleSubmit,
    allCompleted,
    someCompleted,
    activeCount,
    completedCount,
    editingTodo,
    setEditingTodo,
    editingTitle,
    setEditingTitle,
    toStartEditing,
    toCancelEditing,
    toSaveEditedTodo,
  };
};
