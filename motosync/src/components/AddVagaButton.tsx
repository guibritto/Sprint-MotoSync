import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

type AddVagaButtonProps = {
  onAdd: (vaga: any) => void;
  colorScheme: "light" | "dark";
  id_patio: number; // Passe o id_patio da tela
};

export function AddVagaButton({ onAdd, colorScheme, id_patio }: AddVagaButtonProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [codigoInvalido, setCodigoInvalido] = useState(false);
  const [codigoDuplicado, setCodigoDuplicado] = useState(false);

  async function handleAdd() {
  const codigoValido = /^[A-Z][0-9]{2}$/.test(codigo.trim());

  const stored = await AsyncStorage.getItem("vagas");
  const vagas = stored ? JSON.parse(stored) : [];

  // Verifica duplicidade apenas no AsyncStorage (não mais no mock)
  const jaExiste = vagas.some(
    (v: any) =>
      v.codigo.trim().toUpperCase() === codigo.trim().toUpperCase() &&
      Number(v.id_patio) === Number(id_patio)
  );

  setCodigoInvalido(!codigoValido);
  setCodigoDuplicado(jaExiste);

  if (!codigoValido || jaExiste) return;

  // Encontra o maior id_vaga apenas no AsyncStorage
  const todosIds = vagas.map((v: any) => Number(v.id_vaga));
  const maiorId = todosIds.length > 0 ? Math.max(...todosIds) : 0;

  const novaVaga = {
    id_vaga: maiorId + 1,
    codigo: codigo.trim().toUpperCase(),
    id_patio: id_patio,
  };

  vagas.push(novaVaga);
  await AsyncStorage.setItem("vagas", JSON.stringify(vagas));

  onAdd(novaVaga);
  setModalVisible(false);
  setCodigo("");
  setCodigoInvalido(false);
  setCodigoDuplicado(false);
}


  return (
    <>
      <TouchableOpacity
        className="absolute bottom-2 w-full bg-green-500 rounded-full p-4 mb-10 flex-row justify-center items-center"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white text-xl font-bold">Adicionar Vaga</Text>
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
            <Text className="text-2xl font-bold mb-4 text-green-600">Nova Vaga</Text>
            <TextInput
              className={`border-b border-green-400 mb-2 p-2 font-bold text-2xl ${colorScheme === "light" ? "text-gray-800" : "text-gray-200"}`}
              placeholder="Código da Vaga"
              placeholderTextColor="#999"
              value={codigo}
              onChangeText={text => {
                const upper = text.toUpperCase();
                setCodigo(upper);
                setCodigoInvalido(false);
                setCodigoDuplicado(false);
              }}
              autoCapitalize="characters"
              maxLength={3}
            />
            {codigoInvalido && (
              <Text className="text-red-500 text-xs mt-1">
                O código deve ser uma letra seguida de um número (ex: A01)
              </Text>
            )}
            {codigoDuplicado && (
              <Text className="text-red-500 text-xs mt-1">
                Já existe uma vaga com esse código nesta filial
              </Text>
            )}
            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                className="bg-gray-300 rounded-lg px-4 py-2"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-black text-xl px-5 py-2 font-bold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-green-600 rounded-lg px-4 py-2"
                onPress={handleAdd}
              >
                <Text className="text-white text-xl px-8 py-2 font-bold">Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}