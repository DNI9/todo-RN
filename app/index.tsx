import TodoItem from "@/components/TaskItem";
import { Todo } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite/next";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function IndexPage() {
  const db = useSQLiteContext();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const completedTodos = useMemo(
    () => todos.filter((todo) => todo.done),
    [todos]
  );

  const completeTask = useCallback(async (todoId: number) => {
    setTodos((prevTodos) => {
      return prevTodos.map((prevTodo) =>
        prevTodo.id === todoId ? { ...prevTodo, done: 1 } : prevTodo
      );
    });

    const result = await db.runAsync(
      "UPDATE todos SET done = 1 WHERE id = $id",
      { $id: todoId }
    );
  }, []);

  const deleteTodo = useCallback(async (todoId: number) => {
    setTodos((prevTodos) => {
      return prevTodos.filter((prevTodo) => prevTodo.id !== todoId);
    });

    const result = await db.runAsync("DELETE FROM todos WHERE id = $id", {
      $id: todoId,
    });
  }, []);

  const addTodoToDb = useCallback(async (title: string) => {
    const result = await db.runAsync(
      "INSERT INTO todos (title, due_date) VALUES (?, ?)",
      title,
      new Date().toISOString().slice(0, 10)
    );

    setTodos((prevTodos) => [
      ...prevTodos,
      {
        id: result.lastInsertRowId,
        title,
        due_date: new Date().toISOString().slice(0, 10),
        done: 0,
      },
    ]);
  }, []);

  const addTodo = () => {
    if (!newTodo.trim()) return;
    addTodoToDb(newTodo);
    setNewTodo("");
  };

  useEffect(() => {
    async function getAllTodo() {
      const result = await db.getAllAsync<Todo>("SELECT * FROM todos");
      setTodos(result);
    }
    getAllTodo();
  }, []);

  return (
    <View className="p-3 gap-5 flex-1">
      <View>
        <Text className="font-medium text-xl mb-2">Active Todos</Text>
        <View className="gap-2">
          {todos.length > 0 ? (
            todos
              .filter((todo) => !todo.done)
              .map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  completeTask={completeTask}
                  deleteTask={deleteTodo}
                />
              ))
          ) : (
            <View>
              <Text className="text-center mt-5 text-gray-400">
                No active todos
              </Text>
              <Text className="text-center text-gray-400">
                {">"} delete todo by long pressing it.
              </Text>
            </View>
          )}
        </View>
      </View>

      <View>
        <Text className="font-medium text-xl mb-2">Completed todos</Text>
        <View className="gap-2">
          {completedTodos.length > 0 ? (
            completedTodos.map((task) => (
              <TodoItem
                key={task.id}
                todo={task}
                completeTask={completeTask}
                deleteTask={deleteTodo}
              />
            ))
          ) : (
            <Text className="text-center mt-5 text-gray-400">
              No completed tasks
            </Text>
          )}
        </View>
      </View>

      <View className="gap-2 mt-auto flex-row items-center">
        <TextInput
          value={newTodo}
          onChangeText={setNewTodo}
          placeholder="add new task"
          className="border border-gray-300 p-3 px-5 rounded-full flex-1"
        />
        <TouchableOpacity
          onPress={addTodo}
          className="p-3 bg-black rounded-full"
        >
          <Ionicons name="send" size={25} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
