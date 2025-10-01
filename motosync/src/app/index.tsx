import { Image, View, ScrollView } from "react-native";
import { FormLogin } from "../components/FormLogin";
import { useColorScheme } from "../hooks/useColorScheme";
import Footer from "../components/Footer";

const IndexScreen = () => {
  const colorScheme = useColorScheme();

  return (
    <ScrollView className={colorScheme === "light" ? "bg-white" : "bg-black"}>
      <View
        className={colorScheme === "light" ? "bg-white" : "bg-black"}
        style={{ flex: 1, alignItems: "center" }}
      >
        <Image
          source={require("../../assets/images/moto_verde.png")}
          style={{ width: 400, height: 300, marginBottom: -60, marginTop: 80 }}
        />
        <FormLogin />
        <Footer />
      </View>
    </ScrollView>
  );
};
export default IndexScreen;
