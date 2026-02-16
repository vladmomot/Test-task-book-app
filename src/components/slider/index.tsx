import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  SharedValue,
  useDerivedValue,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import { colors } from '@/theme';

interface CustomSliderProps {
  minimumValue?: number;
  maximumValue?: number;
  isVertical?: boolean;
  sharedValue: SharedValue<number>;
  size?: number;
  style?: ViewStyle;
  thumbStyle?: ViewStyle;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  minimumValue = 0,
  maximumValue = 10,
  sharedValue,
  isVertical = false,
  size = 200,
  style,
  thumbStyle,
}) => {
  const offset = useSharedValue(0);
  const startOffset = useSharedValue(0);
  const maxValue = size - 30;

  useDerivedValue(() => {
    offset.value =
      ((sharedValue.value - minimumValue) / (maximumValue - minimumValue)) *
      maxValue;
  });

  const gesture = Gesture.Pan()
    .onStart(() => {
      startOffset.value = offset.value;
    })
    .onUpdate(e => {
      'worklet';

      const translation = isVertical ? e.translationY : e.translationX;

      const next = Math.max(
        0,
        Math.min(maxValue, startOffset.value + translation),
      );

      offset.value = next;

      const newValue =
        (next / maxValue) * (maximumValue - minimumValue) + minimumValue;

      sharedValue.value = newValue;
    });

  const thumbAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: isVertical ? 0 : offset.value },
        { translateY: isVertical ? offset.value : 0 },
      ],
    };
  });

  const StyledContainer = styled.View<{ width: number; height: number }>`
    width: ${({ width }) => width}px;
    height: ${({ height }) => height}px;
    background-color: ${colors.button};
    border-radius: 25px;
    padding: 5px;
  `;

  //http://loremflickr.com/640/480/dog

  return (
    <GestureHandlerRootView style={[styles.container, style]}>
      <StyledContainer
        width={isVertical ? 30 : size}
        height={isVertical ? size : 30}
      >
        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[styles.sliderHandle, thumbStyle, thumbAnimStyle]}
          />
        </GestureDetector>
      </StyledContainer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  sliderHandle: {
    width: 20,
    height: 20,
    backgroundColor: '#f8f9ff',
    borderRadius: 20,
    position: 'absolute',
    top: 5,
    left: 5,
  },
});

export default CustomSlider;
