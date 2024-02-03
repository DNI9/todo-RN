import TaskItem from "@/components/TaskItem";
import { db } from "@/db/client";
import { todos, type Todo } from "@/db/schema";
import { Ionicons } from "@expo/vector-icons";
import { eq } from "drizzle-orm";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function IndexPage() {
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState("");
  const completedTasks = useMemo(
    () => tasks.filter((task) => task.done),
    [tasks]
  );

  const completeTask = useCallback((taskId: number, done: boolean) => {
    db.update(todos)
      .set({ done })
      .where(eq(todos.id, taskId))
      .then(() => {
        setTasks((prevTasks) => {
          return prevTasks.map((prevTask) =>
            prevTask.id === taskId
              ? { ...prevTask, done: !prevTask.done }
              : prevTask
          );
        });
      });
  }, []);

  const deleteTask = useCallback((taskId: number) => {
    db.delete(todos)
      .where(eq(todos.id, taskId))
      .then(() => {
        setTasks((prevTasks) => {
          return prevTasks.filter((prevTask) => prevTask.id !== taskId);
        });
      });
  }, []);

  const addTask = () => {
    if (!newTask.trim()) return;

    db.insert(todos)
      .values({ title: newTask })
      .returning()
      .then((todo) => {
        setTasks([...tasks, todo[0]]);
        setNewTask("");
      });
  };

  useEffect(() => {
    db.select().from(todos).then(setTasks);
  }, []);

  return (
    <View className="p-3 gap-5 flex-1">
      <View>
        <Text className="font-medium text-xl mb-2">Active tasks</Text>
        <View className="gap-2">
          {tasks.length > 0 ? (
            tasks
              .filter((task) => !task.done)
              .map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  completeTask={completeTask}
                  deleteTask={deleteTask}
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
          {completedTasks.length > 0 ? (
            completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                completeTask={completeTask}
                deleteTask={deleteTask}
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
          value={newTask}
          onChangeText={setNewTask}
          placeholder="add new task"
          className="border border-gray-300 p-3 px-5 rounded-full flex-1"
        />
        <TouchableOpacity
          onPress={addTask}
          className="p-3 bg-black rounded-full"
        >
          <Ionicons name="send" size={25} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
