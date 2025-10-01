import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { useColorScheme } from "../hooks/useColorScheme";

type Vaga = {
  id: string;
  identificacao: string;
  patioId: string;
  patioNome: string;
  status: string | null;
  moto?: Moto | null;
};

type Moto = {
  id?: string;
  placa?: string;
  modelo?: string;
  status?: string;
};

type VagaInfoModalProps = {
  visible: boolean;
  onClose: () => void;
  vaga: Vaga;
  moto?: Moto | null;
  nomePatio?: string;
  onDeleteVaga: (id: string) => void;
};

export function VagaInfoModal({
  visible,
  onClose,
  vaga,
  moto,
  nomePatio,
  onDeleteVaga,
}: VagaInfoModalProps) {
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
          <View
            className={`w-80 p-6 rounded-xl ${
              colorScheme === "light" ? "bg-white" : "bg-gray-800"
            }`}
          >
            <Text className="text-2xl font-bold mb-4 text-green-600">
              Informações da Vaga
            </Text>
            <Text
              className={`mb-2 text-xl ${
                colorScheme === "light" ? "text-gray-800" : "text-gray-200"
              }`}
            >
              <Text className="font-bold">Identificação:</Text>{" "}
              {vaga.identificacao}
            </Text>
            <Text
              className={`mb-2 text-xl ${
                colorScheme === "light" ? "text-gray-800" : "text-gray-200"
              }`}
            >
              <Text className="font-bold">ID da Vaga:</Text> {vaga.id}
            </Text>
            <Text
              className={`mb-2 text-xl ${
                colorScheme === "light" ? "text-gray-800" : "text-gray-200"
              }`}
            >
              <Text className="font-bold">Pátio:</Text>{" "}
              {vaga.patioNome || nomePatio}
            </Text>
            <Text
              className={`mb-2 text-xl ${
                colorScheme === "light" ? "text-gray-800" : "text-gray-200"
              }`}
            >
              <Text className="font-bold">Status da Vaga:</Text>{" "}
              {vaga.status ?? "-"}
            </Text>
            {vaga.moto || moto ? (
              <>
                <Text
                  className={`mb-2 text-xl ${
                    colorScheme === "light" ? "text-gray-800" : "text-gray-200"
                  }`}
                >
                  <Text className="font-bold">Placa:</Text>{" "}
                  {(vaga.moto?.placa || moto?.placa) ?? "-"}
                </Text>
                <Text
                  className={`mb-2 text-xl ${
                    colorScheme === "light" ? "text-gray-800" : "text-gray-200"
                  }`}
                >
                  <Text className="font-bold">Modelo:</Text>{" "}
                  {(vaga.moto?.modelo || moto?.modelo) ?? "-"}
                </Text>
                <Text
                  className={`mb-2 text-xl ${
                    colorScheme === "light" ? "text-gray-800" : "text-gray-200"
                  }`}
                >
                  <Text className="font-bold">Status da Moto:</Text>{" "}
                  {(vaga.moto?.status || moto?.status) ?? "-"}
                </Text>
              </>
            ) : (
              <Text className="mb-2 text-lg text-gray-400">
                Nenhuma moto nesta vaga
              </Text>
            )}
            <TouchableOpacity
              className="mt-4 bg-green-600 rounded-lg px-4 py-2 w-full items-center"
              onPress={onClose}
            >
              <Text className="text-white text-xl font-bold">Fechar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`mt-2 rounded-lg px-4 py-2 w-full items-center ${
                moto ? "bg-gray-400" : "bg-red-600"
              }`}
              onPress={() => {
                if (!(vaga.moto || moto)) {
                  onClose();
                  setTimeout(() => setDeleteModalVisible(true), 300);
                }
              }}
              disabled={!!(vaga.moto || moto)}
            >
              <Text className="text-white text-xl font-bold">Excluir Vaga</Text>
            </TouchableOpacity>
            {(vaga.moto || moto) && (
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
          <View
            className={`w-96 p-6 rounded-xl ${
              colorScheme === "light" ? "bg-white" : "bg-gray-800"
            }`}
          >
            <Text className="text-2xl font-bold mb-4 text-red-600">
              Confirmar Exclusão
            </Text>
            <Text
              className={`mb-4 text-xl ${
                colorScheme === "light" ? "text-gray-800" : "text-gray-200"
              }`}
            >
              Tem certeza que deseja excluir a vaga{" "}
              <Text className="font-bold">{vaga.identificacao}</Text>?
            </Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-gray-300 rounded-lg px-4 py-2 mr-2"
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text className="text-black text-xl px-4 py-1 font-bold">
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-red-600 rounded-lg px-4 py-2"
                onPress={() => {
                  onDeleteVaga(vaga.id);
                  setDeleteModalVisible(false); // se usar modal de confirmação
                }}
              >
                <Text className="text-white text-xl px-6 py-1 font-bold">
                  Excluir
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
