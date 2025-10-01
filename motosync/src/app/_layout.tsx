import { DefaultTheme, ThemeProvider } from "@react-navigation/native"; // Importa o tema padrão e o provedor de tema da navegação
import { Stack } from "expo-router"; // Importa o componente de navegação em pilha do Expo Router
import "../global.css"; // Importa estilos globais

// Adicione estas importações:
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Crie uma instância do QueryClient:
const queryClient = new QueryClient();

const RootLayout = () => {
  return (
    // Fornece o cliente de consulta e o tema de navegação para toda a aplicação
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={DefaultTheme}>
        {/* Define a navegação em pilha para as telas da aplicação, sem mostrar o header padrão */}
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;
