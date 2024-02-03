import TaskItem from "@/components/TaskItem";
import useTodos from "@/hooks/useTodos";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function IndexPage() {
  const { activeTodos, completedTodos, addTodo, completeTodo, deleteTodo } =
    useTodos();
  const [newTodo, setNewTodo] = useState("");

  return (
    <View className="p-3 gap-5 flex-1">
      <View>
        <Text className="font-medium text-xl mb-2">Active tasks</Text>
        <View className="gap-2">
          {activeTodos.length > 0 ? (
            activeTodos
              .filter(todo => !todo.done)
              .map(todo => (
                <TaskItem
                  key={todo.id}
                  task={todo}
                  completeTask={completeTodo}
                  deleteTask={deleteTodo}
                />
              ))
          ) : (
            <View>
              <Text className="text-center mt-5 text-gray-400">
                No active tasks
              </Text>
              <Text className="text-center text-gray-400">
                {">"} delete task by long pressing it.
              </Text>
            </View>
          )}
        </View>
      </View>

      <View>
        <Text className="font-medium text-xl mb-2">Completed tasks</Text>
        <View className="gap-2">
          {completedTodos.length > 0 ? (
            completedTodos.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                completeTask={completeTodo}
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
          onPress={() => {
            if (newTodo.trim()) {
              addTodo(newTodo);
              setNewTodo("");
            }
          }}
          className="p-3 bg-black rounded-full"
        >
          <Ionicons name="send" size={25} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
