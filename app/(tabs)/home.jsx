import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { collection, getDocs, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import logo from "../../assets/images/dinetimelogo.png";
import banner from "../../assets/images/homeBanner.png";
import { db } from "../../config/firebaseConfig";

const Home = () => {
    const router = useRouter();
    const [restaurants, setRestaurants] = useState([]);

    // const temp = async () => {
    //     return await AsyncStorage.getItem("userEmail");
    // }

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => router.push(`/restaurant/${item.name}`)} className="bg-[#5f5f5f] max-h-80 max-w-xs flex justify-center rounded-lg shadow-md p-4 mx-4">
            <Image
                source={{ uri: item.image }}
                className="h-40 mt-2 mb-1 rounded-lg"
                resizeMode='cover'
            />
            <Text className="text-lg text-white font-bold mb-2 mt-1">{item.name}</Text>
            <Text className="text-base text-white mb-2">{item.address}</Text>
            <Text className="text-base text-white mb-2">Open: {item.opening} - Close: {item.closing}</Text>
        </TouchableOpacity>
    );

    const getRestaurants = async () => {
        const q = query(collection(db, "restaurants"));
        const res = await getDocs(q);

        const data = res.docs.map(doc => doc.data());
        setRestaurants(data);
    };
    useEffect(() => {
        getRestaurants();
        // temp();
    }, []);

    return (
        <SafeAreaView style={{ backgroundColor: "#2b2b2b", paddingBottom: 50 }}>
            <View className="flex items-center">
                <View className="bg-[#5f5f5f] w-11/12 rounded-lg shadow-lg 
                justify-between items-center f;ex flex-row p-2">
                    <View className="flex flex-row">
                        <Text className="text-base text-white h-10 pt-[5] align-middle">Welcome To{" "}</Text>
                        <Image source={logo} className={"w-20 h-12"} resizeMode='cover' />
                    </View>
                </View>
            </View>

            <ScrollView stickyHeaderIndices={[0]}>
                <ImageBackground
                    source={banner} resizeMode='cover'
                    className="bg-[#2b2b2b] mb-4 w-full h-52 items-center justify-center">
                    <BlurView intensity={75} tint="dark" className="w-full p-4 shadow-lg">
                        <Text className="text-center text-3xl font-bold text-white">Dine with your loved ones</Text>
                    </BlurView>
                </ImageBackground>

                <View className="p-4 bg-[#2b2b2b] flex-row items-center">
                    <Text className="text-3xl text-white mr-2 font-semibold">
                        Special Discount %
                    </Text>
                </View>

                {restaurants.length > 0 ? (
                    <FlatList
                        data={restaurants}
                        renderItem={renderItem}
                        horizontal
                        contentContainerStyle={{ padding: 16 }}
                        showsHorizontalScrollIndicator={false}
                        scrollEnabled={true}
                    />
                ) : (
                    <ActivityIndicator animating color={"#fb9b33"} />
                )}

                <View className="p-4 bg-[#2b2b2b] flex-row items-center">
                    <Text className="text-3xl text-[#fb9b33] mr-2 font-semibold">
                        Our Restaurants
                    </Text>
                </View>

                {restaurants.length > 0 ? (
                    <FlatList
                        data={restaurants}
                        renderItem={renderItem}
                        horizontal
                        contentContainerStyle={{ padding: 16 }}
                        showsHorizontalScrollIndicator={false}
                        scrollEnabled={true}
                    />
                ) : (
                    <ActivityIndicator animating color={"#fb9b33"} />
                )}
            </ScrollView>
        </SafeAreaView>
    )
}
export default Home