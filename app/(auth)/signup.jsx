import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { Controller, useForm } from "react-hook-form";
import { Alert, Image, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../../assets/images/dinetimelogo.png";
import entryImg from "../../assets/images/Frame.png";
import signupSchema from "../../utils/authSignupSchema";

const Signup = () => {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(signupSchema),
    });

    const auth = getAuth();
    const db = getFirestore();
    const handleSignup = async (data) => {
        try {
            const userCredentials = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            )
            const user = userCredentials.user;

            await setDoc(doc(db, "users", user.uid), {
                email: data.email,
                createdAt: new Date().toISOString(),
            });
            await AsyncStorage.setItem("userEmail", data.email);
            router.push("/home");
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                Alert.alert(
                    "Signup Failed!!",
                    "Email already in use. Please try another email.",
                    [{ text: "OK" }]
                );
            } else {
                Alert.alert(
                    "Signup Error!!",
                    "An error occurred during signup. Please try again later.",
                    [{ text: "OK" }]
                );
            }
        }
    }

    const onSubmit = (data) => {
        // console.log("Signup data", data);
        handleSignup(data)
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

                    <Text className="text-[#f49b33] mt-4 mb-2">Confirm Password</Text>
                    <Controller
                        control={control}
                        name="confirmPassword"
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
                    {errors.confirmPassword && (
                        <Text className="text-red-500 text-xs mb-2">{errors.confirmPassword.message}</Text>
                    )}

                    <TouchableOpacity
                        onPress={handleSubmit(onSubmit)}
                        className="p-2 my-2 bg-[#f49b33] rounded-lg mt-10"
                    >
                        <Text className="text-lg font-semibold text-center">Sign Up</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex flex-row justify-center items-center my-5 p-2">
                    <Text className="text-white font-semibold">
                        Have an account?{" "}
                    </Text>

                    <TouchableOpacity onPress={() => router.push("/signin")}>
                        <Text className="text-[#f49b33] font-semibold text-base">
                            SIGN IN
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
export default Signup