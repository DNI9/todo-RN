import { type Todo } from "@/db/schema";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

type Props = {
  task: Todo;
  completeTask: (taskId: number, value: boolean) => void;
  deleteTask: (taskId: number) => void;
};

export default function TaskItem({ task, completeTask, deleteTask }: Props) {
  return (
    <TouchableOpacity
      onPress={() => completeTask(task.id, !task.done)}
      onLongPress={() => deleteTask(task.id)}
    >
      <View
        className="flex-row gap-2 p-2 border border-gray-300 rounded-md"
        style={{ opacity: task.done ? 0.5 : 1 }}
      >
        <Ionicons
          name={task.done ? "checkbox" : "square-outline"}
          size={24}
          color={task.done ? "green" : "gray"}
        />
        <Text className={`text-lg ${task.done ? "line-through" : ""}`}>
          {task.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
