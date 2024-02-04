import TaskItem from "@/components/TaskItem";
import { useTodoStore } from "@/hooks/useTodoStore";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const filteredItems = useTodoStore(state => state.filtered);
  const searchTodo = useTodoStore(state => state.search);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => searchTodo(keyword), 200);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [keyword]);

  return (
    <View className="p-3">
      <TextInput
        autoFocus
        value={keyword}
        onChangeText={setKeyword}
        placeholder="search todos"
        className="bg-gray-200 py-3 px-5 rounded-md mb-2"
      />
      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <TaskItem task={item} />}
        contentContainerClassName="gap-2"
        ListEmptyComponent={() =>
          filteredItems.length === 0 ? (
            <Text className="text-center mt-5 text-gray-400">
              No todos found with keyword: {keyword}
            </Text>
          ) : null
        }
      />
    </View>
  );
}
