import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "../../config/firebaseConfig";
import guestFormSchema from "../../utils/guestFormSchema";

const FindSlots = ({
    date,
    selectedNumber,
    slots,
    selectedSlot,
    setSelectedSlot,
    restaurant,
}) => {
    const [slotsVisible, setSlotsVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [formVisible, setFormVisible] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(guestFormSchema),
        defaultValues: {
            fullName: "",
            phoneNumber: "",
        },
    });

    const handlePress = () => {
        setSlotsVisible(!slotsVisible);
    };

    const handleSlotPress = (slot) => {
        let prevSlot = selectedSlot;
        if (prevSlot === slot) {
            setSelectedSlot(null);
        } else {
            setSelectedSlot(slot);
        }
    };

    const handleBooking = async () => {
        const userEmail = await AsyncStorage.getItem("userEmail");
        const guestStatus = await AsyncStorage.getItem("isGuest");

        if (userEmail) {
            try {
                await addDoc(collection(db, "bookings"), {
                    email: userEmail,
                    slot: selectedSlot,
                    date: date.toISOString(),
                    guests: selectedNumber,
                    restaurant: restaurant,
                })
                alert("Slot booked successfully!");
            } catch (error) {
                console.error("Error booking slot:", error);
            }
        } else if (guestStatus === "true") {
            setFormVisible(true);
            setModalVisible(true);
        }
    }

    const handleFormSubmit = async (values) => {
        try {
            await addDoc(collection(db, "bookings"), {
                ...values,
                slot: selectedSlot,
                date: date.toISOString(),
                guests: selectedNumber,
                restaurant: restaurant,
            });

            alert("Booking successfully Done!");
            setModalVisible(false);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View className="flex-1">
            <View className={`flex ${selectedSlot != null && "flex-row"} `}>
                <View className={`${selectedSlot != null && "flex-1"}`}>
                    <TouchableOpacity onPress={handlePress}>
                        <Text className="text-center text-lg font-semibold bg-[#f49b33] p-2 my-3 mx-2 rounded-lg">
                            Find Slots
                        </Text>
                    </TouchableOpacity>
                </View>
                {selectedSlot != null && (
                    <View className="flex-1">
                        <TouchableOpacity onPress={handleBooking}>
                            <Text className="text-center text-white text-lg font-semibold bg-[#f49b33] p-2 my-3 mx-2 rounded-lg">
                                Book Slot
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {slotsVisible && (
                <View className="flex-wrap flex-row mx-2 p-2 bg-[#474747] rounded-lg">
                    {slots.map((slot, index) => (
                        <TouchableOpacity
                            key={index}
                            className={` m-2 p-4 bg-[#f49b33] rounded-lg items-center justify-center ${selectedSlot && selectedSlot !== slot ? "opacity-50" : ""
                                }`}
                            onPress={() => handleSlotPress(slot)}
                            disabled={selectedSlot && selectedSlot !== slot}
                        >
                            <Text className="text-white font-bold">{slot}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
            >
                <View className="flex-1 bg-[#00000080] justify-end">
                    <View className="bg-[#474747] mx-4 rounded-t-lg p-4 pb-6">
                        {formVisible && (
                            <View className="w-full">
                                <Ionicons
                                    name="close-sharp"
                                    size={30}
                                    color={"#f49b33"}
                                    onPress={() => setModalVisible(false)}
                                />
                                <Text className="text-[#f49b33] mt-4 mb-2">Name</Text>
                                <TextInput
                                    className="h-10 border border-white text-white rounded px-2"
                                    onChangeText={(text) => setValue("fullName", text)}
                                    {...register("fullName")}
                                />
                                {errors.fullName && (
                                    <Text className="text-red-500 text-xs mb-2">
                                        {errors.fullName.message}
                                    </Text>
                                )}

                                <Text className="text-[#f49b33] mt-4 mb-2">Phone Number</Text>
                                <TextInput
                                    className="h-10 border border-white text-white rounded px-2"
                                    onChangeText={(text) => setValue("phoneNumber", text)}
                                    {...register("phoneNumber")}
                                />
                                {errors.phoneNumber && (
                                    <Text className="text-red-500 text-xs mb-2">
                                        {errors.phoneNumber.message}
                                    </Text>
                                )}

                                <TouchableOpacity
                                    onPress={handleSubmit(handleFormSubmit)}
                                    className="p-2 my-2 bg-[#f49b33] text-black rounded-lg mt-10"
                                >
                                    <Text className="text-lg font-semibold text-center">
                                        Submit
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default FindSlots;
