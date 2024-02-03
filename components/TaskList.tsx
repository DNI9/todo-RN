import { Todo } from "@/db/schema";
import React from "react";
import { Text, View } from "react-native";
import TaskItem from "./TaskItem";

interface TaskListProps {
  todos: Todo[];
  emptyMessage?: string;
}

export default function TaskList({ todos, emptyMessage }: TaskListProps) {
  return (
    <View className="gap-2">
      {todos.length > 0 ? (
        todos.map(todo => <TaskItem key={todo.id} task={todo} />)
      ) : (
        <View>
          <Text className="text-center mt-5 text-gray-400">
            {emptyMessage ?? "No todos available"}
          </Text>
        </View>
      )}
    </View>
  );
}
