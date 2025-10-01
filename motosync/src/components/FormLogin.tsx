import { Text, View, Alert } from "react-native";
import { useColorScheme } from "../hooks/useColorScheme";
import { Input } from "./InputLogin";
import { useState } from "react";
import ButtonLogin from "./ButtonLogin";
import { useRouter } from "expo-router";
import api from "../services/api"; // ajuste o caminho se necessário
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";

export function FormLogin() {
  const colorScheme = useColorScheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log("Login bem-sucedido:", data); // <-- Adicionado
      if (data.cargo === "ADMIN") {
        AsyncStorage.setItem("user", JSON.stringify(data));
        router.push("/Home");
      } else if (data.cargo === "OPERADOR_PATIO") {
        AsyncStorage.setItem("user", JSON.stringify(data));
        router.push("/DashBoard_Operador");
      } else {
        Alert.alert("Cargo não autorizado!");
      }
    },
    onError: (error) => {
      console.log("Erro no login:", error); // <-- Adicionado
      Alert.alert("Erro ao conectar com o servidor!");
    },
  });

  function handleLogin() {
    if (!email || !password) {
      Alert.alert("Preencha todos os campos");
      return;
    }

    mutation.mutate({ email, password });
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
      <ButtonLogin onPress={handleLogin} loading={mutation.isPending} />
    </View>
  );
}
