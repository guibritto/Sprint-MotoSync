import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import vagasData from "../data/vagasMock.json"; // Importa o mock de vagas

type Patio = {
  id_patio: number;
  nome: string;
  endereco: string;
};

type DeletePatioButtonProps = {
  patios: Patio[];
  onDelete: (nome: string) => void;
  colorScheme: "light" | "dark";
};

export function DeletePatioButton({ patios, onDelete, colorScheme }: DeletePatioButtonProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState("");
  const [nomeInvalido, setNomeInvalido] = useState(false);
  const [possuiVagas, setPossuiVagas] = useState(false);

  async function handleDelete() {
    const patio = patios.find(
      (p) => p.nome.trim().toLowerCase() === nome.trim().toLowerCase()
    );
    setNomeInvalido(!patio);
    setPossuiVagas(false);
    if (!patio) return;

    // Busca vagas do AsyncStorage e do mock
    const storedVagas = await AsyncStorage.getItem("vagas");
    const vagasStorage = storedVagas ? JSON.parse(storedVagas) : [];
    const vagasFilialStorage = vagasStorage.filter(
      (v: any) => Number(v.id_patio) === Number(patio.id_patio)
    );
    const vagasFilialMock = (vagasData as any[]).filter(
      (v) => Number(v.id_patio) === Number(patio.id_patio)
    );
    if (vagasFilialStorage.length > 0 || vagasFilialMock.length > 0) {
      setPossuiVagas(true);
      return;
    }

    // Remove do AsyncStorage
    const stored = await AsyncStorage.getItem("patios");
    const patiosStorage = stored ? JSON.parse(stored) : [];
    const novosPatios = patiosStorage.filter(
      (p: any) => p.nome.trim().toLowerCase() !== nome.trim().toLowerCase()
    );
    await AsyncStorage.setItem("patios", JSON.stringify(novosPatios));
    onDelete(nome);
    setModalVisible(false);
    setNome("");
    setNomeInvalido(false);
    setPossuiVagas(false);
  }

  return (
    <>
      <TouchableOpacity
        className="absolute right-3 bottom-16 bg-red-500 rounded-full p-4 items-center justify-center z-10"
        style={{ width: 56 }}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="trash" size={28} color="#fff" />
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className={`w-96 p-6 rounded-xl ${colorScheme === "light" ? "bg-white" : "bg-gray-800"}`}>
            <Text className="text-2xl font-bold mb-4 text-red-600">Excluir Pátio</Text>
            <Text className={`mb-2 ${colorScheme === "light" ? "text-gray-800" : "text-gray-200"}`}>
              Digite o nome exato da filial que deseja excluir:
            </Text>
            <TextInput
              className={`border-b border-red-400 mb-2 p-2 font-bold text-xl ${colorScheme === "light" ? "text-gray-800" : "text-gray-200"}`}
              placeholder="Nome da Filial"
              placeholderTextColor="#999"
              value={nome}
              onChangeText={text => {
                setNome(text);
                setNomeInvalido(false);
                setPossuiVagas(false);
              }}
              autoCapitalize="none"
            />
            {nomeInvalido && (
              <Text className="text-red-500 text-xs mt-1">
                Nenhuma filial encontrada com esse nome.
              </Text>
            )}
            {possuiVagas && (
              <Text className="text-red-500 text-xs mt-1">
                Não é possível excluir uma filial que possui vagas cadastradas.
              </Text>
            )}
            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                className="bg-gray-300 rounded-lg px-4 py-2"
                onPress={() => {
                  setModalVisible(false);
                  setNome("");
                  setNomeInvalido(false);
                  setPossuiVagas(false);
                }}
              >
                <Text className="text-black px-6 py2 text-xl font-bold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`rounded-lg px-4 py-2 ${nome.trim() ? "bg-red-600" : "bg-red-300"}`}
                disabled={!nome.trim()}
                onPress={handleDelete}
              >
                <Text className="text-white px-6 py2 text-xl font-bold">Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}