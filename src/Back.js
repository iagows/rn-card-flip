import React from 'react';
import {
    View,
    Platform,
    StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';

const Back = props => {
    const transform = [];
    if (props.flipHorizontal) {
        transform.push({ scaleX: -1 });
        if (Platform.OS === 'android') {
            transform.push({ perspective: props.perspective });
        }
    }
    if (props.flipVertical) {
        transform.push({ scaleY: -1 });
        if (Platform.OS === 'android') {
            transform.push({ perspective: props.perspective });
        }
    }

    return (
        <View
            style={{
                ...styles.back,
                ...props.style,
                transform: transform
            }}
            onLayout={props.onLayout}
        >
            {props.children}
        </View>
    );
};

Back.defaultProps = {
    flipHorizontal: false,
    flipVertical: true,
    perspective: 1000,
};

Back.propTypes = {
    flipHorizontal: PropTypes.bool,
    flipVertical: PropTypes.bool,
    perspective: PropTypes.number,
    children(props, propName, componentName) {
    }
};

const styles = StyleSheet.create({
    back: {
        flex: 1
    },
});

export default Back;