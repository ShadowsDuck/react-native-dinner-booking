import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/images/dinetimelogo.png";
import entryImg from "../assets/images/Frame.png";

export default function Index() {
  const router = useRouter();

  const handleGuest = async () => {
    await AsyncStorage.setItem("isGuest", "true");
    router.push("/home");
  }

  return (
    <SafeAreaView className={"bg-[#2b2b2b]"}>
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="flex justify-center items-center m-2 ">
          <Image
            source={logo}
            style={{ width: 300, height: 300 }}
          />
          <View className="w-3/4">
            <TouchableOpacity className="bg-[#f49b33] text-black rounded-lg p-2 my-2 max-w-fit" onPress={() => router.push("/signup")}>
              <Text className="text-center text-lg font-semibold">
                Sign Up
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-[#2b2b2b] border border-[#f49b33] rounded-lg p-2 my-2 max-w-fit" onPress={handleGuest}>
              <Text className="text-center text-lg font-semibold text-[#f49b33]">
                Guest User
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text className="text-center text-white text-base font-semibold my-4">
              <View className="border-b-2 border-[#f49b33] p-2 mb-1 w-24" /> or{" "}
              <View className="border-b-2 border-[#f49b33] p-2 mb-1 w-24" />
            </Text>

            <View className="flex flex-row justify-center items-center">
              <Text className="text-white font-semibold">
                Have an account?{" "}
              </Text>

              <TouchableOpacity onPress={() => router.push("/signin")}>
                <Text className="text-[#f49b33] font-semibold text-base">
                  SIGN IN
                </Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
        <View className="flex-1" >
          <Image
            source={entryImg}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>
        <StatusBar barStyle={"light-content"} backgroundColor={"#2b2b2b"} />
      </ScrollView>
    </SafeAreaView>
  );
}
