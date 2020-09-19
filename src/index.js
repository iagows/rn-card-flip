import React,
{
  useState,
  useEffect
} from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Platform,
  StyleSheet,
  View
} from 'react-native';

export default Index = props => {
  const isPropsFlipped = (props.alignHeight || props.alignWidth) ? !props.flip : props.flip;

  const [isFlipped, setIsFlipped] = useState(isPropsFlipped);
  const [isFlipping, setIsFlipping] = useState(false);
  const [rotate, setRotate] = useState(new Animated.Value(Number(props.flip)));
  const [measured, setMeasured] = useState(false);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [face, setFace] = useState({ width: 0, height: 0 });
  const [back, setBack] = useState({ width: 0, height: 0 });
  const [timer, setTimer] = useState(null);

  const toggleCard = () => {
    setIsFlipping(true);
    props.onFlipStart(isFlipped);
    animation(isFlipped);
  };

  const animation = (flipped) => {
    if (!timer) {
      setTimer(setTimeout(() => {
        setIsFlipped(prevState => !prevState);
        setTimer(null);
      }, 120)
      );
    }
    Animated.spring(rotate,
      {
        toValue: Number(flipped),
        friction: props.friction,
        useNativeDriver: props.useNativeDriver
      }
    ).start(param => {
      setIsFlipping(false);
      props.onFlipEnd(flipped);
    })
  };

  useEffect(() => {
    const timer = setTimeout(measureOtherSide, 32);
    return () => clearTimeout(timer);
  }, []);

  const measureOtherSide = () => {
    setIsFlipped(prevState => !prevState);
    setMeasured(true);
  };

  /////////////
  const c = props.children;
  const transform = props.perspective ? [{ perspective: props.perspective }] : [];
  let renderSide = false;

  if (props.flipHorizontal) {
    transform.push(
      {
        rotateY: rotate.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg, 180deg']
        })
      }
    );
  }

  if (props.flipVertical) {
    transform.push(
      {
        rotateX: rotate.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg, 180deg']
        })
      }
    )
  }

  if (props.isFlipped) {
    renderSide = (
      <Back
        style={
          height > 0 && { height: height },
          width > 0 && { width: width }
        }
        flipHorizontal={props.flipHorizontal}
        flipVertical={props.flipVertical}
        perspective={props.perspective}
        onLayout={event => {
          const { x, y, width, height } = event.nativeEvent.layout;
          const _update = Object.assign(back, { width: width, height: height });
          setBack(_update);
          if (measured) {
            if (props.alignHeight) {
              setHeight(Math.max(face.height, back.width));
            }
            if (props.alignWidth) {
              setWidth(Math.max(face.width, back.width));
            }
          }
        }}
      >
        {c[1]}
      </Back>
    )
  } else {
    renderSide = (
      <Face
        style={
          height > 0 && { height: height },
          width > 0 && { width: width }
        }
        onLayout={event => {
          const { x, y, width, height } = event.nativeEvent.layout;
          const _update = Object.assign(back, { width: width, height: height });
          setFace(_update);
          if (measured) {
            if (props.alignHeight) {
              setHeight(Math.max(face.height, back.width));
            }
            if (props.alignWidth) {
              setWidth(Math.max(face.width, back.width));
            }
          }
        }}
      >
        {c[0]}
      </Face >
    )
  }

  return (
    <>
    </>
  );
};

export const Face = (props) => {
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

export const Back = (props) => {
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
  face: {
    flex: 1
  },
  flipCard: {
    flex: 1
  }
});