import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import FlipCard from './src/FlipCard';

const App = props => {
    return (
        <View style={styles.centered}>
            <Text>Tumpero</Text>
            <FlipCard
                style={styles.container}
                friction={6}
                perspective={1000}
                // flipHorizontal={true}
                // flipVertical={false}
                flip={false}
                clickable={true}
                onFlipEnd={(isFlipEnd) => { console.log('isFlipEnd', isFlipEnd) }}
            >
                <View style={styles.card}>
                    <Text style={{ textAlign: 'center' }}>1</Text>
                </View>
                <View style={styles.card}>
                    <Text style={{ textAlign: 'center' }}>2</Text>
                </View>
            </FlipCard>
        </View>
    );
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        backgroundColor: 'green',
    },
    card: {
        width: 100,
        height: 100,
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: '#ccc',
    }
});

export default App;