import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

type AddPatioButtonProps = {
  onAdd: (patio: { nome: string; endereco: string }) => void;
  colorScheme: "light" | "dark";
  patios: { nome: string; endereco: string }[];
};

export function AddPatioButton({ onAdd, colorScheme, patios = [] }: AddPatioButtonProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [nomeInvalido, setNomeInvalido] = useState(false);
  const [enderecoInvalido, setEnderecoInvalido] = useState(false);
  const [nomeDuplicado, setNomeDuplicado] = useState(false);

  function handleAdd() {
    const nomeValido = nome.length > 0;
    const enderecoValido = endereco.length > 0;
    // Verifica duplicidade em todos os pátios (mock + storage)
    const nomeJaExiste = patios.some(
      (p) => p.nome.trim().toLowerCase() === nome.trim().toLowerCase()
    );

    setNomeInvalido(!nomeValido);
    setEnderecoInvalido(!enderecoValido);
    setNomeDuplicado(nomeJaExiste);

    if (!nomeValido || !enderecoValido || nomeJaExiste) return;

    onAdd({ nome, endereco });
    setModalVisible(false);
    setNome("");
    setEndereco("");
    setNomeInvalido(false);
    setEnderecoInvalido(false);
    setNomeDuplicado(false);
  }

  return (
    <>
      <TouchableOpacity
        className="absolute left-3 right-24 bottom-16 bg-green-500 rounded-full p-4 flex-row justify-center items-center z-10"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white text-xl font-bold mr-2">Adicionar Pátio</Text>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className={`w-96 p-6 rounded-xl ${colorScheme === "light" ? "bg-white" : "bg-gray-800"}`}>
            <Text className="text-2xl font-bold mb-4 text-green-600">Novo Pátio</Text>
            <TextInput
              className={`border-b border-green-400 mb-2 p-2 font-bold text-2xl ${colorScheme === "light" ? "text-gray-800" : "text-gray-200"}`}
              placeholder="Nome do Pátio"
              placeholderTextColor="#999"
              value={nome}
              onChangeText={text => {
                setNome(text);
                setNomeInvalido(false);
                setNomeDuplicado(false);
              }}
              autoCapitalize="words"
            />
            {nomeInvalido && (
              <Text className="text-red-500 text-xs mt-1">
                Informe um nome válido
              </Text>
            )}
            {nomeDuplicado && (
              <Text className="text-red-500 text-xs mt-1">
                Já existe um pátio com esse nome
              </Text>
            )}
            <TextInput
              className={`border-b border-green-400 mb-2 p-2 font-bold text-2xl ${colorScheme === "light" ? "text-gray-800" : "text-gray-200"}`}
              placeholder="Endereço"
              placeholderTextColor="#999"
              value={endereco}
              onChangeText={text => {
                setEndereco(text);
                setEnderecoInvalido(false);
              }}
              autoCapitalize="sentences"
            />
            {enderecoInvalido && (
              <Text className="text-red-500 text-xs mt-1">
                Informe um endereço válido
              </Text>
            )}
            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                className="bg-gray-300 rounded-lg px-4 py-2"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-black text-xl px-6 py-2 font-bold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-green-600 rounded-lg px-4 py-2"
                onPress={handleAdd}
              >
                <Text className="text-white text-xl px-6 py-2 font-bold">Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}