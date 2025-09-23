import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import motosMock from "../data/motosMock.json";
import patiosMock from "../data/patiosMock.json";

type AddMotoButtonProps = {
  onAdd: (moto: any) => void;
  colorScheme: "light" | "dark";
};

const modelosValidos = ["pop", "sport", "e"];

function validarPlaca(placa: string) {
  const regexAntiga = /^[A-Z]{3}[0-9]{4}$/;
  const regexNova = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
  return regexAntiga.test(placa) || regexNova.test(placa);
}

// Função para normalizar strings (remove acentos e deixa minúsculo)
function normalizeString(str: string) {
  return str
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function AddMotoButton({ onAdd, colorScheme }: AddMotoButtonProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modelo, setModelo] = useState("");
  const [placa, setPlaca] = useState("");
  const [patio, setPatio] = useState("");
  const [vaga, setVaga] = useState("");
  const [manutencao, setManutencao] = useState(false);
  const [placaInvalida, setPlacaInvalida] = useState(false);
  const [placaDuplicada, setPlacaDuplicada] = useState(false);
  const [modeloInvalido, setModeloInvalido] = useState(false);
  const [patioInvalido, setPatioInvalido] = useState(false);
  const [vagaOcupada, setVagaOcupada] = useState(false);
  const [vagaInexistente, setVagaInexistente] = useState(false);
  const [patiosValidos, setPatiosValidos] = useState<string[]>([]);
  const [patioRepetido, setPatioRepetido] = useState(false);
  const [vagasValidas, setVagasValidas] = useState<string[]>([]);

  // Carrega nomes de pátios válidos (mock + storage)
  useEffect(() => {
    async function carregarPatios() {
      const stored = await AsyncStorage.getItem("patios");
      const patiosStorage = stored ? JSON.parse(stored) : [];
      const nomesMock = patiosMock.map((p: any) => p.nome.toUpperCase());
      const nomesStorage = patiosStorage.map((p: any) => p.nome.toUpperCase());
      const todos = Array.from(new Set([...nomesMock, ...nomesStorage]));
      setPatiosValidos(todos);
    }
    carregarPatios();
  }, []);

  // Carrega vagas válidas do pátio selecionado (buscando pelo id_patio)
  useEffect(() => {
    async function carregarVagas() {
      if (!patio.trim()) {
        setVagasValidas([]);
        return;
      }
      // Carrega todos os pátios para buscar o id pelo nome
      const storedPatios = await AsyncStorage.getItem("patios");
      const patiosStorage = storedPatios ? JSON.parse(storedPatios) : [];
      const patiosAll = [...patiosMock, ...patiosStorage];
      // Busca o id do pátio pelo nome (ignorando acentos e caixa)
      const patioObj = patiosAll.find(
        (p: any) =>
          p.nome &&
          normalizeString(p.nome) === normalizeString(patio)
      );
      if (!patioObj) {
        setVagasValidas([]);
        return;
      }
      const idPatio = patioObj.id_patio ?? patioObj.id;

      // Carrega vagas e filtra pelo id_patio
      const storedVagas = await AsyncStorage.getItem("vagas");
      const vagasStorage = storedVagas ? JSON.parse(storedVagas) : [];
      const vagasMockData = require("../data/vagasMock.json");
      const todasVagas = [...vagasStorage, ...vagasMockData];
      const vagasDoPatio = todasVagas
        .filter((v: any) => String(v.id_patio) === String(idPatio))
        .map((v: any) => v.codigo.toUpperCase());
      setVagasValidas(vagasDoPatio);
    }
    carregarVagas();
  }, [patio]);

  const campos = [
    { label: "Modelo", value: modelo, setValue: setModelo, placeholder: "Modelo", border: "border-green-400" },
    { label: "Placa", value: placa, setValue: (text: string) => setPlaca(text.toUpperCase()), placeholder: "Placa", border: "border-green-400" },
    { label: "Pátio", value: patio, setValue: setPatio, placeholder: "Pátio", border: "border-green-400" },
    { label: "Vaga", value: vaga, setValue: (text: string) => setVaga(text.toUpperCase()), placeholder: "Vaga", border: "border-green-400" },
  ];

  async function handleAdd() {
    const modeloValido = modelosValidos.includes(modelo.trim().toLowerCase());
    const patioValido = patio.trim() === "" || patiosValidos.includes(patio.trim().toUpperCase());
    const placaValida = validarPlaca(placa.trim().toUpperCase());

    setModeloInvalido(!modeloValido && modelo.length > 0);
    setPatioInvalido(patio.length > 0 && !patioValido);
    setPlacaInvalida(!placaValida && placa.length > 0);
    setPlacaDuplicada(false);
    setVagaInexistente(false);

    setPatioRepetido(false);
    if (patio.length > 0) {
      const repetido = patiosValidos.filter((p) => p.trim().toLowerCase() === patio.trim().toLowerCase()).length > 1;
      setPatioRepetido(repetido);
      if (repetido) return;
    }

    if (!modeloValido || !placaValida || (patio.length > 0 && !patioValido)) return;

    // Checa se a vaga existe no pátio selecionado (agora usando id_patio)
    if (patio && vaga) {
      const vagaExiste = vagasValidas.includes(vaga.trim().toUpperCase());
      setVagaInexistente(!vagaExiste);
      if (!vagaExiste) return;
    } else {
      setVagaInexistente(false);
    }

    // Checa se já existe uma moto cadastrada na mesma vaga e pátio (AsyncStorage)
    let vagaJaOcupada = false;
    if (patio && vaga) {
      const stored = await AsyncStorage.getItem("motos");
      const motos = stored ? JSON.parse(stored) : [];
      vagaJaOcupada = motos.some(
        (m: any) =>
          normalizeString(m.patio ?? "") === normalizeString(patio) &&
          (m.vaga ?? "").trim().toUpperCase() === vaga.trim().toUpperCase()
      );

      // Checa também no mock
      if (!vagaJaOcupada) {
        vagaJaOcupada = (motosMock as any[]).some(
          (m) =>
            normalizeString(m.patio ?? "") === normalizeString(patio) &&
            (m.vaga ?? "").trim().toUpperCase() === vaga.trim().toUpperCase()
        );
      }
      setVagaOcupada(vagaJaOcupada);
      if (vagaJaOcupada) return;
    } else {
      setVagaOcupada(false);
    }

    // Checa se já existe uma moto com a mesma placa (AsyncStorage + mock)
    const stored = await AsyncStorage.getItem("motos");
    const motos = stored ? JSON.parse(stored) : [];
    const placaJaExiste =
      motos.some((m: any) => m.placa.trim().toUpperCase() === placa.trim().toUpperCase()) ||
      (motosMock as any[]).some((m) => m.placa.trim().toUpperCase() === placa.trim().toUpperCase());

    if (placaJaExiste) {
      setPlacaInvalida(false);
      setPlacaDuplicada(true);
      return;
    }

    // Cadastro da moto
    let statusMoto = "Alugada";
    if (patio && vaga) {
      statusMoto = manutencao ? "Manutenção" : "Disponível";
    }

    // Buscar o maior id_moto já existente (AsyncStorage + mock)
    const allMotos = [...motos, ...motosMock];
    const maxId = allMotos.length > 0 ? Math.max(...allMotos.map((m: any) => Number(m.id_moto) || 0)) : 0;
    const nextId = maxId + 1;

    const novaMoto = {
      id_moto: nextId,
      modelo: modelo.toUpperCase(),
      placa,
      patio,
      vaga,
      status: statusMoto,
    };
    motos.push(novaMoto);
    await AsyncStorage.setItem("motos", JSON.stringify(motos));

    // --- ATUALIZA O STATUS DA VAGA PARA OCUPADA ---
    // Busca o id do pátio
    const storedPatios = await AsyncStorage.getItem("patios");
    const patiosStorage = storedPatios ? JSON.parse(storedPatios) : [];
    const patiosAll = [...patiosMock, ...patiosStorage];
    const patioObj = patiosAll.find(
      (p: any) =>
        p.nome &&
        normalizeString(p.nome) === normalizeString(patio)
    );
    if (patioObj) {
      const idPatio = patioObj.id_patio ?? patioObj.id;
      // Busca vagas
      const storedVagas = await AsyncStorage.getItem("vagas");
      let vagasStorage = storedVagas ? JSON.parse(storedVagas) : [];
      // Marca a vaga como ocupada
      vagasStorage = vagasStorage.map((v: any) =>
        String(v.id_patio) === String(idPatio) && v.codigo.toUpperCase() === vaga.trim().toUpperCase()
          ? { ...v, ocupada: true }
          : v
      );
      await AsyncStorage.setItem("vagas", JSON.stringify(vagasStorage));
    }
    // --- FIM ATUALIZAÇÃO VAGA ---

    onAdd(novaMoto);
    setModalVisible(false);
    setModelo("");
    setPlaca("");
    setPatio("");
    setVaga("");
    setManutencao(false);
    setModeloInvalido(false);
    setPatioInvalido(false);
    setVagaOcupada(false);
    setPatioRepetido(false);
    setPlacaDuplicada(false);
    setVagaInexistente(false);
  }

  return (
    <>
      <TouchableOpacity
        className="absolute bottom-2 w-full bg-green-500 rounded-full p-4 mb-10 flex-row justify-center items-center"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white text-xl font-bold">Adicionar Moto</Text>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className={`w-96 p-6 rounded-xl ${colorScheme === "light" ? "bg-white" : "bg-gray-800"}`}>
            <Text className="text-2xl font-bold mb-4 text-green-600">Nova Moto</Text>
            {campos.map((campo, idx) => (
              <View key={campo.label} style={{ marginBottom: 8 }}>
                <TextInput
                  className={`border-b border-green-400 mb-1 p-2 font-bold text-2xl ${colorScheme === "light" ? "text-gray-800" : "text-gray-200"}`}
                  placeholder={campo.placeholder}
                  placeholderTextColor="#999"
                  value={campo.label === "Modelo" ? campo.value.toUpperCase() : campo.value}
                  onChangeText={text => {
                    if (campo.label === "Modelo") {
                      campo.setValue(text.toUpperCase());
                      setModeloInvalido(false);
                    } else {
                      campo.setValue(text);
                    }
                    if (campo.label === "Pátio") {
                      setPatioInvalido(false);
                      setPatioRepetido(false);
                    }
                    if (campo.label === "Vaga") {
                      setVagaOcupada(false);
                      setVagaInexistente(false);
                    }
                    if (campo.label === "Placa") {
                      setPlacaInvalida(false);
                      setPlacaDuplicada(false);
                    }
                  }}
                  autoCapitalize={campo.label === "Placa" ? "characters" : "sentences"}
                />
                {campo.label === "Modelo" && modeloInvalido && (
                  <Text className="text-red-500 text-xs mt-1">Coloque um modelo válido: POP, SPORT ou E</Text>
                )}
                {campo.label === "Pátio" && patioInvalido && (
                  <Text className="text-red-500 text-xs mt-1">Coloque um pátio válido</Text>
                )}
                {campo.label === "Pátio" && patioRepetido && (
                  <Text className="text-red-500 text-xs mt-1">Já existe uma filial com esse nome.</Text>
                )}
                {campo.label === "Placa" && placaInvalida && (
                  <Text className="text-red-500 text-xs mt-1">
                    Coloque uma placa válida
                  </Text>
                )}
                {campo.label === "Placa" && placaDuplicada && (
                  <Text className="text-red-500 text-xs mt-1">
                    Essa placa ja existe
                  </Text>
                )}
                {campo.label === "Vaga" && vagaInexistente && (
                  <Text className="text-red-500 text-xs mt-1">
                    Esta vaga não existe neste pátio.
                  </Text>
                )}
                {campo.label === "Vaga" && vagaOcupada && (
                  <Text className="text-red-500 text-xs mt-1">
                    Já existe uma moto cadastrada nesta vaga neste pátio.
                  </Text>
                )}
              </View>
            ))}
            {(patio && vaga) && (
              <TouchableOpacity
                className="flex-row items-center mt-2 mb-4"
                onPress={() => setManutencao(!manutencao)}
                activeOpacity={0.7}
              >
                <View className={`w-6 h-6 mr-2 rounded border-2 ${manutencao ? "bg-green-600 border-green-600" : "border-gray-400"} items-center justify-center`}>
                  {manutencao && <Ionicons name="checkmark" size={18} color="#fff" />}
                </View>
                <Text className={`text-lg ${colorScheme === "light" ? "text-gray-800" : "text-gray-200"}`}>Moto está para manutenção</Text>
              </TouchableOpacity>
            )}
            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                className="bg-gray-300 rounded-xl px-4 py-2"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-black px-2 py-2 text-lg font-bold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-green-600 rounded-xl px-4 py-2"
                onPress={handleAdd}
              >
                <Text className="text-white px-12 py-2 text-xl font-bold">Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}