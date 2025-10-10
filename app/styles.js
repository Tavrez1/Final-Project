import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        flex: 1
    },
    mapContainer: {
        marginLeft: "auto",
        marginRight: "auto",
        height: "100%",
        width: "100%",
        borderWidth: 2,
        borderColor: "#b8bab9",
    },
    map: { flex: 1 },
    loading: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    sosButton: {
        position: 'absolute',
        bottom: 40,
        left: '50%',
        marginHorizontal: 'auto',
        transform: [{ translateX: '-50%' }],
        backgroundColor: 'red',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 50,
        elevation: 10,
    },
    sosText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 25,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalMsg: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});

export default styles