import { useLocalSearchParams } from "expo-router";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import vagasData from "../../data/vagasMock.json";
import motosData from "../../data/motosMock.json";
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
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [searchVaga, setSearchVaga] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<"todas" | "ocupada" | "disponivel">("todas");
  const [motos, setMotos] = useState<Moto[]>([]);

  const router = useRouter();

  // Carrega vagas do AsyncStorage + mock, sem duplicar códigos
 useEffect(() => {
  async function carregarVagas() {
    try {
      const stored = await AsyncStorage.getItem("vagas");
      let vagasStorage = stored ? JSON.parse(stored) : [];

      if (vagasStorage.length === 0) {
        // Primeiro acesso: salva todos os mocks
        await AsyncStorage.setItem("vagas", JSON.stringify(vagasData));
        vagasStorage = vagasData;
      }

      // Filtra apenas vagas do pátio atual
      const vagasFilialStorage = vagasStorage.filter(
        (vaga: any) => Number(vaga.id_patio) === Number(id_patio)
      );

      setVagas(vagasFilialStorage);
    } catch (err) {
      console.error("Erro ao carregar vagas:", err);
      setVagas([]);
    }
  }

  carregarVagas();
}, [id_patio]);


  useEffect(() => {
    async function carregarMotos() {
      const stored = await AsyncStorage.getItem("motos");
      const motosStorage = stored ? JSON.parse(stored) : [];
      setMotos([...motosData, ...motosStorage]);
    }
    carregarMotos();
  }, []);

  // Função para checar status da vaga
  function getVagaStatus(vagaCodigo: string) {
    const moto = motos.find(
      (m) =>
        m.vaga === vagaCodigo &&
        m.patio === nomeFilial &&
        (m.status === "Disponível" || m.status === "Manutenção")
    );
    return moto ? "ocupada" : "disponivel";
  }

  // Função para adicionar nova vaga na filial
  function handleAddVaga(novaVaga: any) {
    if (novaVaga.id_patio == id_patio || !novaVaga.id_patio) {
      setVagas((prev) => [...prev, novaVaga]);
    }
  }

  // Função para deletar vaga (remove do AsyncStorage e do estado local)
  async function handleDeleteVaga(id_vaga: number) {
    const stored = await AsyncStorage.getItem("vagas");
    const vagasStorage = stored ? JSON.parse(stored) : [];
    const novasVagas = vagasStorage.filter((v: any) => v.id_vaga !== id_vaga);
    await AsyncStorage.setItem("vagas", JSON.stringify(novasVagas));
    setVagas((prev) => prev.filter((v) => v.id_vaga !== id_vaga));
    setModalVisible(false);
    setSelectedVaga(null);
    setSelectedMoto(null);
  }

  const vagasFiltradas = vagas
    .filter((vaga) => {
      const codigoMatch = vaga.codigo.toUpperCase().includes(searchVaga.toUpperCase());
      const status = getVagaStatus(vaga.codigo);
      const statusMatch = statusFiltro === "todas" || status === statusFiltro;
      return codigoMatch && statusMatch;
    })
    .sort((a, b) => {
      // Extrai letra e número
      const [letraA, ...numA] = a.codigo.toUpperCase();
      const [letraB, ...numB] = b.codigo.toUpperCase();
      if (letraA < letraB) return -1;
      if (letraA > letraB) return 1;
      // Se letras iguais, compara número (com zero à esquerda)
      return parseInt(numA.join("").padStart(2, "0")) - parseInt(numB.join("").padStart(2, "0"));
    });

  return (
    <View className={`flex-1 ${colorScheme === "light" ? "bg-white" : "bg-black"}`}>
      <MenuBar onMenuPress={() => setMenuVisible(true)} title={nomeFilial} />
      <Hamburger visible={menuVisible} onClose={() => setMenuVisible(false)} />
      <TouchableOpacity
        onPress={() => router.back()}
        className="flex-row items-center mt-4 mb-3"
      >
        <Ionicons name="arrow-back" size={28} color={colorScheme === "light" ? "#222" : "#58cc3b"} />
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
        className={`mb-40 border-2 rounded-lg border-green-400 ${colorScheme === "light" ? "bg-gray-100" : "bg-gray-900"}`}
        data={vagasFiltradas}
        keyExtractor={(item) => item.id_vaga.toString()}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 8 }}
        ListEmptyComponent={
          <Text className="text-center text-gray-400 mt-8">Nenhuma vaga nesta filial.</Text>
        }
        renderItem={({ item }) => {
          const status = getVagaStatus(item.codigo);
          let borderColor = status === "ocupada" ? "border-red-500" : "border-green-500";
          let textColor = status === "ocupada"
            ? "text-red-500"
            : colorScheme === "light"
              ? "text-green-700"
              : "text-green-400";
          let statusLabel = status === "ocupada" ? "Ocupada" : "Disponível";

          return (
            <TouchableOpacity
              className="flex-1 mt-1 mb-1 items-center"
              onPress={() => {
                const moto = motos.find(
                  (m) => m.vaga === item.codigo && m.patio === nomeFilial
                );
                setSelectedVaga(item);
                setSelectedMoto(moto ?? null);
                setModalVisible(true);
              }}
            >
              <View className={`w-48 h-32 m-2 justify-center items-center rounded-lg border-2 ${borderColor} ${colorScheme === "light" ? "bg-white" : "bg-gray-800"}`}>
                <Text className={`text-3xl font-extrabold ${textColor}`}>
                  Vaga: {item.codigo}
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
      <AddVagaButton onAdd={handleAddVaga} colorScheme={colorScheme} id_patio={Number(id_patio)} />
    </View>
  );
}