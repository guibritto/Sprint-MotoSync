import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useColorScheme } from "../hooks/useColorScheme";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  statusFiltro: string | null;
  onStatusChange: (status: string | null) => void;
};

export function SearchBarMoto({
  value,
  onChangeText,
  statusFiltro,
  onStatusChange,
}: Props) {
  const colorScheme = useColorScheme();

  return (
    <View className="px-2 mt-8 mb-2">
      <View
        className={`flex-row items-center justify-center w-full mx-auto rounded-lg border-2 border-green-400 p-2 mt-4 mb-4 ${
          colorScheme === "light" ? "bg-gray-100" : "bg-gray-800"
        }`}
      >
        <TextInput
          className="flex-1 ml-2 mb-1 text-xl text-green-400"
          placeholder="Buscar por placa ou modelo"
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="characters"
          maxLength={20}
        />
        <Feather name="search" size={24} color="#289128" />
      </View>
      <View className="flex-row justify-center mb-2 gap-2">
        {["DISPONIVEL", "INATIVADA", "EM_MANUTENCAO"].map((status) => {
          // Mapeia para exibição amigável
          const statusLabel =
            status === "DISPONIVEL"
              ? "Disponível"
              : status === "INATIVADA"
              ? "Inativada"
              : status === "EM_MANUTENCAO"
              ? "Em Manutenção"
              : status;
          // Defina a cor de fundo quando selecionado
          const backgroundColor =
            statusFiltro === status
              ? status === "DISPONIVEL"
                ? "#22c55e"
                : status === "INATIVADA"
                ? "#ef4444"
                : status === "EM_MANUTENCAO"
                ? "#f59e42"
                : "#e5e7eb"
              : "#e5e7eb";

          return (
            <TouchableOpacity
              key={status}
              onPress={() =>
                onStatusChange(statusFiltro === status ? null : status)
              }
              style={{
                backgroundColor,
                borderRadius: 8,
                paddingVertical: 4,
                paddingHorizontal: 12,
                marginHorizontal: 4,
                borderWidth: 2,
                borderColor:
                  status === "DISPONIVEL"
                    ? "#22c55e"
                    : status === "INATIVADA"
                    ? "#ef4444"
                    : status === "EM_MANUTENCAO"
                    ? "#f59e42"
                    : "#e5e7eb",
              }}
            >
              <Text
                style={{
                  color: "#000",
                  fontWeight: "bold",
                }}
              >
                {statusLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
