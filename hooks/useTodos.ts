import { db } from "@/db/client";
import { Todo, todos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useCallback, useEffect, useMemo, useState } from "react";

interface UseTodos {
  todoItems: Todo[];
  completedTodos: Todo[];
  activeTodos: Todo[];
  addTodo: (title: string) => void;
  completeTodo: (id: number, done: boolean) => void;
  deleteTodo: (id: number) => void;
}

export default function useTodos(): UseTodos {
  const [todoItems, setTodos] = useState<Todo[]>([]);

  const completedTodos = useMemo(
    () => todoItems.filter(todo => todo.done),
    [todoItems]
  );
  const activeTodos = useMemo(
    () => todoItems.filter(todo => !todo.done),
    [todoItems]
  );

  const addTodo = useCallback((title: string) => {
    db.insert(todos)
      .values({ title })
      .returning()
      .then(todo => {
        setTodos(prevTodos => [...prevTodos, todo[0]]);
      });
  }, []);

  const completeTodo = useCallback((id: number, done: boolean) => {
    db.update(todos)
      .set({ done })
      .where(eq(todos.id, id))
      .then(() => {
        setTodos(prevTodos => {
          return prevTodos.map(todo =>
            todo.id === id ? { ...todo, done } : todo
          );
        });
      });
  }, []);

  const deleteTodo = useCallback((id: number) => {
    db.delete(todos)
      .where(eq(todos.id, id))
      .then(() => {
        setTodos(prevTodos => {
          return prevTodos.filter(todo => todo.id !== id);
        });
      });
  }, []);

  useEffect(() => {
    db.select().from(todos).then(setTodos);
  }, []);

  return {
    todoItems,
    completedTodos,
    activeTodos,
    addTodo,
    completeTodo,
    deleteTodo,
  };
}
