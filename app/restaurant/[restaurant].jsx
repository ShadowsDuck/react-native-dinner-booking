import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../config/firebaseConfig';
const Restaurant = () => {
    const { restaurant } = useLocalSearchParams();
    const flatListRef = useRef(null);
    const windowWidth = Dimensions.get('window').width;

    const [restaurantData, setRestaurantData] = useState({});
    const [carouselData, setCarouselData] = useState([]);
    const [slotsData, setSlotsData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNextImage = () => {
        const carouselLength = carouselData[0]?.images.length;
        if (currentIndex < carouselLength - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
        }

        if (currentIndex === carouselLength - 1) {
            setCurrentIndex(0);
            flatListRef.current.scrollToIndex({ index: 0, animated: true });
        }
    }

    const handlePrevImage = () => {
        const carouselLength = carouselData[0]?.images.length;
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            setCurrentIndex(prevIndex);
            flatListRef.current.scrollToIndex({ index: prevIndex, animated: true });
        }

        if (currentIndex === 0) {
            const lastIndex = carouselLength - 1;
            setCurrentIndex(lastIndex);
            flatListRef.current.scrollToIndex({ index: lastIndex, animated: true });
        }
    }

    const carouselItem = ({ item }) => {
        return (
            <View style={{ width: windowWidth - 2 }} className="h-64 relative">
                <View style={{ position: 'absolute', top: '45%', backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: 50, padding: 5, zIndex: 10, right: '7%' }}>
                    <Ionicons onPress={handleNextImage} name="arrow-forward" size={24} color="white" />
                </View >
                <View style={{ position: 'absolute', top: '45%', backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: 50, padding: 5, zIndex: 10, left: '3%' }}>
                    <Ionicons onPress={handlePrevImage} name="arrow-back" size={24} color="white" />
                </View >

                <View
                    style={{
                        position: "absolute",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        left: "50%",
                        transform: [{ translateX: -50 }],
                        zIndex: 10,
                        bottom: 15,
                    }}
                >
                    {carouselData[0].images?.map((_, i) => (
                        <View
                            key={i}
                            className={`bg-white h-2 w-2 ${i === currentIndex && "h-3 w-3"} p-1 mx-1 rounded-full`}
                        />
                    ))}
                </View>
                <Image
                    source={{ uri: item }} style={{ opacity: 0.5, backgroundColor: "black", marginRight: 20, marginLeft: 5, borderRadius: 25 }} className="h-64" />
            </View >
        )
    };

    const getRestaurantData = useCallback(async () => {
        try {
            const restaurantQuery = query(collection(db, "restaurants"), where("name", "==", restaurant));
            const restaurantSnapshot = await getDocs(restaurantQuery);

            if (restaurantSnapshot.empty) {
                console.log("No restaurant found with the name:", restaurant);
                return;
            }

            // for (const doc of restaurantSnapshot.docs) { // กรณีที่มีร้านชื่อซ้ำ
            const doc = restaurantSnapshot.docs[0]; // มีร้านเดียวแน่นอน(ชื่อไม่ซ้ำ)
            const restaurantData = doc.data();
            setRestaurantData(restaurantData);

            const carouselQuery = query(
                collection(db, "carouselImages"),
                where("res_id", "==", doc.ref)
            );
            const carouselSnapshot = await getDocs(carouselQuery);
            if (carouselSnapshot.empty) {
                console.log("No matching carousel found");
                return;
            }
            const carouselImages = [];
            carouselSnapshot.forEach((carouselDoc) => {
                carouselImages.push(carouselDoc.data());
            });
            setCarouselData(carouselImages);

            const slotsQuery = query(
                collection(db, "slots"),
                where("ref_id", "==", doc.ref)
            );
            const slotsSnapshot = await getDocs(slotsQuery);
            if (slotsSnapshot.empty) {
                console.log("No matching slots found");
                return;
            }
            const slots = [];
            slotsSnapshot.forEach((slotDoc) => {
                slots.push(slotDoc.data());
            });
            setSlotsData(slots[0]?.slot);
            // }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [restaurant])

    useEffect(() => {
        getRestaurantData();
    }, [getRestaurantData]);

    return (
        <SafeAreaView style={{ backgroundColor: "#2b2b2b", paddingBottom: 50 }}>
            <ScrollView className="h-full">
                <View className="flex-1 my-2 p-2">
                    <Text className="text-xl text-[#f49b33] mr-2 font-semibold">
                        {restaurant}
                    </Text>
                    <View className="border-b border-[#f49b33]" />
                </View>
                <View className="h-64 max-w-[98%] mx-2">
                    <FlatList
                        ref={flatListRef}
                        data={carouselData[0]?.images}
                        renderItem={carouselItem}
                        horizontal
                        scrollEnabled={false}
                        showsHorizontalScrollIndicator={false}
                        style={{ borderRadius: 25 }}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
export default Restaurant