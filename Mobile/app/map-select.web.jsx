import { View, Text, StyleSheet } from 'react-native';

export default function MapSelectWeb() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Map selection is not supported on Web.
            </Text>
            <Text style={styles.subtext}>
                Please use the mobile app (Android/iOS) for this feature.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtext: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
});
