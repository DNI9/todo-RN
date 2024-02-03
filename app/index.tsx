import TaskList from "@/components/TaskList";
import { useTodoStore } from "@/hooks/useTodoStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function IndexPage() {
  const [newTodo, setNewTodo] = useState("");
  const activeTodos = useTodoStore(state =>
    state.todos.filter(todo => !todo.done)
  );
  const completedTodos = useTodoStore(state =>
    state.todos.filter(todo => todo.done)
  );

  const addTodo = useTodoStore(state => state.add);

  return (
    <View className="p-3 gap-5 flex-1">
      <View>
        <Text className="font-medium text-xl mb-2">Active tasks</Text>
        <TaskList todos={activeTodos} emptyMessage="No active tasks" />
      </View>

      <View>
        <Text className="font-medium text-xl mb-2">Completed tasks</Text>
        <TaskList todos={completedTodos} emptyMessage="No completed tasks" />
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
