import { ColorSchemeName, useColorScheme as _useColorScheme } from "react-native";

/**
 * Hook para detectar o tema do sistema operacional (claro ou escuro).
 * Retorna 'light' ou 'dark'.
 */
export function useColorScheme(): NonNullable<ColorSchemeName> {
  const colorScheme = _useColorScheme();
  return colorScheme ?? "light"; // Retorna 'light' como padrão se o valor for nulo.
}