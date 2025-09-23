import { View } from "react-native";
import { Stack } from "expo-router"; // Importa o componente de navegação em pilha do Expo Router
import { useColorScheme } from "../../hooks/useColorScheme"; // Importa o hook para detectar o tema do sistema

const RootLayout = () => {
  // Detecta o tema do sistema (claro/escuro)
  const colorScheme = useColorScheme();
  return (
    // Fornece o tema de navegação para toda a aplicação
    <View className={`flex-1 ${colorScheme === "light" ? "bg-white" : "bg-black"}`}>
      {/* Define a navegação em pilha para as telas da aplicação, sem mostrar o header padrão */}
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
};

export default RootLayout;