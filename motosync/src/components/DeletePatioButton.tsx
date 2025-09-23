import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
} from "react-native";
import vagasData from "../data/vagasMock.json";

type Patio = {
  id_patio: number;
  nome: string;
  endereco: string;
};

type DeletePatioButtonProps = {
  patio: Patio;
  onDelete: (nome: string) => void;
  colorScheme: "light" | "dark";
};

export function DeletePatioButton({
  patio,
  onDelete,
  colorScheme,
}: DeletePatioButtonProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [input, setInput] = useState("");
  const [erro, setErro] = useState("");
  const [possuiVagas, setPossuiVagas] = useState(false);

  async function handleDelete() {
    setErro("");
    setPossuiVagas(false);

    if (input.trim() !== "Deletar") {
      setErro('Digite "Deletar" para confirmar.');
      return;
    }

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
      (p: any) =>
        p.nome.trim().toLowerCase() !== patio.nome.trim().toLowerCase()
    );
    await AsyncStorage.setItem("patios", JSON.stringify(novosPatios));
    onDelete(patio.nome);
    setModalVisible(false);
    setInput("");
    setErro("");
    setPossuiVagas(false);
  }

  return (
    <>
      <TouchableOpacity
        className="ml-2"
        onPress={() => setModalVisible(true)}
        accessibilityLabel={`Excluir ${patio.nome}`}
      >
        <Ionicons name="trash" size={32} color="#e11d48" />
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/40 justify-center items-center"
          onPress={() => setModalVisible(true)}
        >
          <View
            className={`w-80 p-6 rounded-xl ${
              colorScheme === "light" ? "bg-white" : "bg-gray-800"
            }`}
            // Impede que o clique dentro do modal feche ele
            onStartShouldSetResponder={() => true}
          >
            <Text className="text-2xl font-bold mb-4 text-red-600">
              Excluir Pátio
            </Text>
            <Text
              className={`mb-2 ${
                colorScheme === "light" ? "text-gray-800" : "text-gray-200"
              }`}
            >
              Para excluir <Text className="font-bold">{patio.nome}</Text>,
              digite <Text className="font-bold text-red-600">Deletar</Text>{" "}
              abaixo:
            </Text>
            <TextInput
              className={`border-b border-red-400 mb-2 p-2 font-bold text-xl ${
                colorScheme === "light" ? "text-gray-800" : "text-gray-200"
              }`}
              placeholder="Digite: Deletar"
              placeholderTextColor="#999"
              value={input}
              onChangeText={(text) => {
                setInput(text);
                setErro("");
                setPossuiVagas(false);
              }}
              autoCapitalize="none"
            />
            {erro ? (
              <Text className="text-red-500 text-xs mt-1">{erro}</Text>
            ) : null}
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
                  setInput("");
                  setErro("");
                  setPossuiVagas(false);
                }}
              >
                <Text className="text-black px-6 py2 text-xl font-bold">
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`rounded-lg px-4 py-2 ${
                  input.trim() === "Deletar" ? "bg-red-600" : "bg-red-300"
                }`}
                disabled={input.trim() !== "Deletar"}
                onPress={handleDelete}
              >
                <Text className="text-white px-6 py2 text-xl font-bold">
                  Excluir
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
