import TaskItem from "@/components/TaskItem";
import { useTodoStore } from "@/hooks/useTodoStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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
      <FlatList
        className="flex-1"
        data={activeTodos}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <TaskItem task={item} />}
        contentContainerClassName="gap-2"
        ListEmptyComponent={() => (
          <Text className="text-center mt-5 text-gray-400">
            No active todos
          </Text>
        )}
        ListHeaderComponent={() => (
          <Text className="font-medium text-xl mb-2">Active todos</Text>
        )}
      />

      {completedTodos.length > 0 ? (
        <FlatList
          className="flex-1"
          data={completedTodos}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <TaskItem task={item} />}
          contentContainerClassName="gap-2"
          ListEmptyComponent={() => (
            <Text className="text-center mt-5 text-gray-400">
              No completed todos
            </Text>
          )}
          ListHeaderComponent={() => (
            <Text className="font-medium text-xl mb-2">Completed todos</Text>
          )}
        />
      ) : null}

      <View className="gap-2 mt-auto flex-row items-center">
        <TextInput
          value={newTodo}
          onChangeText={setNewTodo}
          placeholder="add new task"
          className="border border-gray-400 p-3 px-5 rounded-full flex-1 bg-gray-200"
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
