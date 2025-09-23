import { Pressable, Text, View } from "react-native";
import { useColorScheme } from "../hooks/useColorScheme";

export default function ButtonLogin({onPress}: {onPress: () => void}) {
    const colorScheme = useColorScheme();

    return (
        <View className="flex-row items-center justify-center">
            <Pressable className={`${colorScheme === "light" ? "bg-green-600" : "bg-green-600"} rounded-lg px-6 py-4 mb-3 mr-3 ml-3 mt-8`} onPress={onPress}>
                <Text className={`${colorScheme === "light" ? "text-white" : "text-black"} text-3xl font-bold`}>CONTINUAR</Text>
            </Pressable>
        </View>
    );
}