import { View, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "../hooks/useColorScheme";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

export function SearchHome({ value, onChangeText }: Props) {
  const colorScheme = useColorScheme();
  
  return (
<View className="px-2 mb-2">
    <View className={`flex-row items-center justify-center w-full mx-auto rounded-lg border-2 border-green-400 p-2 mt-12 mb-4 ${colorScheme === "light" ? "bg-gray-100" : "bg-gray-800"}`}>
      
      <TextInput
        className="flex-1 ml-2 mb-1 text-xl text-green-400"
        placeholder="Buscar por nome"
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
      />
      <Feather name="search" size={24} color="#40cf40" />
      </View>
    </View>
  );
}