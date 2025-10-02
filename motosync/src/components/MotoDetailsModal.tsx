import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import motosMock from "../data/motosMock.json";
import patiosMock from "../data/patiosMock.json";
import { useColorScheme } from "../hooks/useColorScheme";

interface Moto {
  id?: string;
  id_moto: number;
  modelo: string;
  placa: string;
  patio?: string;
  vaga?: string;
  status?: string;
}

interface MotoDetailsModalProps {
  visible: boolean;
  moto: Moto | null;
  onClose: () => void;
  onSave: (moto: Moto) => void;
  motosExistentes: any[];
}

// Função para determinar status e cor
function getStatusInfo(patio: string, vaga: string, manutencao: boolean) {
  if (manutencao) {
    return { status: "Manutenção", color: "text-orange-400" };
  }
  if (!patio.trim() && !vaga.trim()) {
    return { status: "Alugada", color: "text-red-500" };
  }
  return { status: "Disponível", color: "text-green-500" };
}

const MODELOS_PERMITIDOS = ["POP", "SPORT", "E"];
const REGEX_PLACA = /^([A-Z]{3}[0-9][A-Z][0-9]{2}|[A-Z]{3}[0-9]{4})$/i;
const REGEX_VAGA = /^[A-Z][0-9]{2}$/i; // Exemplo: A01

// Função para checar se a vaga está ocupada por outra moto (no AsyncStorage ou mock)
async function checarVagaOcupada(
  patio: string,
  vaga: string,
  idAtual?: string
) {
  if (!patio.trim() || !vaga.trim()) return false;
  const stored = await AsyncStorage.getItem("motos");
  const motos = stored ? JSON.parse(stored) : [];
  let ocupada = motos.some(
    (m: any) =>
      m.patio?.trim().toLowerCase() === patio.trim().toLowerCase() &&
      m.vaga?.trim().toUpperCase() === vaga.trim().toUpperCase() &&
      String(m.id_moto) !== String(idAtual ?? "")
  );
  if (!ocupada) {
    ocupada = (motosMock as any[]).some(
      (m) =>
        m.patio?.trim().toLowerCase() === patio.trim().toLowerCase() &&
        m.vaga?.trim().toUpperCase() === vaga.trim().toUpperCase() &&
        String(m.id_moto) !== String(idAtual ?? "")
    );
  }
  return ocupada;
}

