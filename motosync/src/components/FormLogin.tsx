import { Text, View, Alert } from "react-native";
import { useColorScheme } from "../hooks/useColorScheme";
import { Input } from "./InputLogin";
import { useState } from "react";
import ButtonLogin from "./ButtonLogin";
import { useRouter } from "expo-router";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function FormLogin() {
  const colorScheme = useColorScheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Preencha todos os campos");
      return;
    }

    try {
      const response = await api.post("/api/auth/login", { email, password });
      const { cargo, idUsuario, email: userEmail } = response.data;

      if (cargo === "ADMIN") {
        await AsyncStorage.setItem("user", JSON.stringify(response.data));
        router.push("/Home");
      } else if (cargo === "OPERADOR_PATIO") {
        await AsyncStorage.setItem("user", JSON.stringify(response.data));
        router.push("/DashBoard_Operador");
      } else {
        Alert.alert("Cargo não autorizado!");
      }
    } catch (error) {
      Alert.alert("Erro ao conectar com o servidor!");
      console.log(error);
    }
  }

  return (
    <View
      className={`flex  items-center justify-center ${
        { light: "bg-white", dark: "bg-black" }[colorScheme]
      }`}
    >
      <Text
        className={
          { light: "text-gray-900", dark: "text-gray-200" }[colorScheme]
        }
        style={{ fontSize: 20, marginBottom: 20, fontWeight: 700 }}
      >
        FAÇA SEU LOGIN
      </Text>
      <Input
        icon="mail"
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
      />
      <Input
        icon="lock"
        placeholder="Digite sua senha"
        type="password"
        value={password}
        onChangeText={setPassword}
      />
      <ButtonLogin onPress={handleLogin} />
    </View>
  );
}
