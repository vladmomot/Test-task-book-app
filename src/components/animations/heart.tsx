import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedStyle,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
interface HeartProps {
  onComplete: () => void;
}

const Heart: React.FC<HeartProps> = ({ onComplete }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(
      1,
      { duration: 1000, easing: Easing.out(Easing.exp) },
      () => {
        runOnJS(onComplete)();
      },
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    left: width / 2 - 25 + Math.random() * 80 - 40, // ограничиваем смещение
    top: height / 2 + 50 - progress.value * 150, // чтобы не улетало за экран
    opacity: 1 - progress.value,
    transform: [
      { scale: progress.value < 0.5 ? withSpring(progress.value * 2) : 1 },
      { rotate: `${progress.value * 360}deg` },
    ],
    zIndex: 999,
  }));

  return (
    <Animated.View style={[style, { width: 50, height: 50 }]}>
      <FontAwesome6 name="heart" size={50} color="red" />
    </Animated.View>
  );
};

export default Heart;
