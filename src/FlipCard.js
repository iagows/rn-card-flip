import React,
{
  useState,
  useEffect, useRef
} from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native';

import Back from './Back';
import Face from './Face';

const FlipCard = props => {
  const isPropsFlipped = (props.alignHeight || props.alignWidth) ? !props.flip : props.flip;

  const [isFlipped, setIsFlipped] = useState(isPropsFlipped);
  const [measured, setMeasured] = useState(false);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [face, setFace] = useState({ width: 0, height: 0 });
  const [back, setBack] = useState({ width: 0, height: 0 });
  const [timer, setTimer] = useState(null);
  const rotate = useRef(new Animated.Value(Number(props.flip)));

  const toggleCard = () => {
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
  const transform = props.perspective ? [{ perspective: props.perspective }] : [];
  let renderSide = false;

  console.log('aqui');
  if (props.flipHorizontal) {
    transform.push(
      {
        rotateY: rotate.current.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg, 180deg']
        })
      }
    );
  }

  if (props.flipVertical) {
    transform.push(
      {
        rotateX: rotate.current.interpolate({
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
        {props.children ? props.children[1] : <Text>Tumpero</Text>}
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
        {props.children ? props.children[0] : <Text>Tumpero</Text>}
      </Face >
    )
  }

  if (props.clickable) {
    let opacity = 0;
    if (((props.alignHeight || props.alignWidth) && measured) || !(props.alignHeight || props.alignWidth)) {
      opacity = 1;
    }
    return (
      <TouchableOpacity
        // style={{ flex: 1 }}
        testID={props.testID}
        activeOpacity={1}
        onPress={() => toggleCard()}
      >
        <Animated.View
          {...props}
          style={{
            ...styles.flipCard,
            transform: transform,
            opacity: opacity,
            ...props.style
          }}
        >
          {renderSide}
        </Animated.View>
      </TouchableOpacity>
    );
  } else {
    return (
      <Animated.View
        {...props}
        style={{
          ...styles.flipCard,
          transform: transform,
          ...props.style
        }}
      >
        {renderSide}
      </Animated.View>
    );
  }
};

FlipCard.propTypes = {
  flip: PropTypes.bool,
  friction: PropTypes.number,
  perspective: PropTypes.number,
  flipHorizontal: PropTypes.bool,
  flipVertical: PropTypes.bool,
  clickable: PropTypes.bool,
  onFlipEnd: PropTypes.func,
  onFlipStart: PropTypes.func,
  alignHeight: PropTypes.bool,
  alignWidth: PropTypes.bool,
  useNativeDriver: PropTypes.bool,
  children(props, propName, componentName) {
    const prop = props[propName]
    if (React.Children.count(prop) !== 2) {
      return new Error(
        '`' + componentName + '` ' +
        'should contain exactly two children. ' +
        'The first child represents the front of the card. ' +
        'The second child represents the back of the card.'
      )
    }
  }
}

FlipCard.defaultProps = {
  flip: false,
  friction: 6,
  perspective: 1000,
  flipHorizontal: true,
  flipVertical: false,
  clickable: true,
  onFlipEnd: () => { },
  onFlipStart: () => { },
  alignHeight: false,
  alignWidth: false,
  useNativeDriver: true,
}

const styles = StyleSheet.create({
  flipCard: {
    // flex: 1
  }
});

export default FlipCard;