import { Feather } from "@expo/vector-icons";
import { TextInput, View, TouchableOpacity } from "react-native";
import { useColorScheme } from "../hooks/useColorScheme";
import { useState } from "react";

type Props = {
    icon: keyof typeof Feather.glyphMap;
    placeholder?: string;
    type?: string;
    value?: string;
    onChangeText?: (text: string) => void;
}

export function Input({ icon, placeholder, type, value, onChangeText }: Props & {value?: string; onChangeText?: (text: string) => void;}) {
    const colorScheme = useColorScheme();
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    
    return (
        <View className={`flex-row items-center justify-center w-full mx-auto ${{ light: "bg-gray-200", dark: "bg-gray-800" }[colorScheme]} rounded-lg px-4 py-2 mb-3`}>
            <Feather name={icon} size={32} color="#289128" />
            <TextInput
                className={`flex-1 ml-2 mb-1 text-xl ${{ light: "text-black", dark: "text-white" }[colorScheme]}`}
                placeholder={placeholder}
                secureTextEntry={isPassword && !showPassword}
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChangeText}
            />
            {isPassword && (
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Feather name={showPassword ? "eye" : "eye-off"} size={24} color="#289128" />
                </TouchableOpacity>
            )}
        </View>
    )
}