import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { useColorScheme } from "../hooks/useColorScheme";

export function MenuBar({ onMenuPress, title = "Motosync" }: { onMenuPress: () => void, title?: string }) {
  {
    const colorScheme = useColorScheme();

    return (
      <View
        className={`flex-row items-center justify-between w-full px-4 py-3 ${colorScheme === "light" ? "bg-white" : "bg-gray-900"}`}
        style={{
          elevation: 4,
          shadowColor: "#000000",
          shadowOpacity: 0.1,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        <TouchableOpacity onPress={onMenuPress} className="mt-12">
          <Ionicons
            name="menu"
            size={32}
            color={colorScheme === "light" ? "#222" : "#fff"}
          />
        </TouchableOpacity>
        <Text className={`text-3xl font-bold mt-12 mr-9 text-green-400`}>
          {title}
        </Text>
        <View />
      </View>
    );
  }
}