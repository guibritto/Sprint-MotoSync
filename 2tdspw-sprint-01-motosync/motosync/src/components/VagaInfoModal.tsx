import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { useColorScheme } from "../hooks/useColorScheme";

type Vaga = {
  id_vaga: number;
  codigo: string;
  id_patio?: number;
};

type Moto = {
  id_moto: number;
  placa: string;
  status: string;
  modelo: string;
  patio: string;
  vaga: string;
};

type VagaInfoModalProps = {
  visible: boolean;
  onClose: () => void;
  vaga: Vaga;
  moto: Moto | null;
  nomePatio: string;
  onDeleteVaga: (id_vaga: number) => void; // <-- aqui!
};

export function VagaInfoModal({ visible, onClose, vaga, moto, nomePatio, onDeleteVaga }: VagaInfoModalProps) {
  const colorScheme = useColorScheme();
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className={`w-80 p-6 rounded-xl ${colorScheme === "light" ? "bg-white" : "bg-gray-800"}`}>
            <Text className="text-2xl font-bold mb-4 text-green-600">Informações da Vaga</Text>
            <Text className={`mb-2 text-xl ${colorScheme === "light" ? "text-gray-800" : "text-gray-200"}`}><Text className="font-bold">Código:</Text> {vaga.codigo}</Text>
            <Text className={`mb-2 text-xl ${colorScheme === "light" ? "text-gray-800" : "text-gray-200"}`}><Text className="font-bold">ID da Vaga:</Text> {vaga.id_vaga}</Text>
            <Text className={`mb-2 text-xl ${colorScheme === "light" ? "text-gray-800" : "text-gray-200"}`}><Text className="font-bold">Pátio:</Text> {nomePatio}</Text>
            {moto ? (
              <>
                <Text className={`mb-2 text-xl ${colorScheme === "light" ? "text-gray-800" : "text-gray-200"}`}><Text className="font-bold">ID da Moto:</Text> {moto.id_moto}</Text>
                <Text className={`mb-2 text-xl ${colorScheme === "light" ? "text-gray-800" : "text-gray-200"}`}><Text className="font-bold">Placa:</Text> {moto.placa}</Text>
                <Text className={`mb-2 text-xl ${colorScheme === "light" ? "text-gray-800" : "text-gray-200"}`}><Text className="font-bold">Status da Moto:</Text> {moto.status}</Text>
              </>
            ) : (
              <Text className="mb-2 text-lg text-gray-400">Nenhuma moto nesta vaga</Text>
            )}
            <TouchableOpacity
              className="mt-4 bg-green-600 rounded-lg px-4 py-2 w-full items-center"
              onPress={onClose}
            >
              <Text className="text-white text-xl font-bold">Fechar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`mt-2 rounded-lg px-4 py-2 w-full items-center ${moto ? "bg-gray-400" : "bg-red-600"}`}
              onPress={() => {
                if (!moto) {
                  onClose();
                  setTimeout(() => setDeleteModalVisible(true), 300);
                }
              }}
              disabled={!!moto}
            >
              <Text className="text-white text-xl font-bold">
                Excluir Vaga
              </Text>
            </TouchableOpacity>
            {moto && (
              <Text className="text-xs text-red-400 mt-2 text-center">
                Não é possível excluir uma vaga ocupada por uma moto.
              </Text>
            )}
          </View>
        </View>
      </Modal>
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className={`w-96 p-6 rounded-xl ${colorScheme === "light" ? "bg-white" : "bg-gray-800"}`}>
            <Text className="text-2xl font-bold mb-4 text-red-600">Confirmar Exclusão</Text>
            <Text className={`mb-4 text-xl ${colorScheme === "light" ? "text-gray-800" : "text-gray-200"}`}>
              Tem certeza que deseja excluir a vaga <Text className="font-bold">{vaga.codigo}</Text>?
            </Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-gray-300 rounded-lg px-4 py-2 mr-2"
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text className="text-black text-xl px-4 py-1 font-bold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-red-600 rounded-lg px-4 py-2"
                onPress={() => {
                  onDeleteVaga(vaga.id_vaga);
                  setDeleteModalVisible(false); // se usar modal de confirmação
                }}
              >
                <Text className="text-white text-xl px-6 py-1 font-bold">Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}