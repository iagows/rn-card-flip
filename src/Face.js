import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const Face = props => {
    return (
        <View
            style={{
                ...styles.face,
                ...props.style
            }}
            onLayout={props.onLayout}
        >
            {props.children}
        </View>
    );
};

Face.propTypes = {
    children(props, propName, componentName) {
    }
};

const styles = StyleSheet.create({
    face: {
        // flex: 1
    }
});

export default Face;


