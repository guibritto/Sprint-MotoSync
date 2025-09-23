import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, useColorScheme as useNativeColorScheme, View } from 'react-native';
import { AddMotoButton } from "../components/AddMotoButton";
import { DeleteMotoModal } from "../components/DeleteMotoModal";
import Hamburger from '../components/Hamburger';
import { MenuBar } from '../components/MenuBar';
import { MotoDetailsModal } from "../components/MotoDetailsModal";
import { MotoInfoModal } from "../components/MotoInfoModal";
import { SearchBarMoto } from "../components/SearchBarMoto";
import motosMock from '../data/motosMock.json';

// Definição do tipo Moto
export type Moto = {
  id_moto: number;
  modelo: string;
  placa: string;
  patio?: string;
  vaga?: string;
  status?: string;
};

function getBorderColor(status: string) {
  if (status === "Disponível") return "border-green-500";
  if (status === "Alugada") return "border-red-500";
  if (status === "Manutenção") return "border-orange-400";
  return "border-gray-300";
}

function getFlatListBorderClass(status: string | null) {
  if (status === "Disponível") return "border-green-500";
  if (status === "Alugada") return "border-red-500";
  if (status === "Manutenção") return "border-orange-400";
  return "border-green-500"; // padrão
}

export default function Motos() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [motos, setMotos] = useState<Moto[]>([]);
  const [selectedMoto, setSelectedMoto] = useState<Moto | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ visible: boolean; moto: Moto | null }>({ visible: false, moto: null });
  // Corrige o colorScheme para aceitar apenas "light" ou "dark"
  const colorScheme = (useNativeColorScheme() === "dark" ? "dark" : "light") as "light" | "dark";
  const [search, setSearch] = useState("");
  const [modalVisivel, setModalVisivel] = useState(false);
  const [motoSelecionada, setMotoSelecionada] = useState<Moto | null>(null);
  const [statusFiltro, setStatusFiltro] = useState<string | null>(null);

  const handleEditarMoto = (moto: Moto) => {
    setMotoSelecionada(moto);
    setModalVisivel(true);
  };

  const handleSalvarEdicao = (motoEditada: Moto) => {
    const updatedMoto = {
      ...motoEditada,
      id_moto: Number(motoEditada.id_moto), // Garante que é number
      modelo: motoEditada.modelo.trim().toUpperCase(),
      placa: motoEditada.placa.trim().toUpperCase(),
      patio: motoEditada.patio?.trim() || undefined,
      vaga: motoEditada.vaga?.trim().toUpperCase() || undefined,
      status: motoEditada.status,
    };

    setMotos(prevMotos =>
      prevMotos.map(m =>
        m.id_moto === updatedMoto.id_moto ? { ...m, ...updatedMoto } : m
      )
    );
    setMotoSelecionada(null);
    setModalVisivel(false);
  };

  // Carrega motos do AsyncStorage + mock, sem duplicar placa
  useEffect(() => {
    async function carregarMotos() {
      const stored = await AsyncStorage.getItem("motos");
      let motosStorage: Moto[] = stored ? JSON.parse(stored) : [];
      if (!stored || motosStorage.length === 0) {
        // Se não houver nada salvo, usa o mock e salva no AsyncStorage
        await AsyncStorage.setItem("motos", JSON.stringify(motosMock));
        setMotos(motosMock as Moto[]);
      } else {
        setMotos(motosStorage);
      }
    }
    carregarMotos();
  }, []);

  // Filtro por placa e modelo, com filtro de status
  const motosFiltradas = motos.filter(m =>
    (
      m.placa.toUpperCase().includes(search.trim().toUpperCase()) ||
      m.modelo.toUpperCase().includes(search.trim().toUpperCase())
    ) &&
    (statusFiltro ? m.status === statusFiltro : true)
  );

  function handleDeleteMoto(id_moto: number) {
    setMotos(motos.filter(m => m.id_moto !== id_moto));
    setDeleteModal({ visible: false, moto: null });
    if (selectedMoto && selectedMoto.id_moto === id_moto) setSelectedMoto(null);
    // Remove do AsyncStorage também
    AsyncStorage.getItem("motos").then(stored => {
      const motosStorage: Moto[] = stored ? JSON.parse(stored) : [];
      const novasMotos = motosStorage.filter((m: Moto) => m.id_moto !== id_moto);
      AsyncStorage.setItem("motos", JSON.stringify(novasMotos));
    });
  }

  return (
    <View className={`flex-1 ${colorScheme === "light" ? "bg-white" : "bg-black"}`}>
      <MenuBar onMenuPress={() => setMenuVisible(true)} title='Motos' />
      <Hamburger visible={menuVisible} onClose={() => setMenuVisible(false)} />
      <SearchBarMoto
        value={search}
        onChangeText={setSearch}
        statusFiltro={statusFiltro}
        onStatusChange={setStatusFiltro}
      />
      <View className='px-2 mb-64'>
      <FlatList
        data={motosFiltradas}
        className={`p-4 mb-40 rounded-lg border-2 ${getFlatListBorderClass(statusFiltro)} ${colorScheme === "light" ? "bg-white" : "bg-gray-800"}`}
        keyExtractor={item => item.id_moto.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            className={`p-4 mb-3 rounded-lg border-2 ${colorScheme === "light" ? "bg-white" : "bg-gray-800"} ${getBorderColor(item.status ?? "")}`}
            onPress={() => setSelectedMoto(item)}
          >
            <View className="flex-row justify-between items-center">
              <View>
                <Text className={`text-2xl font-bold ${colorScheme === "light" ? "text-black" : "text-green-500"}`}>ID: {item.id_moto}</Text>
                <Text className={`${colorScheme === "light" ? "text-gray-600" : "text-gray-200"}`}>Placa: {item.placa}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setDeleteModal({ visible: true, moto: item })}
                className="p-2"
              >
                <Ionicons name="trash" size={28} color="#dc2626" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
      </View>
      <MotoDetailsModal
        visible={modalVisivel}
        moto={motoSelecionada}
        onClose={() => setModalVisivel(false)}
        onSave={handleSalvarEdicao}
        motosExistentes={motos}
      />
      <MotoInfoModal
        visible={!!selectedMoto}
        selectedMoto={selectedMoto}
        colorScheme={colorScheme}
        onClose={() => setSelectedMoto(null)}
        onEdit={handleEditarMoto}
      />
      <DeleteMotoModal
        visible={deleteModal.visible}
        moto={deleteModal.moto}
        colorScheme={colorScheme}
        onCancel={() => setDeleteModal({ visible: false, moto: null })}
        onConfirm={handleDeleteMoto}
      />
      <AddMotoButton
        onAdd={(novaMoto: Moto) => {
          const updatedMoto = {
            ...novaMoto,
            id_moto: Number(novaMoto.id_moto), // Garante que é number
            modelo: novaMoto.modelo.trim().toUpperCase(),
            placa: novaMoto.placa.trim().toUpperCase(),
            patio: novaMoto.patio?.trim() || undefined,
            vaga: novaMoto.vaga?.trim().toUpperCase() || undefined,
            status: novaMoto.status,
          };
          setMotos((prev) => [...prev, updatedMoto]);
        }}
        colorScheme={colorScheme}
      />
    </View>
  );
}