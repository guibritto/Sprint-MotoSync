import React from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

export function MotoInfoModal({
  visible,
  selectedMoto,
  colorScheme,
  onClose,
  onEdit,
}: {
  visible: boolean;
  selectedMoto: any;
  colorScheme: "light" | "dark";
  onClose: () => void;
  onEdit: (moto: any) => void;
}) {
  function getStatusColor(status: string) {
    if (status === "Disponível") return "text-green-500";
    if (status === "Alugada") return "text-red-500";
    if (status === "Manutenção") return "text-orange-400";
    return "text-gray-300";
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/40 justify-center items-center" onPress={onClose}>
        <View className={`p-6 rounded-xl w-80 ${colorScheme === "light" ? "bg-white" : "bg-gray-800"}`}>
          {selectedMoto && (
            <>
              <Text className="text-3xl font-bold text-green-600 mb-2">ID: {selectedMoto.id_moto}</Text>
              <Text className={`text-lg mb-1 ${colorScheme === "light" ? "text-black" : "text-gray-200"}`}>Placa: {selectedMoto.placa}</Text>
              <View className="flex-row justify-start items-center">
                <Text className={`text-lg mb-1 ${colorScheme === "light" ? "text-black" : "text-gray-200"}`}>Status: </Text>
                <Text className={`text-lg mb-1 ${colorScheme === "light" ? "text-black" : "text-gray-200"} ${getStatusColor(selectedMoto.status)}`}>{selectedMoto.status}</Text>
              </View>
              <Text className={`text-lg mb-1 ${colorScheme === "light" ? "text-black" : "text-gray-200"}`}>Pátio: {selectedMoto.patio}</Text>
              <Text className={`text-lg mb-1 ${colorScheme === "light" ? "text-black" : "text-gray-200"}`}>Vaga: {selectedMoto.vaga}</Text>
              <View className="flex-row justify-start">
                <Text className={`text-lg mb-1 ${colorScheme === "light" ? "text-black" : "text-gray-200"}`}>Modelo: </Text>
                <Text className={`text-lg mb-4 font-bold ${colorScheme === "light" ? "text-black" : "text-green-500"}`}>{selectedMoto.modelo.toUpperCase()}</Text>
              </View>
              <View className="flex-row justify-between">
                <TouchableOpacity
                  className="bg-green-500 rounded-lg px-4 py-2 mt-2 mr-2"
                  onPress={() => {
                    onClose();
                    onEdit(selectedMoto);
                  }}
                >
                  <Text className="text-white text-center px-7 py-1 text-lg font-bold">Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-gray-500 rounded-lg px-4 py-2 mt-2"
                  onPress={onClose}
                >
                  <Text className="text-white text-center px-4 py-1 text-lg font-bold">Fechar</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Pressable>
    </Modal>
  );
}