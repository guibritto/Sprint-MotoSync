import { Text, View, Alert } from "react-native";
import { useColorScheme } from "../hooks/useColorScheme";
import { Input } from "./InputLogin";
import { useState } from "react";
import ButtonLogin from "./ButtonLogin";
import { useRouter } from "expo-router";
import api from "../services/api"; // ajuste o caminho se necessário

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

    // Chamada real para a API
    api
      .post("/login", { email, password })
      .then((response) => {
        // Supondo que a API retorna sucesso no login
        if (response.data.success) {
          router.push("/Home");
        } else {
          Alert.alert("E-mail ou senha inválidos!");
          console.log(response.data); // Log para depuração
        }
      })
      .catch((error) => {
        Alert.alert("Erro ao conectar com o servidor!");
        console.log(error); // Adicione para ver detalhes do erro
      });
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
