import React, { useState, useEffect } from "react";
import { Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "../hooks/useColorScheme";

type Patio = {
  id_patio: number;
  nome: string;
  endereco: string;
};

export default function Cadastro() {
  const colorScheme = useColorScheme();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState<"Administrador" | "Funcionario">(
    "Funcionario"
  );
  const [patio, setPatio] = useState<string>("");
  const [patios, setPatios] = useState<Patio[]>([]);

  useEffect(() => {
    // Carrega patios do AsyncStorage
    AsyncStorage.getItem("patios").then((data) => {
      if (data) setPatios(JSON.parse(data));
    });
  }, []);

  async function handleCadastro() {
    if (!nome || !email || !senha || (cargo === "Funcionario" && !patio)) {
      Alert.alert("Preencha todos os campos obrigatórios.");
      return;
    }
    const novoUsuario = {
      nome,
      email,
      senha,
      cargo,
      patio: cargo === "Funcionario" ? patio : null,
    };
    // Salva usuário (exemplo: em AsyncStorage)
    const stored = await AsyncStorage.getItem("usuarios");
    const usuarios = stored ? JSON.parse(stored) : [];
    usuarios.push(novoUsuario);
    await AsyncStorage.setItem("usuarios", JSON.stringify(usuarios));
    Alert.alert("Usuário cadastrado com sucesso!");
    setNome("");
    setEmail("");
    setSenha("");
    setCargo("Funcionario");
    setPatio("");
  }

  return (
    <View
      className={`flex-1 px-6 ${
        colorScheme === "light" ? "bg-white" : "bg-black"
      }`}
    >
      <Text className="text-4xl text-center font-bold mt-12 mb-8 text-green-400">
        Cadastro de Funcionário
      </Text>

      <Text className="mb-1 text-lg font-bold text-green-700">Nome</Text>
      <TextInput
        className={`border rounded-lg px-3 py-2 mb-4 ${
          colorScheme === "light"
            ? "border-green-700 text-black"
            : "border-green-400 text-white"
        }`}
        placeholder="Digite o nome"
        placeholderTextColor="#999"
        value={nome}
        onChangeText={setNome}
      />

      <Text className="mb-1 text-lg font-bold text-green-700">Email</Text>
      <TextInput
        className={`border rounded-lg px-3 py-2 mb-4 ${
          colorScheme === "light"
            ? "border-green-700 text-black"
            : "border-green-400 text-white"
        }`}
        placeholder="Digite o email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text className="mb-1 text-lg font-bold text-green-700">Senha</Text>
      <TextInput
        className={`border rounded-lg px-3 py-2 mb-4 ${
          colorScheme === "light"
            ? "border-green-700 text-black"
            : "border-green-400 text-white"
        }`}
        placeholder="Digite a senha"
        placeholderTextColor="#999"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <Text className="mb-1 text-lg font-bold text-green-700">Cargo</Text>
      <View
        className={`border rounded-lg mb-4 ${
          colorScheme === "light" ? "border-green-700" : "border-green-400"
        }`}
      >
        <Picker
          selectedValue={cargo}
          onValueChange={(itemValue) => setCargo(itemValue)}
          style={{ color: colorScheme === "light" ? "#000" : "#fff" }}
        >
          <Picker.Item label="Funcionário" value="Funcionario" />
          <Picker.Item label="Administrador" value="Administrador" />
        </Picker>
      </View>

      {cargo === "Funcionario" && (
        <>
          <Text className="mb-1 text-lg font-bold text-green-700">Pátio</Text>
          <View
            className={`border rounded-lg mb-4 ${
              colorScheme === "light" ? "border-green-700" : "border-green-400"
            }`}
          >
            <Picker
              placeholder="Selecione um pátio"
              selectedValue={patio}
              onValueChange={(itemValue) => setPatio(itemValue)}
              style={{ color: colorScheme === "light" ? "#000" : "#fff" }}
            >
              <Picker.Item label="Selecione um pátio" value="" />
              {patios.map((p) => (
                <Picker.Item key={p.id_patio} label={p.nome} value={p.nome} />
              ))}
            </Picker>
          </View>
        </>
      )}

      <TouchableOpacity
        className={`bg-green-500 rounded-lg py-3 mb-4 ${
          colorScheme === "light" ? "shadow-md" : "shadow-lg"
        }`}
        onPress={handleCadastro}
      >
        <Text className="text-center text-white text-lg font-bold">
          Cadastrar
        </Text>
      </TouchableOpacity>
    </View>
  );
}
