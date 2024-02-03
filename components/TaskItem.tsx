import { Todo } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

type Props = {
  todo: Todo;
  completeTask: (taskId: number) => void;
  deleteTask: (taskId: number) => void;
};

export default function TodoItem({ todo, completeTask, deleteTask }: Props) {
  return (
    <TouchableOpacity
      onPress={() => completeTask(todo.id)}
      onLongPress={() => deleteTask(todo.id)}
    >
      <View
        className="flex-row gap-2 p-2 border border-gray-300 rounded-md"
        style={{ opacity: todo.done ? 0.5 : 1 }}
      >
        <Ionicons
          name={todo.done ? "checkbox" : "square-outline"}
          size={24}
          color={todo.done ? "green" : "gray"}
        />
        <Text className={`text-lg ${todo.done ? "line-through" : ""}`}>
          {todo.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
