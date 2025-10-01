import React from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type SearchVagaProps = {
  value: string;
  onChangeText: (text: string) => void;
  onStatusChange: (status: "todas" | "ocupada" | "disponivel") => void;
  status: "todas" | "ocupada" | "disponivel";
  colorScheme: "light" | "dark";
};

export function SearchVaga({
  value,
  onChangeText,
  onStatusChange,
  status,
  colorScheme,
}: SearchVagaProps) {
  return (
    <View className="mb-4 px-4">
      <View
        className={`flex-row items-center justify-center w-full mx-auto rounded-lg border-2 border-green-400 p-2 mt-4 mb-4 ${
          colorScheme === "light" ? "bg-gray-100" : "bg-gray-800"
        }`}
      >
        <TextInput
          className="flex-1 ml-2 mb-1 text-xl text-green-400"
          placeholder="Buscar por identificação"
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
        />
        <Ionicons name="search" size={24} color="#40cf40" />
      </View>
      <View className="flex-row justify-center mt-2">
        <TouchableOpacity
          className={`mx-2 px-3 py-2 rounded-lg ${
            status === "ocupada" ? "bg-red-500" : "bg-gray-300"
          }`}
          onPress={() =>
            onStatusChange(status === "ocupada" ? "todas" : "ocupada")
          }
        >
          <Text
            className={`font-bold ${
              status === "ocupada" ? "text-white" : "text-black"
            }`}
          >
            Ocupada
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`mx-2 px-3 py-2 rounded-lg ${
            status === "disponivel" ? "bg-green-500" : "bg-gray-300"
          }`}
          onPress={() =>
            onStatusChange(status === "disponivel" ? "todas" : "disponivel")
          }
        >
          <Text
            className={`font-bold ${
              status === "disponivel" ? "text-white" : "text-black"
            }`}
          >
            Disponível
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
