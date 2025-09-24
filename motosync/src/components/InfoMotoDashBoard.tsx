import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

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

type InfoMotoDashBoardProps = {
  visible: boolean;
  onClose: () => void;
  vaga: Vaga | null;
  moto: Moto | null;
  nomePatio: string;
  colorScheme: "light" | "dark";
};

export default function InfoMotoDashBoard({
  visible,
  onClose,
  vaga,
  moto,
  nomePatio,
  colorScheme,
}: InfoMotoDashBoardProps) {
  if (!vaga) return null;
  return (
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
            <Text className="font-bold">Código:</Text> {vaga.codigo}
          </Text>
          <Text
            className={`mb-2 text-xl ${
              colorScheme === "light" ? "text-gray-800" : "text-gray-200"
            }`}
          >
            <Text className="font-bold">ID da Vaga:</Text> {vaga.id_vaga}
          </Text>
          <Text
            className={`mb-2 text-xl ${
              colorScheme === "light" ? "text-gray-800" : "text-gray-200"
            }`}
          >
            <Text className="font-bold">Pátio:</Text> {nomePatio}
          </Text>
          {moto ? (
            <>
              <Text
                className={`mb-2 text-xl ${
                  colorScheme === "light" ? "text-gray-800" : "text-gray-200"
                }`}
              >
                <Text className="font-bold">ID da Moto:</Text> {moto.id_moto}
              </Text>
              <Text
                className={`mb-2 text-xl ${
                  colorScheme === "light" ? "text-gray-800" : "text-gray-200"
                }`}
              >
                <Text className="font-bold">Placa:</Text> {moto.placa}
              </Text>
              <Text
                className={`mb-2 text-xl ${
                  colorScheme === "light" ? "text-gray-800" : "text-gray-200"
                }`}
              >
                <Text className="font-bold">Status da Moto:</Text> {moto.status}
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
        </View>
      </View>
    </Modal>
  );
}
