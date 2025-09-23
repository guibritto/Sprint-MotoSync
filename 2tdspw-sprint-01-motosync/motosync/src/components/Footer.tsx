import { Pressable, Text, View } from 'react-native';
import { useColorScheme } from "../hooks/useColorScheme";
import { useRouter } from 'expo-router';

export default function Footer() {

    const colorScheme = useColorScheme();
    const router = useRouter();

    return (
        <View className={`flex-1 mt-20 items-center justify-center ${{ light: "bg-white", dark: "bg-black" }[colorScheme]}`}>
            <Pressable className={`flex-row items-center justify-center rounded-lg px-6 py-4 mb-3 mr-3 ml-3 mt-8 ${{ light: "bg-gray-200", dark: "bg-gray-800" }[colorScheme]}`} onPress={() => router.push("/Participantes")}>
                <Text className="text-3xl font-bold text-green-500">Página dos participantes</Text>
            </Pressable>
        </View>
    );
}