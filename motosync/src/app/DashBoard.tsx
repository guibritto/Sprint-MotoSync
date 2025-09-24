import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useColorScheme } from "../hooks/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InfoMotoDashBoard from "../components/InfoMotoDashBoard"; // certifique-se do caminho correto
import { MenuBar } from "../components/MenuBar";
import Hamburger from "../components/Hamburger";

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
  const [modalVisible, setModalVisible] = useState(false);
  const [vagaSelecionada, setVagaSelecionada] = useState<Vaga | null>(null);
  const [motoDaVaga, setMotoDaVaga] = useState<Moto | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

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
      const patioAtual =
        patios.find((p: Patio) => p.id_patio === patioSelecionado) || null;
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
    { cor: "bg-orange-400", texto: "Moto em Manutenção" }, // moto em manutenção
  ];

  // Função para pegar status da vaga
  function getStatusVaga(codigo: string) {
    const moto = motosNoPatio.find((m) => m.vaga === codigo);
    if (!moto) return "Disponível";
    if (moto.status === "Manutenção") return "Manutenção";
    return "Ocupada";
  }

  // Função para definir cor da borda e texto conforme status
  function getBordaETextoStatus(status: string) {
    if (status === "Disponível")
      return { border: "border-green-600", text: "text-green-600" };
    if (status === "Ocupada")
      return { border: "border-red-600", text: "text-red-600" };
    if (status === "Manutenção")
      return { border: "border-orange-400", text: "text-orange-400" };
    return { border: "border-gray-400", text: "text-gray-400" };
  }

  // Agrupa as vagas por letra inicial do código
  function agruparVagasPorLetra(vagas: Vaga[]) {
    const grupos: { [letra: string]: Vaga[] } = {};
    vagas.forEach((vaga) => {
      const letra = vaga.codigo.charAt(0).toUpperCase();
      if (!grupos[letra]) grupos[letra] = [];
      grupos[letra].push(vaga);
    });
    return grupos;
  }
  const gruposVagas = agruparVagasPorLetra(vagas);
  const letrasOrdenadas = Object.keys(gruposVagas).sort();

  // Função para abrir modal ao clicar na vaga
  function handleVagaPress(vaga: Vaga) {
    setVagaSelecionada(vaga);
    const moto = motosNoPatio.find((m) => m.vaga === vaga.codigo) || null;
    setMotoDaVaga(moto);
    setModalVisible(true);
  }

  return (
    <>
      <MenuBar onMenuPress={() => setMenuVisible(true)} title="DashBoard" />
      <Hamburger visible={menuVisible} onClose={() => setMenuVisible(false)} />
      <ScrollView
        className={`flex-1 ${
          colorScheme === "light" ? "bg-white" : "bg-black"
        }`}
        contentContainerStyle={{ padding: 20 }}
      >
        <Text className="text-lg font-bold text-green-700 text-center">
          Selecione o Pátio
        </Text>
        <View
          className={`border rounded-lg mb-6 mx-8 ${
            colorScheme === "light" ? "border-green-700" : "border-green-400"
          }`}
        >
          <Picker
            selectedValue={patioSelecionado}
            onValueChange={(itemValue) =>
              setPatioSelecionado(Number(itemValue))
            }
            style={{ color: colorScheme === "light" ? "#000" : "#fff" }}
          >
            {patios.map((p) => (
              <Picker.Item key={p.id_patio} label={p.nome} value={p.id_patio} />
            ))}
          </Picker>
        </View>

        <Text className="text-3xl font-bold text-center mt-2 text-green-700">
          {patio?.nome || "Pátio"}
        </Text>
        <Text className="text-center mb-6 text-gray-500">
          {patio?.endereco}
        </Text>

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
        <View
          className={`border-2 rounded-xl border-green-400 mb-4 p-4 ml-5 mr-5 ${
            colorScheme === "light" ? "bg-white" : "bg-gray-800"
          }`}
        >
          {/* Aviso se não houver motos nesse pátio */}
          {motosNoPatio.length === 0 && (
            <Text className="text-center text-gray-300 font-bold text-lg">
              Não possui moto nesse pátio.
            </Text>
          )}
          <View className="items-center">
            {letrasOrdenadas.map((letra) => (
              <View key={letra} className="mb-4 w-full">
                <Text className="text-center font-bold text-lg mb-1 text-green-700">
                  {letra}
                </Text>
                <View className="flex-row justify-center">
                  {gruposVagas[letra].map((vaga) => {
                    const status = getStatusVaga(vaga.codigo);
                    const { border, text } = getBordaETextoStatus(status);
                    return (
                      <TouchableOpacity
                        key={vaga.id_vaga}
                        onPress={() => handleVagaPress(vaga)}
                        activeOpacity={0.7}
                      >
                        <View
                          className={`w-20 h-20 mx-2 mb-2 rounded-lg justify-center items-center border-2 ${border} ${
                            colorScheme === "light" ? "bg-white" : "bg-gray-800"
                          }`}
                        >
                          <Text className={`font-bold text-2xl ${text}`}>
                            {vaga.codigo}
                          </Text>
                          <Text className={`text-xs mt-1 ${text}`}>
                            {status}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        </View>
        <InfoMotoDashBoard
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          vaga={vagaSelecionada}
          moto={motoDaVaga}
          nomePatio={patio?.nome || ""}
          colorScheme={colorScheme}
        />
      </ScrollView>
    </>
  );
}
