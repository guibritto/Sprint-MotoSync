import { DefaultTheme, ThemeProvider} from "@react-navigation/native"; // Importa o tema padrão e o provedor de tema da navegação
import { Stack } from "expo-router"; // Importa o componente de navegação em pilha do Expo Router
import "../global.css"; // Importa estilos globais

const RootLayout = () => {
  return (
    // Fornece o tema de navegação para toda a aplicação
    <ThemeProvider value={DefaultTheme}>
      {/* Define a navegação em pilha para as telas da aplicação, sem mostrar o header padrão */}
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
};

export default RootLayout;