import { Image } from "expo-image"
import { Text, View } from "react-native"

export default function ContactCard({ name, distance }) {
    return (
        <View
            style={{
                padding: 10,
                backgroundColor: "#cfcfcf",
                margin: '3.5%',
                marginBottom: 0,
                borderRadius: 10,
                width: "93%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
            }}
        >
            <View
                style={{
                    // height: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 10,
                    justifyContent: 'start',
                    alignItems: 'center'
                }}>
                <Image
                    source="https://picsum.photos/seed/696/3000/2000"
                    style={{
                        width: 50,
                        height: 50, // 👈 important
                        borderRadius: 25,
                    }}
                    contentFit="cover" // 👈 scales image correctly
                />
                <Text style={{ fontSize: 16 }}>{name}</Text>
            </View>
            <View><Text style={{ fontSize: 16, fontWeight: 'bold' }}>{distance} km</Text></View>
        </View>
    )
}