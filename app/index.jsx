import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
      <TouchableOpacity onPress={() => router.push("/home")}>
        <Text className="mt-4 text-lg text-blue-700">change route</Text>
      </TouchableOpacity>
    </View>
  );
}
