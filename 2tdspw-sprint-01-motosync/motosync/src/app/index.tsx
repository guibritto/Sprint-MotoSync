import { Image, View, ScrollView } from "react-native";
import { FormLogin } from "../components/FormLogin";
import { useColorScheme } from "../hooks/useColorScheme"; // Hook para detectar tema claro/escuro
import Footer from "../components/Footer";

const IndexScreen = () => {
  const colorScheme = useColorScheme(); // Detecta o tema do sistema (claro/escuro)

  return (
    // ScrollView permite rolagem caso o conteúdo ultrapasse a tela para você poder sair do TextInput clicando na tela
    <ScrollView className={colorScheme === "light" ? "bg-white" : "bg-black"}>
      <View
        className={colorScheme === "light" ? "bg-white" : "bg-black"}
        style={{ flex: 1, alignItems: "center" }}
      >
        {/* Logo da aplicação */}
        <Image
          source={require('../../assets/images/moto_verde.png')}
          style={{ width: 400, height: 300, marginBottom: -60, marginTop: 80 }}
        />
        {/* Componente formulário de login */}
        <FormLogin />
        {/* Rodapé que redireciona para a tela de participantes */}
        <Footer />
      </View>
    </ScrollView>
  );
};
export default IndexScreen;