import { Pressable, Text, View, ActivityIndicator } from "react-native";
import { useColorScheme } from "../hooks/useColorScheme";

export default function ButtonLogin({
  onPress,
  loading,
}: {
  onPress: () => void;
  loading?: boolean;
}) {
  const colorScheme = useColorScheme();

  return (
    <View className="flex-row items-center justify-center">
      <Pressable
        className={`${
          colorScheme === "light" ? "bg-green-600" : "bg-green-600"
        } rounded-lg px-6 py-4 mb-3 w-48 mt-8`}
        onPress={onPress}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="large" />
        ) : (
          <Text
            className={`${
              colorScheme === "light" ? "text-white" : "text-black"
            } text-3xl font-bold text-center`}
          >
            CONTINUAR
          </Text>
        )}
      </Pressable>
    </View>
  );
}
