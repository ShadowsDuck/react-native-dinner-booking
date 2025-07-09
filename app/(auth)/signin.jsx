import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { Controller, useForm } from "react-hook-form";
import { Alert, Image, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../../assets/images/dinetimelogo.png";
import entryImg from "../../assets/images/Frame.png";
import signinSchema from "../../utils/authSigninSchema";

const Signin = () => {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(signinSchema),
    });

    const auth = getAuth();
    const db = getFirestore();
    const handleSignin = async (data) => {
        try {
            const userCredentials = await signInWithEmailAndPassword(
                auth,
                data.email,
                data.password
            )
            const user = userCredentials.user;

            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                console.log("User already exists in Firestore", userDoc.data());
                await AsyncStorage.setItem("userEmail", data.email);
                router.push("/home");
            } else {
                console.log("No such Doc");
            }
        } catch (error) {
            if (error.code === "auth/invalid-credential") {
                Alert.alert(
                    "Signin Failed!!",
                    "Incorrect credentials. Please try again.",
                    [{ text: "OK" }]
                );
            } else {
                Alert.alert(
                    "Signin Error!!",
                    "An error occurred during signin. Please try again later.",
                    [{ text: "OK" }]
                );
            }
        }
    }

    const onSubmit = (data) => {
        handleSignin(data)
    };

    return (
        <SafeAreaView className={"bg-[#2b2b2b]"}>
            <ScrollView contentContainerStyle={{ height: "100%" }}>
                <View className="flex justify-center items-center m-2 ">
                    <Image
                        source={logo}
                        style={{ width: 200, height: 100 }}
                    />
                    <Text className="text-white text-lg font-bold mb-10 text-center">
                        Let’s get you started
                    </Text>
                </View>

                <View className="w-5/6 mx-auto">
                    <Text className="text-[#f49b33] mt-4 mb-2">Email</Text>
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                className="h-11 border border-white text-white rounded px-2"
                                keyboardType="email-address"
                                onChangeText={onChange}
                                onBlur={onBlur}
                                value={value}
                            />
                        )}
                    />
                    {errors.email && (
                        <Text className="text-red-500 text-xs mb-2">{errors.email.message}</Text>
                    )}

                    <Text className="text-[#f49b33] mt-4 mb-2">Password</Text>
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                className="h-11 border border-white text-white rounded px-2"
                                secureTextEntry
                                onChangeText={onChange}
                                onBlur={onBlur}
                                value={value}
                            />
                        )}
                    />
                    {errors.password && (
                        <Text className="text-red-500 text-xs mb-2">{errors.password.message}</Text>
                    )}

                    <TouchableOpacity
                        onPress={handleSubmit(onSubmit)}
                        className="p-2 my-2 bg-[#f49b33] rounded-lg mt-10"
                    >
                        <Text className="text-lg font-semibold text-center">Sign In</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex flex-row justify-center items-center my-5 p-2">
                    <Text className="text-white font-semibold">
                        Don’t have an account?{" "}
                    </Text>

                    <TouchableOpacity onPress={() => router.push("/signup")}>
                        <Text className="text-[#f49b33] font-semibold text-base">
                            SIGN UP
                        </Text>
                    </TouchableOpacity>
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
    )
}

export default Signin