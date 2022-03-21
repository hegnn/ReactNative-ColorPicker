import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  color,
  interpolateColor,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const PICKER_SIZE = 45;
const INTERNAL_PICKER_SIZE = 45 / 2;

const ColorPicker = ({colors, start, end, style, maxWidth, onColorChange}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const maxTranslateX = useDerivedValue(() => {
    return Math.min(Math.max(translateX.value, 0), maxWidth - PICKER_SIZE);
  });

  const PanGestureEvent = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.x = maxTranslateX.value;
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.x;
    },
    onEnd: () => {
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
    },
  });

  const tapGestureEvent = useAnimatedGestureHandler({
    onStart: event => {
      translateX.value = withTiming(event.absoluteX - PICKER_SIZE);
      translateY.value = withSpring(-PICKER_SIZE);
      scale.value = withSpring(1.2);
    },
    onEnd: () => {
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
    },
  });

  const pickerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: maxTranslateX.value},
        {translateY: translateY.value},
        {scale: scale.value},
      ],
    };
  });

  const internalPickerStyle = useAnimatedStyle(() => {
    const inputRange = colors.map(
      (_, index) => (index / colors.length) * maxWidth,
    );
    const backgroundColor = interpolateColor(
      translateX.value,
      inputRange,
      colors,
    );

    onColorChange?.(backgroundColor);

    return {
      backgroundColor,
    };
  });

  return (
    <GestureHandlerRootView>
      <TapGestureHandler onGestureEvent={tapGestureEvent}>
        <Animated.View>
          <PanGestureHandler onGestureEvent={PanGestureEvent}>
            <Animated.View style={styles.container}>
              <LinearGradient
                colors={colors}
                start={start}
                end={end}
                style={style}
              />
              <Animated.View style={[styles.picker, pickerStyle]}>
                <Animated.View
                  style={[styles.internalPicker, internalPickerStyle]}
                />
              </Animated.View>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </TapGestureHandler>
    </GestureHandlerRootView>
  );
};

export default ColorPicker;

const styles = StyleSheet.create({
  container: {justifyContent: 'center'},
  picker: {
    position: 'absolute',
    backgroundColor: 'white',
    width: PICKER_SIZE,
    height: PICKER_SIZE,
    borderRadius: PICKER_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  internalPicker: {
    width: INTERNAL_PICKER_SIZE,
    height: INTERNAL_PICKER_SIZE,
    borderRadius: INTERNAL_PICKER_SIZE / 2,
    borderWidth: 1,
    borderColor: 'black',
  },
});
