import React from 'react';
import { View, Text, ScrollView, Image, Linking, TouchableOpacity } from 'react-native';
import { useColorScheme } from '../hooks/useColorScheme';// Detecta tema claro/escuro
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Lista de participantes com nome, RM, GitHub e LinkedIn
const participantes = [
  {
    nome: "Guilherme Britto",
    rm : "RM558475",
    github: "https://github.com/guibritto",
    linkedin: "https://www.linkedin.com/in/guilherme-britto-baa450312/"
  },
  {
    nome: "Thiago Mendes",
    rm : "RM555352",
    github: "https://github.com/Offiline26",
    linkedin: "https://www.linkedin.com/in/thiagomendesdev"
  },
  {
    nome: "Vinicius Banciela",
    rm : "RM558117",
    github: "https://github.com/vinibanciela",
    linkedin: ""
  }
];

export default function Participantes() {

    const colorScheme = useColorScheme();
    const router = useRouter();

  return (
    <ScrollView contentContainerStyle={{ padding: 24 }} className={colorScheme === "light" ? "bg-white" : "bg-black"}>
      {/* Botão de voltar para a tela anterior */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="flex-row items-center mt-10"
      >
        <Ionicons name="arrow-back" size={28} color={colorScheme === "light" ? "#222" : "#3cb32c"} />
        <Text className={`ml-2 text-lg font-bold ${colorScheme === "light" ? "text-black" : "text-green-500"}`}>Voltar</Text>
      </TouchableOpacity>
      {/* Renderiza cada participante */}
      {participantes.map((p, idx) => (
        <View
          key={idx}
          className={`items-center mt-24 mb-12 rounded-2xl p-4 ${{ light: "bg-white", dark: "bg-black" }[colorScheme]}`}
        >
          {/* GIF decorativo para o primeiro participante */}
            {idx === 0 && (
            <Image
              source={require('../../assets/images/Y3iq.gif')}
              className="w-24 h-24 mb-[-32px] z-10"
              style={{ position: 'absolute', top: -35, left: 125 }}
            />
          )}
          {/* Foto do participante */}
          <Image
            source={
              idx === 0
                ? require('../../assets/images/gui.jpg')
                : idx === 1
                ? require('../../assets/images/thiago.jpg')
                : require('../../assets/images/vini.jpg')
            }
            className="w-48 h-48 rounded-full mb-3 border-4 border-green-500"
          />
          {/* Nome e RM do participante */}
          <Text className={`text-2xl font-bold ${colorScheme === "light" ? "text-black" : "text-white"}`}>{p.nome}</Text>
          <Text className={`text-lg mb-4 font-bold ${colorScheme === "light" ? "text-black" : "text-white"}`}>{p.rm}</Text>
          {/* Links para GitHub e LinkedIn */}
          <View className="flex-row justify-around w-40">
          <TouchableOpacity onPress={() => Linking.openURL(p.github)}>
            <Text className="text-green-600 mb-1 text-xl font-bold">GitHub</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(p.linkedin)}>
            <Text className="text-green-800 font-bold text-xl">LinkedIn</Text>
          </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}