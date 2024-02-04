import { db } from "@/db/client";
import { Todo, todoTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { create } from "zustand";

interface TodoState {
  todos: Todo[];
  filtered: Todo[];
  add: (title: string) => void;
  complete: (id: number, done: boolean) => void;
  delete: (id: number) => void;
  search: (keyword: string) => void;
}

export const useTodoStore = create<TodoState>()(set => ({
  todos: [],
  filtered: [],

  add: async (title: string) => {
    const todo = await db.insert(todoTable).values({ title }).returning();
    set(state => ({ todos: [...state.todos, todo[0]] }));
  },

  complete: async (id: number, done: boolean) => {
    await db.update(todoTable).set({ done }).where(eq(todoTable.id, id));
    set(state => ({
      todos: state.todos.map(todo =>
        todo.id === id ? { ...todo, done } : todo
      ),
    }));
  },

  delete: async (id: number) => {
    await db.delete(todoTable).where(eq(todoTable.id, id));
    set(state => ({ todos: state.todos.filter(todo => todo.id !== id) }));
  },

  search: (keyword: string) => {
    set(state => ({
      filtered: state.todos.filter(todo => todo.title.includes(keyword)),
    }));
  },
}));

db.select()
  .from(todoTable)
  .then(todos => useTodoStore.setState({ todos }));
