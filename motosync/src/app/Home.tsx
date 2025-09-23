import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { SearchHome } from "../components/SearchHome";
import patiosData from "../data/patiosMock.json";
import vagasData from "../data/vagasMock.json";
import motosData from "../data/motosMock.json";
import { useColorScheme } from "../hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import Hamburger from "../components/Hamburger";
import { MenuBar } from "../components/MenuBar";
import { AddPatioButton } from "../components/AddPatioButton";
import { DeletePatioButton } from "../components/DeletePatioButton";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const [allPatios, setAllPatios] = useState<Patio[]>([]);
  const [filteredPatios, setFilteredPatios] = useState<Patio[]>([]);
  const [allVagas, setAllVagas] = useState<Vaga[]>([]);
  const [allMotos, setAllMotos] = useState<Moto[]>([]);
  const [patios, setPatios] = useState<{ nome: string; endereco: string }[]>([]);
  const colorScheme = useColorScheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  // Carrega patios, vagas e motos do AsyncStorage + mock
  const carregarDados = useCallback(async () => {
    // Patios
    const storedPatios = await AsyncStorage.getItem("patios");
    const patiosStorage = storedPatios ? JSON.parse(storedPatios) : [];
    const nomesStorage = patiosStorage.map((p: any) => p.nome.trim().toLowerCase());
    const patiosMockSemDuplicados = patiosData.filter(
      (p) => !nomesStorage.includes(p.nome.trim().toLowerCase())
    );
    const todosPatios = [...patiosMockSemDuplicados, ...patiosStorage];
    setAllPatios(todosPatios);
    setFilteredPatios(
      todosPatios.filter((patio) =>
        patio.nome.toLowerCase().includes(search.toLowerCase())
      )
    );

    // Vagas
    const storedVagas = await AsyncStorage.getItem("vagas");
    const vagasStorage = storedVagas ? JSON.parse(storedVagas) : [];
    const codigosStorage = vagasStorage.map((v: any) => v.codigo);
    const vagasMockSemDuplicadas = vagasData.filter(
      (v) => !codigosStorage.includes(v.codigo)
    );
    setAllVagas([...vagasMockSemDuplicadas, ...vagasStorage]);

    // Motos
    const storedMotos = await AsyncStorage.getItem("motos");
    const motosStorage = storedMotos ? JSON.parse(storedMotos) : [];
    setAllMotos([...motosData, ...motosStorage]);
  }, [search]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // Carregue os patios do AsyncStorage ao iniciar
  useEffect(() => {
    AsyncStorage.getItem('patios').then(data => {
      if (data) setPatios(JSON.parse(data));
    });
  }, []);

  // Atualiza dados sempre que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados])
  );

  // Atualiza patios filtrados ao pesquisar
  const handleSearch = (text: string) => {
    setSearch(text);
    setFilteredPatios(
      allPatios.filter((patio) =>
        patio.nome.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  // Atualiza patios e recarrega dados ao adicionar
  async function handleAddPatio(novoPatio: Omit<Patio, "id_patio">) {
    const stored = await AsyncStorage.getItem("patios");
    const patiosStorage = stored ? JSON.parse(stored) : [];
    // Gera id único considerando mock + storage
    const ids = [...patiosData, ...patiosStorage].map((p: any) => p.id_patio);
    let newId = 1;
    while (ids.includes(newId)) newId++;
    const patioComId = { ...novoPatio, id_patio: newId };
    const novosPatios = [...patiosStorage, patioComId];
    setPatios(novosPatios);
    await AsyncStorage.setItem("patios", JSON.stringify(novosPatios));
    await carregarDados();
  }

  // Atualiza patios ao deletar
  async function handleDeletePatio(nome: string) {
    const novosPatios = allPatios.filter(p => p.nome.trim().toLowerCase() !== nome.trim().toLowerCase());
    await AsyncStorage.setItem("patios", JSON.stringify(novosPatios));
    await carregarDados();
  }

  // Função para calcular info das vagas em tempo real
  function getVagasInfo(id_patio: number) {
    const vagas = allVagas.filter(v => v.id_patio === id_patio);
    const sessoes = [...new Set(vagas.map(v => v.codigo[0]))];
    const patioNome = allPatios.find(p => p.id_patio === id_patio)?.nome;
    const vagasDisponiveis = vagas.filter(vaga =>
      !allMotos.find(
        m =>
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

  return (
    <View className={`flex-1 ${colorScheme === "light" ? "bg-white" : "bg-black"}`}>
      <MenuBar onMenuPress={() => setMenuVisible(true)} title='Patios' />
      <Hamburger visible={menuVisible} onClose={() => setMenuVisible(false)} />
      <SearchHome value={search} onChangeText={handleSearch} />
      <View className="px-2 mb-60">
      <FlatList
        data={filteredPatios}
        className={`mb-40 p-4 border-2 rounded-lg border-green-900 ${colorScheme === "light" ? "bg-gray-50" : "bg-gray-800"}`} 
        keyExtractor={(item) => item.id_patio.toString()}
        renderItem={({ item }) => {
          const info = getVagasInfo(item.id_patio);
          return (
            <TouchableOpacity
              className={`p-4 mb-2 mt-2 rounded-lg border-2 ${colorScheme === "light" ? "bg-gray-100 border-green-600" : "bg-gray-800 border-green-400"}`}
              onPress={() => router.push({ pathname: "/Filial/[id_patio]", params: { id_patio: item.id_patio, nome: item.nome } })}
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className={`text-2xl font-bold ${colorScheme === "light" ? "text-black" : "text-green-500"}`}>
                    {item.nome}
                  </Text>
                  <Text className={`${colorScheme === "light" ? "text-gray-600" : "text-gray-200"}`}>
                    {item.endereco}
                  </Text>
                  <Text className={`text-sm mt-1 text-gray-400 ${colorScheme === "light" ? "text-gray-800" : "text-gray-100"}`}>
                    Vagas: <Text className={`font-bold ${colorScheme === "light" ? "text-black" : "text-white"}`}>{info.totalVagas}</Text> | Vagas Disponíveis:<Text className={`font-bold ${colorScheme === "light" ? "text-black" : "text-white"}`}> {info.vagasDisponiveis} </Text> 
                  </Text>
                </View>
                <Ionicons name="business" size={28} color={colorScheme === "light" ? "#22c55e" : "#4ade80"} />
              </View>
            </TouchableOpacity>
          );
        }}
      />
      </View>
      <AddPatioButton
        onAdd={handleAddPatio}
        colorScheme={colorScheme}
        patios={allPatios}
      />
      <DeletePatioButton
        patios={filteredPatios}
        onDelete={handleDeletePatio}
        colorScheme={colorScheme}
      />
    </View>
  );
}