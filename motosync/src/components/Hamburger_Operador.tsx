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

  function handleClose() {
    animateAndClose();
  }

  function handleNavigate(
    path: "/Home" | "/Motos" | "/Cadastro" | "/DashBoard"
  ) {
    if (pathname !== path) {
      animateAndClose(() => router.push(path));
    } else {
      animateAndClose();
    }
  }

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
          <TouchableOpacity onPress={() => handleNavigate("/DashBoard")}>
            <Text className="font-bold text-green-400 text-4xl mt-8">
              DashBoard
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
