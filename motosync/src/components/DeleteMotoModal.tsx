import React from "react";
import { Modal, Pressable, View, Text, TouchableOpacity } from "react-native";

interface DeleteMotoModalProps {
  visible: boolean;
  moto: any;
  colorScheme: "light" | "dark";
  onCancel: () => void;
  onConfirm: (id_moto: number) => void;
}

export const DeleteMotoModal: React.FC<DeleteMotoModalProps> = ({
  visible,
  moto,
  colorScheme,
  onCancel,
  onConfirm,
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onCancel}
  >
    <Pressable className="flex-1 bg-black/40 justify-center items-center" onPress={onCancel}>
      <View className={`p-6 rounded-xl w-80 ${colorScheme === "light" ? "bg-white" : "bg-gray-800"}`}>
        <Text className="text-xl font-bold mb-4 text-red-600">
          Tem certeza que deseja excluir esta moto?
        </Text>
        {moto && (
          <>
            <Text className={`mb-2 font-bold text-xl ${colorScheme === "light" ? "text-black" : "text-green-500"}`}>
              ID: {moto.id_moto}
            </Text>
            <Text className={`mb-2 font-bold text-xl ${colorScheme === "light" ? "text-black" : "text-green-500"}`}>
              Placa: {moto.placa}
            </Text>
          </>
        )}
        <View className="flex-row justify-between mt-4">
          <TouchableOpacity
            className="bg-gray-300 rounded-lg px-4 py-2"
            onPress={onCancel}
          >
            <Text className="text-black px-3 text-lg font-bold">Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-red-600 rounded-lg px-4 py-2"
            onPress={() => onConfirm(moto.id_moto)}
          >
            <Text className="text-white px-4 text-lg font-bold">Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  </Modal>
);