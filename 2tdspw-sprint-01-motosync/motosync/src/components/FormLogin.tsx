import { Text, View,Alert } from "react-native";
import { useColorScheme } from "../hooks/useColorScheme";
import { Input } from "./InputLogin";
import { useState } from "react";
import ButtonLogin from "./ButtonLogin";
import { useRouter } from "expo-router";

export function FormLogin() {
  const colorScheme = useColorScheme();
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");  
  const router = useRouter();

  function handleLogin() {
    if (!email || !password) {
      Alert.alert("Preencha todos os campos");
      return;
    }
    // Exemplo de lógica de login simulada
    if (email === "user123@mottu.com" && password === "12345@") {
      router.push("/Home");
    } else {
      Alert.alert("E-mail ou senha inválidos!");
    }
  }

  return (
    <View className={`flex  items-center justify-center ${{ light: "bg-white", dark: "bg-black" }[colorScheme]}`}>
      <Text className={{ light: "text-gray-900", dark: "text-gray-200" }[colorScheme]} style={{ fontSize: 20, marginBottom: 20, fontWeight: 700 }}>
        FAÇA SEU LOGIN
      </Text>
      <Input icon="mail" placeholder="Digite seu e-mail" value={email} onChangeText={setEmail} />
      <Input icon="lock" placeholder="Digite sua senha" type="password" value={password} onChangeText={setPassword} />
      <ButtonLogin onPress={handleLogin} />
    </View>
  );
}