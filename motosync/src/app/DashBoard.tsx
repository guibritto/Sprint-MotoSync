import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useColorScheme } from "../hooks/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Tipos
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

export default function DashBoard() {
  const colorScheme = useColorScheme();
  const [patios, setPatios] = useState<Patio[]>([]);
  const [patioSelecionado, setPatioSelecionado] = useState<number | null>(null);
  const [patio, setPatio] = useState<Patio | null>(null);
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [motos, setMotos] = useState<Moto[]>([]);
  const [motosNoPatio, setMotosNoPatio] = useState<Moto[]>([]);

  useEffect(() => {
    async function carregarPatios() {
      const patiosData = await AsyncStorage.getItem("patios");
      const patios = patiosData ? JSON.parse(patiosData) : [];
      setPatios(patios);
      if (patios.length > 0 && patioSelecionado === null) {
        setPatioSelecionado(patios[0].id_patio);
      }
    }
    carregarPatios();
  }, []);

  useEffect(() => {
    async function carregarDados() {
      if (!patioSelecionado) {
        setPatio(null);
        setVagas([]);
        setMotos([]);
        setMotosNoPatio([]);
        return;
      }
      // Carrega patio selecionado
      const patioAtual = patios.find(
        (p: Patio) => p.id_patio === patioSelecionado
      );
      setPatio(patioAtual);

      // Carrega vagas
      const vagasData = await AsyncStorage.getItem("vagas");
      const vagasAll = vagasData ? JSON.parse(vagasData) : [];
      const vagasPatio = vagasAll.filter(
        (v: Vaga) => v.id_patio === patioSelecionado
      );
      setVagas(vagasPatio);

      // Carrega motos
      const motosData = await AsyncStorage.getItem("motos");
      const motosAll = motosData ? JSON.parse(motosData) : [];
      setMotos(motosAll);

      // Motos no pátio
      const motosPatio = motosAll.filter(
        (m: Moto) => m.patio === patioAtual?.nome
      );
      setMotosNoPatio(motosPatio);
    }
    carregarDados();
  }, [patioSelecionado, patios]);

  // Legenda de status
  const legenda = [
    { cor: "bg-green-500", texto: "Disponível" }, // vaga vazia
    { cor: "bg-red-500", texto: "Ocupada" }, // vaga com moto
    { cor: "bg-orange-400", texto: "Manutenção" }, // moto em manutenção
  ];

  // Função para pegar status da vaga
  function getStatusVaga(codigo: string) {
    const moto = motosNoPatio.find((m) => m.vaga === codigo);
    if (!moto) return "Disponível";
    if (moto.status === "Manutenção") return "Manutenção";
    return "Ocupada";
  }

  function getCorStatus(status: string) {
    if (status === "Disponível") return "bg-green-500";
    if (status === "Ocupada") return "bg-red-500";
    if (status === "Manutenção") return "bg-orange-400";
    return "bg-gray-400";
  }

  return (
    <ScrollView
      className={`flex-1 ${colorScheme === "light" ? "bg-white" : "bg-black"}`}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* Seleção de pátio */}
      <Text className="text-lg font-bold mb-2 text-green-700 text-center">
        Selecione o Pátio
      </Text>
      <View
        className={`border rounded-lg mb-6 mx-8 ${
          colorScheme === "light" ? "border-green-700" : "border-green-400"
        }`}
      >
        <Picker
          selectedValue={patioSelecionado}
          onValueChange={(itemValue) => setPatioSelecionado(itemValue)}
          style={{ color: colorScheme === "light" ? "#000" : "#fff" }}
        >
          {patios.map((p) => (
            <Picker.Item key={p.id_patio} label={p.nome} value={p.id_patio} />
          ))}
        </Picker>
      </View>

      {/* Nome do pátio centralizado */}
      <Text className="text-3xl font-bold text-center mb-2 text-green-700">
        {patio?.nome || "Pátio"}
      </Text>
      <Text className="text-center mb-6 text-gray-500">{patio?.endereco}</Text>

      {/* Legenda */}
      <View className="flex-row justify-center mb-6">
        {legenda.map((item) => (
          <View key={item.texto} className="flex-row items-center mr-4">
            <View className={`w-5 h-5 rounded-full mr-2 ${item.cor}`} />
            <Text
              className={`text-sm ${
                colorScheme === "light" ? "text-black" : "text-white"
              }`}
            >
              {item.texto}
            </Text>
          </View>
        ))}
      </View>

      {/* Lista de motos no pátio */}
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2 text-green-700">
          Motos neste pátio:
        </Text>
        {motosNoPatio.length === 0 ? (
          <Text className="text-gray-400">
            Nenhuma moto cadastrada neste pátio.
          </Text>
        ) : (
          motosNoPatio.map((moto) => (
            <Text key={moto.id_moto} className="mb-1 text-base">
              {moto.placa} - {moto.modelo} ({moto.status})
            </Text>
          ))
        )}
      </View>

      {/* Layout das vagas */}
      <View className="flex-row flex-wrap justify-center">
        {vagas.map((vaga) => {
          const status = getStatusVaga(vaga.codigo);
          return (
            <View
              key={vaga.id_vaga}
              className={`w-20 h-20 m-2 rounded-lg justify-center items-center ${getCorStatus(
                status
              )}`}
            >
              <Text className="text-white font-bold">{vaga.codigo}</Text>
              <Text className="text-xs text-white">{status}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
