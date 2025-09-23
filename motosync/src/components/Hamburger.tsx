import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Pressable,
  Animated,
} from "react-native";
import { useColorScheme } from "../hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

export default function Hamburger({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const pathname = usePathname();

  const slideAnim = useRef(new Animated.Value(-250)).current;

  // Animação só ao abrir o menu
  useEffect(() => {
    if (visible) {
      slideAnim.setValue(-250);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [visible, slideAnim]);

  // Função para animar o fechamento do menu
  function animateAndClose(callback?: () => void) {
    Animated.timing(slideAnim, {
      toValue: -250,
      duration: 400,
      useNativeDriver: false,
    }).start(() => {
      onClose();
      if (callback) callback();
    });
  }

  // Fecha o menu com animação
  function handleClose() {
    animateAndClose();
  }

  // Animação ao navegar para outra tela
  function handleNavigate(path: "/Home" | "/Motos") {
    if (pathname !== path) {
      animateAndClose(() => router.push(path));
    } else {
      // Fecha o menu com animação mesmo se for a mesma página
      animateAndClose();
    }
  }

  // Fecha instantaneamente ao sair
  function handleLogout() {
    onClose();
    router.replace("/");
  }

  return (
    <Modal transparent visible={visible}>
      <Pressable style={{ flex: 1 }} onPress={handleClose}>
        <Animated.View
          style={{
            width: 180,
            height: "100%",
            backgroundColor: colorScheme === "light" ? "#fff" : "#222",
            paddingTop: 60,
            paddingHorizontal: 20,
            position: "absolute",
            left: 0,
            top: 0,
            shadowColor: "#000000",
            shadowOpacity: 0.2,
            shadowRadius: 8,
            transform: [{ translateX: slideAnim }],
            justifyContent: "flex-start",
          }}
        >
          <TouchableOpacity onPress={handleClose} style={{ marginBottom: 40 }}>
            <Ionicons
              name="close"
              size={28}
              color={colorScheme === "light" ? "#222" : "#fff"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigate("/Home")}>
            <Text className="font-bold text-green-400 text-4xl mb-12">
              Patios
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigate("/Motos")}>
            <Text className="font-bold text-green-400 text-4xl mb-4">
              Motos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigate("/Cadastro")}>
            <Text className="font-bold text-green-400 text-4xl mb-12">
              Cadastro
            </Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              marginBottom: 68,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Ionicons name="log-out-outline" size={36} color="#e11d48" />
            <Text className="font-bold text-3xl" style={{ color: "#e11d48" }}>
              Sair
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
