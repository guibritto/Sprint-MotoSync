import { useLocalSearchParams } from "expo-router";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { useColorScheme } from "../../hooks/useColorScheme";
import { MenuBar } from "../../components/MenuBar";
import { useState, useEffect } from "react";
import Hamburger from "../../components/Hamburger";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { VagaInfoModal } from "../../components/VagaInfoModal";
import { AddVagaButton } from "../../components/AddVagaButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SearchVaga } from "../../components/SearchVaga";

export default function Filial() {
  type Vaga = {
    id_vaga: number;
    codigo: string;
    id_patio?: number;
    vaga?: Vaga | null;
  };

  type Moto = {
    id_moto: number;
    placa: string;
    status: string;
    modelo: string;
    patio: string;
    vaga: string;
  };

  const { id_patio, nome } = useLocalSearchParams();
  const nomeFilial = Array.isArray(nome) ? nome[0] : nome ?? "";
  const colorScheme = useColorScheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVaga, setSelectedVaga] = useState<Vaga | null>(null);
  const [selectedMoto, setSelectedMoto] = useState<Moto | null>(null);
  const [searchVaga, setSearchVaga] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<
    "todas" | "ocupada" | "disponivel"
  >("todas");

  const router = useRouter();
  const queryClient = useQueryClient();

  // Busca vagas da API
  console.log("id_patio recebido:", id_patio);
  const {
    data: vagasData,
    isLoading: vagasLoading,
    error: vagasError,
  } = useQuery({
    queryKey: ["vagas", id_patio],
    queryFn: async () => {
      const res = await api.get("/api/vagas");
      console.log("Resposta da API /api/vagas:", res.data);
      // Se a API retornar { content: [...] }
      const allVagas = Array.isArray(res.data?.content)
        ? res.data.content
        : res.data;
      const patioIdParam = Array.isArray(id_patio) ? id_patio[0] : id_patio;
      const vagasFiltradas = allVagas.filter((vaga: any) => {
        const match = vaga.patioId === patioIdParam;
        if (match) console.log("Vaga encontrada:", vaga);
        return match;
      });
      return vagasFiltradas;
    },
  });

  // Busca motos da API
  const {
    data: motosData,
    isLoading: motosLoading,
    error: motosError,
  } = useQuery({
    queryKey: ["motos"],
    queryFn: async () => {
      const res = await api.get("/api/motos");
      return Array.isArray(res.data?.content) ? res.data.content : res.data;
    },
  });

  // Função para checar status da vaga
  function getVagaStatus(vagaCodigo: string) {
    if (!motosData) return "disponivel";
    const motosArray = Array.isArray(motosData?.content)
      ? motosData.content
      : Array.isArray(motosData)
      ? motosData
      : [];
    const moto = motosArray.find(
      (m: Moto) =>
        m.vaga === vagaCodigo &&
        m.patio === nomeFilial &&
        (m.status === "Disponível" || m.status === "Manutenção")
    );
    return moto ? "ocupada" : "disponivel";
  }

  // Adiciona vaga via API
  async function handleAddVaga(novaVaga: any) {
    if (novaVaga.id_patio == id_patio || !novaVaga.id_patio) {
      await api.post("/api/vagas", novaVaga);
      // Invalida query para atualizar lista
      // @ts-ignore
      if (window.queryClient)
        window.queryClient.invalidateQueries(["vagas", id_patio]);
    }
  }

  // Deleta vaga via API
  async function handleDeleteVaga(id_vaga: number) {
    await api.delete(`/api/vagas/${id_vaga}`);
    // Invalida query para atualizar lista
    // @ts-ignore
    if (window.queryClient)
      window.queryClient.invalidateQueries(["vagas", id_patio]);
    setModalVisible(false);
    setSelectedVaga(null);
    setSelectedMoto(null);
  }

  const vagasFiltradas = vagasData
    .filter(
      (vaga) =>
        vaga.identificacao.toUpperCase().includes(searchVaga.toUpperCase()) &&
        (statusFiltro === "todas" ||
          (statusFiltro === "ocupada" && vaga.status === "OCUPADA") ||
          (statusFiltro === "disponivel" && vaga.status === "LIVRE"))
    )
    .sort((a, b) => {
      if (!a.identificacao || !b.identificacao) return 0;
      // Extrai letra e número
      const [letraA, ...numA] = a.identificacao.toUpperCase();
      const [letraB, ...numB] = b.identificacao.toUpperCase();
      if (letraA < letraB) return -1;
      if (letraA > letraB) return 1;
      // Se letras iguais, compara número (com zero à esquerda)
      return (
        parseInt(numA.join("").padStart(2, "0")) -
        parseInt(numB.join("").padStart(2, "0"))
      );
    });

  return (
    <View
      className={`flex-1 ${colorScheme === "light" ? "bg-white" : "bg-black"}`}
    >
      <MenuBar onMenuPress={() => setMenuVisible(true)} title={nomeFilial} />
      <Hamburger visible={menuVisible} onClose={() => setMenuVisible(false)} />
      <TouchableOpacity
        onPress={() => router.back()}
        className="flex-row items-center mt-4 mb-3"
      >
        <Ionicons
          name="arrow-back"
          size={28}
          color={colorScheme === "light" ? "#222" : "#58cc3b"}
        />
      </TouchableOpacity>
      <SearchVaga
        value={searchVaga}
        onChangeText={setSearchVaga}
        status={statusFiltro}
        onStatusChange={setStatusFiltro}
        colorScheme={colorScheme}
      />
      <View className=" px-1 mb-72">
        <FlatList
          className={`mb-40 border-2 rounded-lg border-green-400 ${
            colorScheme === "light" ? "bg-gray-100" : "bg-gray-900"
          }`}
          data={vagasFiltradas}
          keyExtractor={(item) =>
            item?.id_vaga
              ? item.id_vaga.toString()
              : item?.id
              ? item.id.toString()
              : Math.random().toString()
          }
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 8 }}
          ListEmptyComponent={
            vagasLoading ? (
              <Text className="text-center text-gray-400 mt-8">
                Carregando vagas...
              </Text>
            ) : (
              <Text className="text-center text-gray-400 mt-8">
                Nenhuma vaga nesta filial.
              </Text>
            )
          }
          renderItem={({ item }) => {
            const status = item.status;
            const isOcupada = status === "OCUPADA";
            const borderColor = isOcupada
              ? "border-red-500"
              : "border-green-500";
            const textColor = isOcupada
              ? "text-red-500"
              : colorScheme === "light"
              ? "text-green-700"
              : "text-green-400";
            const statusLabel = isOcupada ? "Ocupada" : "Disponível";

            return (
              <TouchableOpacity
                className="flex-1 mt-1 mb-1 items-center"
                onPress={() => {
                  setSelectedVaga(item);
                  setSelectedMoto(item.moto ?? null);
                  setModalVisible(true);
                }}
              >
                <View
                  className={`w-48 h-32 m-2 justify-center items-center rounded-lg border-2 ${borderColor} ${
                    colorScheme === "light" ? "bg-white" : "bg-gray-800"
                  }`}
                >
                  <Text className={`text-3xl font-extrabold ${textColor}`}>
                    Vaga: {item.identificacao}
                  </Text>
                  <Text className={`mt-2 text-2xl font-bold ${textColor}`}>
                    {statusLabel}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      {selectedVaga && (
        <VagaInfoModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          vaga={selectedVaga}
          moto={selectedMoto}
          nomePatio={nomeFilial}
          onDeleteVaga={handleDeleteVaga}
        />
      )}
      <AddVagaButton
        onAdd={handleAddVaga}
        colorScheme={colorScheme}
        id_patio={Number(id_patio)}
      />
    </View>
  );
}
