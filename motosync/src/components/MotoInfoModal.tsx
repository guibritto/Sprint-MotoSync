import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
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
  // Busca todas as vagas
  const {
    data: vagasData,
    isLoading: vagasLoading,
    error: vagasError,
  } = useQuery({
    queryKey: ["vagas"],
    queryFn: async () => {
      const res = await api.get("/api/vagas");
      // Espera resposta: { content: [], ... }
      return res.data;
    },
  });

  // Busca todos os patios
  const {
    data: patiosData,
    isLoading: patiosLoading,
    error: patiosError,
  } = useQuery({
    queryKey: ["patios"],
    queryFn: async () => {
      const res = await api.get("/api/patios");
      // Espera resposta: { content: [], ... }
      return res.data;
    },
  });

  // Garante que vagasData e patiosData sejam arrays
  const vagasArray = Array.isArray(vagasData?.content)
    ? vagasData.content
    : Array.isArray(vagasData)
    ? vagasData
    : [];
  const patiosArray = Array.isArray(patiosData?.content)
    ? patiosData.content
    : Array.isArray(patiosData)
    ? patiosData
    : [];

  // Filtra a vaga ocupada pela moto
  const vagaInfo = vagasArray.find((v: any) => {
    const vagaId = selectedMoto?.vaga;
    return v.id === vagaId || v.id_vaga === vagaId;
  });

  // Busca o nome do pátio usando o id_patio da vaga
  let patioNome = "-";
  let patioId = "-";
  if (vagaInfo) {
    // Tenta pegar id_patio da vaga
    const idPatioRef =
      vagaInfo.id_patio ?? vagaInfo.patioId ?? vagaInfo.patio_id;
    if (idPatioRef) {
      const patio = patiosArray.find(
        (p: any) => p.id_patio === idPatioRef || p.id === idPatioRef
      );
      patioNome = patio && patio.nome ? patio.nome : "-";
      patioId =
        patio && (patio.id_patio ?? patio.id)
          ? patio.id_patio ?? patio.id
          : "-";
    }
  }

  // Mapeia status para exibição amigável e cor
  function getStatusLabel(status: string) {
    if (status === "DISPONIVEL") return "Disponível";
    if (status === "INATIVADA") return "Inativada";
    if (status === "EM_MANUTENCAO") return "Em Manutenção";
    return status;
  }

  function getStatusColor(status: string) {
    if (status === "DISPONIVEL") return "text-green-500";
    if (status === "INATIVADA") return "text-red-500";
    if (status === "EM_MANUTENCAO") return "text-orange-400";
    return "text-gray-300";
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/40 justify-center items-center"
        onPress={onClose}
      >
        <View
          className={`p-6 rounded-xl w-80 ${
            colorScheme === "light" ? "bg-white" : "bg-gray-800"
          }`}
        >
          {selectedMoto && (
            <React.Fragment>
              <Text className="text-3xl font-bold text-green-600 mb-2">
                ID: {selectedMoto.id ?? selectedMoto.id_moto}
              </Text>
              <Text
                className={`text-lg mb-1 ${
                  colorScheme === "light" ? "text-black" : "text-gray-200"
                }`}
              >
                Placa: {selectedMoto.placa}
              </Text>
              <View className="flex-row justify-start items-center">
                <Text
                  className={`text-lg mb-1 ${
                    colorScheme === "light" ? "text-black" : "text-gray-200"
                  }`}
                >
                  Status:{" "}
                </Text>
                <Text
                  className={`text-lg mb-1 ${
                    colorScheme === "light" ? "text-black" : "text-gray-200"
                  } ${getStatusColor(selectedMoto.status)}`}
                >
                  {getStatusLabel(selectedMoto.status)}
                </Text>
              </View>
              <Text
                className={`text-lg mb-1 ${
                  colorScheme === "light" ? "text-black" : "text-gray-200"
                }`}
              >
                Pátio: {`${patioNome} (ID: ${patioId})`}
              </Text>
              <Text
                className={`text-lg mb-1 ${
                  colorScheme === "light" ? "text-black" : "text-gray-200"
                }`}
              >
                Vaga:{" "}
                {vagasLoading
                  ? "Carregando..."
                  : vagaInfo?.identificacao ?? "-"}
              </Text>
              <View className="flex-row justify-between">
                <TouchableOpacity
                  className="bg-green-500 rounded-lg px-4 py-2 mt-2 mr-2"
                  onPress={() => {
                    onClose();
                    onEdit(selectedMoto);
                  }}
                >
                  <Text className="text-white text-center px-7 py-1 text-lg font-bold">
                    Editar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-gray-500 rounded-lg px-4 py-2 mt-2"
                  onPress={onClose}
                >
                  <Text className="text-white text-center px-4 py-1 text-lg font-bold">
                    Fechar
                  </Text>
                </TouchableOpacity>
              </View>
            </React.Fragment>
          )}
        </View>
      </Pressable>
    </Modal>
  );
}