export const MotoDetailsModal: React.FC<MotoDetailsModalProps> = ({
  visible,
  moto,
  onClose,
  onSave,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [modelo, setModelo] = useState("");
  const [placa, setPlaca] = useState("");
  const [patio, setPatio] = useState("");
  const [vaga, setVaga] = useState("");
  const [manutencao, setManutencao] = useState(false);

  const [erroModelo, setErroModelo] = useState(false);
  const [erroPlaca, setErroPlaca] = useState(false);
  const [erroVaga, setErroVaga] = useState(false);
  const [erroPatio, setErroPatio] = useState(false);
  const [erroVagaOcupada, setErroVagaOcupada] = useState(false);

  const [patiosValidos, setPatiosValidos] = useState<string[]>([]);
  const [vagasValidas, setVagasValidas] = useState<string[]>([]);

  useEffect(() => {
    async function carregarPatios() {
      const stored = await AsyncStorage.getItem("patios");
      const patiosStorage = stored ? JSON.parse(stored) : [];
      const nomesMock = patiosMock.map((p: any) => p.nome.toUpperCase());
      const nomesStorage = patiosStorage.map((p: any) => p.nome.toUpperCase());
      // Junta e remove duplicados
      const todos = Array.from(new Set([...nomesMock, ...nomesStorage]));
      setPatiosValidos(todos);
    }
    carregarPatios();
  }, []);

  useEffect(() => {
    if (moto) {
      setModelo(moto.modelo);
      setPlaca(moto.placa);
      setPatio(moto.patio || "");
      setVaga(moto.vaga || "");
      setManutencao(moto.status === "Manutenção");
      setErroModelo(false);
      setErroPlaca(false);
      setErroVaga(false);
      setErroPatio(false);
      setErroVagaOcupada(false);
    }
  }, [moto]);

  useEffect(() => {
    async function carregarVagas() {
      if (!patio.trim()) {
        setVagasValidas([]);
        return;
      }
      // Carrega patios para encontrar o id do pátio pelo nome
      const storedPatios = await AsyncStorage.getItem("patios");
      const patiosStorage = storedPatios ? JSON.parse(storedPatios) : [];
      const patiosAll = [...patiosMock, ...patiosStorage];
      // Procura o id do pátio pelo nome (ignorando maiúsculas/minúsculas e acentos)
      const patioObj = patiosAll.find(
        (p: any) =>
          p.nome &&
          p.nome
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") ===
            patio
              .trim()
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
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

  // Atualiza status conforme campos
  const { status, color } = getStatusInfo(patio, vaga, manutencao);

  const handleSave = async () => {
    const modeloValido = MODELOS_PERMITIDOS.includes(
      modelo.trim().toUpperCase()
    );
    const placaValida = REGEX_PLACA.test(placa.trim().toUpperCase());
    const vagaValida =
      (vaga.trim() === "" && patio.trim() === "") ||
      (vaga.trim() !== "" &&
        patio.trim() !== "" &&
        REGEX_VAGA.test(vaga.trim().toUpperCase()));
    const patioValido =
      patio.trim() === "" || patiosValidos.includes(patio.trim().toUpperCase());
    const vagaValidaNoPatio =
      !vaga.trim() ||
      (vaga.trim() && vagasValidas.includes(vaga.trim().toUpperCase()));

    setErroVaga(!vagaValidaNoPatio);

    if (!vagaValidaNoPatio) return;

    // Checa vaga ocupada só ao salvar
    let vagaOcupada = false;
    if (patio && vaga) {
      vagaOcupada = await checarVagaOcupada(patio, vaga, String(moto?.id_moto));
    }
    setErroVagaOcupada(vagaOcupada);
    if (vagaOcupada) return;

    setErroModelo(!modeloValido);
    setErroPlaca(!placaValida);
    setErroVaga(!vagaValida);
    setErroPatio(!patioValido);
    setErroVaga(!vagaValidaNoPatio);

    // Não permite cadastrar vaga sem pátio
    if (
      !modeloValido ||
      !placaValida ||
      !vagaValida ||
      !patioValido ||
      (vaga.trim() && !patio.trim())
    )
      return;

    const updatedMoto = {
      ...moto!,
      modelo: modelo.trim().toUpperCase(),
      placa: placa.trim().toUpperCase(),
      patio: patio.trim() || undefined,
      vaga: vaga.trim().toUpperCase() || undefined,
      status,
    };

    // Carregue a lista mais atual do AsyncStorage
    const motosSalvas = await AsyncStorage.getItem("motos");
    let listaAtual = motosSalvas ? JSON.parse(motosSalvas) : [];

    // Substitua a moto correta pelo id_moto
    listaAtual = listaAtual.map((m: any) =>
      String(m.id_moto) === String(updatedMoto.id_moto) ? updatedMoto : m
    );

    await AsyncStorage.setItem("motos", JSON.stringify(listaAtual));

    // --- ATUALIZA O STATUS DAS VAGAS ---
    const storedPatios = await AsyncStorage.getItem("patios");
    const patiosStorage = storedPatios ? JSON.parse(storedPatios) : [];
    const patiosAll = [...patiosMock, ...patiosStorage];
    const patioObj = patiosAll.find(
      (p: any) =>
        p.nome &&
        p.nome
          .trim()
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") ===
          patio
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
    );
    if (patioObj) {
      const idPatio = patioObj.id_patio ?? patioObj.id;
      const storedVagas = await AsyncStorage.getItem("vagas");
      let vagasStorage = storedVagas ? JSON.parse(storedVagas) : [];

      // Marca a nova vaga como ocupada
      vagasStorage = vagasStorage.map((v: any) =>
        String(v.id_patio) === String(idPatio) &&
        v.codigo.toUpperCase() === vaga.trim().toUpperCase()
          ? { ...v, ocupada: true }
          : v
      );

      // Libera a vaga antiga, se mudou de vaga ou pátio
      if (
        moto?.vaga &&
        moto?.patio &&
        (moto.vaga !== vaga || moto.patio !== patio)
      ) {
        const patioAntigoObj = patiosAll.find(
          (p: any) =>
            p.nome &&
            p.nome
              .trim()
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "") ===
              moto.patio
                ?.trim()
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
        );
        if (patioAntigoObj) {
          const idPatioAntigo = patioAntigoObj.id_patio ?? patioAntigoObj.id;
          vagasStorage = vagasStorage.map((v: any) =>
            String(v.id_patio) === String(idPatioAntigo) &&
            v.codigo.toUpperCase() === moto.vaga?.trim().toUpperCase()
              ? { ...v, ocupada: false }
              : v
          );
        }
      }

      await AsyncStorage.setItem("vagas", JSON.stringify(vagasStorage));
    }
    // --- FIM ATUALIZAÇÃO VAGAS ---

    onSave(updatedMoto);
    onClose();
  };

  if (!moto) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-center items-center bg-black/60">
        <View
          className={`w-11/12 rounded-xl p-6 ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <Text
            className={`text-2xl font-bold mb-4 ${
              isDark ? "text-green-500" : "text-green-600"
            }`}
          >
            Editar Moto
          </Text>
          {/* Status dinâmico */}
          <Text className={`text-lg font-bold mb-2 ${color}`}>
            Status: {status}
          </Text>
          <TextInput
            className={`border-b-2 px-2 text-xl py-2 mb-1 ${
              isDark
                ? "border-green-600 text-gray-200 font-bold bg-gray-800"
                : "border-green-600 text-black bg-white"
            }`}
            placeholder="Modelo (POP, SPORT ou E)"
            placeholderTextColor={isDark ? "#aaa" : "#888"}
            value={modelo.toUpperCase()}
            onChangeText={(text) => {
              setModelo(text.replace(/[^a-zA-Z]/g, "").toUpperCase());
              setErroModelo(false);
            }}
            maxLength={5}
          />
          {erroModelo && (
            <Text className="text-red-500 text-xs mb-2">
              Modelo deve ser POP, SPORT ou E
            </Text>
          )}
          <TextInput
            className={`border-b-2 px-2 text-xl py-2 mb-1 ${
              isDark
                ? "border-green-600 text-gray-200 font-bold bg-gray-800"
                : "border-green-600 text-black bg-white"
            }`}
            placeholder="Placa (ex: ABC1D23 ou ABC1234)"
            placeholderTextColor={isDark ? "#aaa" : "#888"}
            value={placa.toUpperCase()}
            onChangeText={(text) => {
              setPlaca(text.toUpperCase());
              setErroPlaca(false);
            }}
            maxLength={7}
          />
          {erroPlaca && (
            <Text className="text-red-500 text-xs mb-2">Placa inválida</Text>
          )}
          <TextInput
            className={`border-b-2 px-2 text-xl py-2 mb-1 ${
              isDark
                ? "border-green-600 text-gray-200 font-bold bg-gray-800"
                : "border-green-600 text-black bg-white"
            }`}
            placeholder="Pátio (ex: Butantã)"
            placeholderTextColor={isDark ? "#aaa" : "#888"}
            value={patio}
            onChangeText={(text) => {
              setPatio(text);
              setErroPatio(false);
              // Não checa vaga ocupada ao digitar!
            }}
          />
          {erroPatio && (
            <Text className="text-red-500 text-xs mb-2">
              Informe um pátio existente
            </Text>
          )}
          <TextInput
            className={`border-b-2 px-2 text-xl py-2 mb-1 ${
              isDark
                ? "border-green-600 text-gray-200 font-bold bg-gray-800"
                : "border-green-600 text-black bg-white"
            }`}
            placeholder="Vaga (ex: A01)"
            placeholderTextColor={isDark ? "#aaa" : "#888"}
            value={vaga.toUpperCase()}
            onChangeText={(text) => {
              setVaga(text.toUpperCase());
              setErroVaga(false);
              // Não checa vaga ocupada ao digitar!
            }}
            maxLength={3}
          />
          {erroVaga && (
            <Text className="text-red-500 text-xs mb-2">Vaga inválida</Text>
          )}
          {!erroVaga &&
            vaga.trim() &&
            !vagasValidas.includes(vaga.trim().toUpperCase()) && (
              <Text className="text-red-500 text-xs mb-2">
                Vaga não cadastrada para este pátio.
              </Text>
            )}
          {erroVagaOcupada && (
            <Text className="text-red-500 text-xs mb-2">
              Já existe uma moto cadastrada nesta vaga e pátio.
            </Text>
          )}
          {vaga.trim() && !patio.trim() && (
            <Text className="text-red-500 text-xs mb-2">
              Não é possível cadastrar uma vaga sem informar o pátio.
            </Text>
          )}

          {/* Checkbox de manutenção aparece apenas se pátio e vaga estiverem preenchidos */}
          {patio.trim() && vaga.trim() && (
            <TouchableOpacity
              className="flex-row items-center mt-2 mb-4"
              onPress={() => setManutencao(!manutencao)}
              activeOpacity={0.7}
            >
              <View
                className={`w-6 h-6 mr-2 rounded border-2 ${
                  manutencao
                    ? "bg-orange-400 border-orange-400"
                    : "border-gray-400"
                } items-center justify-center`}
              >
                {manutencao && (
                  <Ionicons name="checkmark" size={18} color="#fff" />
                )}
              </View>
              <Text
                className={`text-lg ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Moto está para manutenção
              </Text>
            </TouchableOpacity>
          )}

          <View className="flex-row justify-between mt-2">
            <Pressable
              className={`px-5 py-3 rounded ${
                isDark ? "bg-neutral-700" : "bg-neutral-200"
              }`}
              onPress={onClose}
            >
              <Text
                className={`${
                  isDark ? "text-white" : "text-neutral-900"
                } text-xl font-semibold`}
              >
                Cancelar
              </Text>
            </Pressable>
            <Pressable
              className={`px-8 py-3 rounded ${
                isDark ? "bg-green-700" : "bg-blue-500"
              }`}
              onPress={handleSave}
            >
              <Text className="text-white text-xl font-semibold">Salvar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};
