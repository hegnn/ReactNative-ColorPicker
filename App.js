import {StyleSheet, Dimensions, View} from 'react-native';
import React, {useCallback} from 'react';
import ColorPicker from './ColorPicker';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const COLORS = [
  'red',
  'purple',
  'blue',
  'cyan',
  'green',
  'yellow',
  'orange',
  'black',
  'white',
];

const {width} = Dimensions.get('window');

const App = () => {
  const pickedColor = useSharedValue(COLORS[0]);

  const onColorChange = useCallback(color => {
    'worklet';
    pickedColor.value = color;
  }, []);

  const circleStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: pickedColor.value,
    };
  });

  return (
    <>
      <View style={styles.topContainer}>
        <Animated.View style={[styles.circle, circleStyle]} />
      </View>
      <View style={styles.bottomContainer}>
        <ColorPicker
          colors={COLORS}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.gradient}
          maxWidth={width * 0.9}
          onColorChange={onColorChange}
        />
      </View>
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  topContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  circle: {
    width: width / 1.5,
    height: width / 1.5,
    borderRadius: width / 2,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {height: 40, width: width * 0.9, borderRadius: 40},
});
