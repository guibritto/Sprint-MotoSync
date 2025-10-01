import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SearchHome } from "../components/SearchHome";
import { useColorScheme } from "../hooks/useColorScheme";
import Hamburger from "../components/Hamburger";
import { MenuBar } from "../components/MenuBar";
import { AddPatioButton } from "../components/AddPatioButton";
import { DeletePatioButton } from "../components/DeletePatioButton";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { AxiosError } from "axios";

type Patio = {
  id_patio: number;
  nome: string;
  endereco: string;
};

type Vaga = {
  id_vaga: number;
  codigo: string;
  id_patio: number;
};

type Moto = {
  id_moto: number;
  placa: string;
  status: string;
  modelo: string;
  patio: string;
  vaga: string;
};

export default function Home() {
  const [search, setSearch] = useState("");
  const colorScheme = useColorScheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Estados para paginação
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10); // ajuste conforme necessário

  // Fetch patios com paginação
  const {
    data: patiosData,
    isLoading: patiosLoading,
    error: patiosError,
  } = useQuery({
    queryKey: ["patios", page, pageSize, search],
    queryFn: async () => {
      const res = await api.get("/api/patios", {
        params: { page, size: pageSize, search },
      });
      // Espera resposta: { content: [], totalPages, ... }
      return res.data;
    },
  });

  // Fetch vagas
  const {
    data: vagasData,
    isLoading: vagasLoading,
    error: vagasError,
  } = useQuery({
    queryKey: ["vagas"],
    queryFn: async () => {
      const res = await api.get("/api/vagas");
      console.log("Vagas da API:", res.data);
      return res.data;
    },
  });

  // Fetch motos
  const {
    data: motosData,
    isLoading: motosLoading,
    error: motosError,
  } = useQuery({
    queryKey: ["motos"],
    queryFn: async () => {
      const res = await api.get("/api/motos");
      console.log("Motos da API:", res.data);
      return res.data;
    },
  });

  // Dados paginados
  const filteredPatios = Array.isArray(patiosData?.content)
    ? patiosData.content
    : [];

  // Adicionar patio
  const addPatioMutation = useMutation({
    mutationFn: async (novoPatio: Omit<Patio, "id_patio">) => {
      const res = await api.post("/api/patios", novoPatio);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patios"] });
    },
  });

  async function handleAddPatio(novoPatio: Omit<Patio, "id_patio">) {
    addPatioMutation.mutate(novoPatio);
  }

  // Deletar patio
  const deletePatioMutation = useMutation({
    mutationFn: async (nome: string) => {
      const patio = patiosData.find((p: Patio) => p.nome === nome);
      if (patio) {
        await api.delete(`/api/patios/${patio.id_patio}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patios"] });
    },
  });

  async function handleDeletePatio(nome: string) {
    deletePatioMutation.mutate(nome);
  }

  // Função para calcular info das vagas em tempo real
  function getVagasInfo(id_patio: number) {
    if (!vagasData || !motosData || !patiosData)
      return {
        totalVagas: 0,
        sessoes: [],
        totalSessoes: 0,
        vagasDisponiveis: 0,
      };

    // Garante que vagasData seja sempre um array
    const vagasArray = Array.isArray(vagasData?.content)
      ? vagasData.content
      : Array.isArray(vagasData)
      ? vagasData
      : [];
    const vagas = vagasArray.filter((v: Vaga) => v && v.id_patio === id_patio);

    // Garante que patiosData seja sempre um array
    const patiosArray = Array.isArray(patiosData?.content)
      ? patiosData.content
      : Array.isArray(patiosData)
      ? patiosData
      : [];
    const patioNome = patiosArray.find(
      (p: Patio) => p.id_patio === id_patio
    )?.nome;

    // Garante que motosData seja sempre um array
    const motosArray = Array.isArray(motosData?.content)
      ? motosData.content
      : Array.isArray(motosData)
      ? motosData
      : [];

    const sessoes = [...new Set(vagas.map((v: Vaga) => v.codigo?.[0]))];
    const vagasDisponiveis = vagas.filter(
      (vaga: Vaga) =>
        !motosArray.find(
          (m: Moto) =>
            m.vaga === vaga.codigo &&
            m.patio === patioNome &&
            (m.status === "Disponível" || m.status === "Manutenção")
        )
    ).length;
    return {
      totalVagas: vagas.length,
      sessoes,
      totalSessoes: sessoes.length,
      vagasDisponiveis,
    };
  }

  // Loading/Error states
  if (patiosLoading || vagasLoading || motosLoading) {
    return (
      <View
        className={`flex-1 items-center justify-center ${
          colorScheme === "light" ? "bg-white" : "bg-black"
        }`}
      >
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="mt-4 text-lg text-green-700">
          Carregando dados da API...
        </Text>
      </View>
    );
  }

  if (patiosError || vagasError || motosError) {
    const error = patiosError || vagasError || motosError;

    let errorMsg = "Erro ao carregar dados da API.";
    if (error instanceof AxiosError) {
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        errorMsg = error.message;
      }
    } else if (error?.message) {
      errorMsg = error.message;
    }

    console.log("Erro detalhado:", error);

    return (
      <View
        className={`flex-1 items-center justify-center ${
          colorScheme === "light" ? "bg-white" : "bg-black"
        }`}
      >
        <Text className="text-red-600 text-lg">{errorMsg}</Text>
        <Text className="text-gray-400 mt-2 text-xs">
          Veja detalhes no console.
        </Text>
      </View>
    );
  }

  return (
    <View
      className={`flex-1 ${colorScheme === "light" ? "bg-white" : "bg-black"}`}
    >
      <MenuBar onMenuPress={() => setMenuVisible(true)} title="Patios" />
      <Hamburger visible={menuVisible} onClose={() => setMenuVisible(false)} />
      <SearchHome value={search} onChangeText={setSearch} />
      <View className="px-2 mb-60">
        <FlatList
          data={filteredPatios}
          className={`mb-40 p-4 border-2 rounded-lg border-green-900 ${
            colorScheme === "light" ? "bg-gray-50" : "bg-gray-800"
          }`}
          keyExtractor={(item) =>
            item?.id_patio ? item.id_patio.toString() : Math.random().toString()
          }
          renderItem={({ item }) => {
            const info = getVagasInfo(item.id_patio);
            return (
              <TouchableOpacity
                className={`p-4 mb-2 mt-2 rounded-lg border-2 ${
                  colorScheme === "light"
                    ? "bg-gray-100 border-green-600"
                    : "bg-gray-800 border-green-400"
                }`}
                onPress={() =>
                  router.push({
                    pathname: "/Filial/[id_patio]",
                    params: {
                      id_patio: item.id || item.patioId,
                      nome: item.nome,
                    },
                  })
                }
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text
                      className={`text-2xl font-bold ${
                        colorScheme === "light"
                          ? "text-black"
                          : "text-green-500"
                      }`}
                    >
                      {item.nome}
                    </Text>
                    <Text
                      className={`${
                        colorScheme === "light"
                          ? "text-gray-600"
                          : "text-gray-200"
                      }`}
                    >
                      {item.endereco}
                    </Text>
                    <Text
                      className={`text-sm mt-1 text-gray-400 ${
                        colorScheme === "light"
                          ? "text-gray-800"
                          : "text-gray-100"
                      }`}
                    >
                      Vagas:{" "}
                      <Text
                        className={`font-bold ${
                          colorScheme === "light" ? "text-black" : "text-white"
                        }`}
                      >
                        {info.totalVagas}
                      </Text>{" "}
                      | Vagas Disponíveis:
                      <Text
                        className={`font-bold ${
                          colorScheme === "light" ? "text-black" : "text-white"
                        }`}
                      >
                        {" "}
                        {info.vagasDisponiveis}{" "}
                      </Text>
                    </Text>
                  </View>
                  <DeletePatioButton
                    patio={item}
                    onDelete={handleDeletePatio}
                    colorScheme={colorScheme}
                  />
                </View>
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={
            patiosData?.totalPages > 1 ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 16,
                }}
              >
                <TouchableOpacity
                  disabled={page === 0}
                  onPress={() => setPage(page - 1)}
                >
                  <Text>Anterior</Text>
                </TouchableOpacity>
                <Text>
                  Página {page + 1} de {patiosData.totalPages}
                </Text>
                <TouchableOpacity
                  disabled={page + 1 >= patiosData.totalPages}
                  onPress={() => setPage(page + 1)}
                >
                  <Text>Próxima</Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
        />
      </View>
      <AddPatioButton
        onAdd={handleAddPatio}
        colorScheme={colorScheme}
        patios={filteredPatios}
      />
    </View>
  );
}
