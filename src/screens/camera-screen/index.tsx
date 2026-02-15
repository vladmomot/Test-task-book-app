import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Text,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
//import { NativeStackNavigationProp } from '@react-navigation/native-stack';
//import { RootStackParamList } from '@/types';
import { colors } from '@/theme';
import BackButton from '@/components/buttons/BackButton';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  CameraProps,
  useCameraFormat,
  useCodeScanner,
  Point,
} from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
import { useAppState } from '@react-native-community/hooks';
import PrimaryButton from '@/components/buttons/Button';
//type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Users'>;
import Reanimated, {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Sentry from '@sentry/react-native';

Reanimated.addWhitelistedNativeProps({
  zoom: true,
});
const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);

const CameraScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const { hasPermission, requestPermission } = useCameraPermission();
  const isFocused = useIsFocused();
  const appState = useAppState();
  const camera = useRef<Camera>(null);
  const isActive = isFocused && appState === 'active';
  const device = useCameraDevice('front', {
    physicalDevices: ['wide-angle-camera'],
  });
  const zoom = useSharedValue(1);
  const zoomOffset = useSharedValue(0);
  const format = useCameraFormat(device, [
    { photoResolution: { width: 1280, height: 720 } },
  ]);
  const focus = useCallback(
    async (point: Point) => {
      try {
        if (!camera.current || !device?.supportsFocus) return;

        await camera.current.focus(point);
      } catch (e) {
        console.warn('Focus error', e);
      }
    },
    [device],
  );

  const tapGesture = Gesture.Tap().onEnd((event, success) => {
    'worklet';
    if (!success) return;
    runOnJS(focus)({
      x: event.x,
      y: event.y,
    });
  });

  const zoomUpdate = useCallback(() => {
    console.log('Device in zoomUpdate:', zoom.value);
    if (device) {
      const gesture = Gesture.Pinch()
        .onBegin(() => {
          zoomOffset.value =
            device.neutralZoom > 1 ? device.neutralZoom : zoom.value;
        })
        .onUpdate(event => {
          const zoomValue = zoomOffset.value * event.scale;
          zoom.value = interpolate(
            zoomValue,
            [1, 10],
            [device.minZoom, device.maxZoom],
            Extrapolation.CLAMP,
          );
        });
      return gesture;
    } else {
      return Gesture.Pinch().onUpdate(() => {});
    }
  }, [device]);

  const composedGesture = Gesture.Simultaneous(tapGesture, zoomUpdate());

  const animatedProps = useAnimatedProps<CameraProps>(
    () => ({ zoom: zoom.value }),
    [zoom],
  );

  useEffect(() => {
    console.log('Device:', device);
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      setPhotos([]);
    } catch (error) {
      if (__DEV__) {
        console.warn('Error refreshing data:', error);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleTakePhoto = useCallback(async () => {
    if (camera.current?.props.isActive) {
      /*const photo = await camera.current.takePhoto({
          flash: 'off',
          enableShutterSound: false,
        });
        console.log('Photo taken:', photo);
      */
      try {
        const snapshot = await camera.current.takeSnapshot({
          quality: 90,
        });

        setPhotos(prev => [...prev.slice(-5), `file://${snapshot.path}`]);
      } catch (error) {
        console.error('Error taking photo:', error);
      }
    }
  }, []);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    regionOfInterest: {
      x: 50,
      y: 50,
      width: 50,
      height: 50,
    },
    onCodeScanned: codes => {
      for (const code of codes) {
        console.log(code);
      }
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <BackButton />
            <Text style={styles.title}>Camera Screen</Text>
          </View>
          <View style={styles.container1} />
          <View style={styles.container2} />
        </View>
        <View style={mainStyle}>
          {!hasPermission && (
            <Text style={styles.permissionText}>No camera permission</Text>
          )}
          {device == null && (
            <Text style={styles.permissionText}>
              No camera device available
            </Text>
          )}
          {hasPermission && device && (
            <GestureDetector gesture={composedGesture}>
              <ReanimatedCamera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={isActive}
                video={true}
                audio={true}
                androidPreviewViewType="texture-view"
                photo={true}
                animatedProps={animatedProps}
                format={format}
                photoQualityBalance="speed"
                codeScanner={codeScanner}
              />
            </GestureDetector>
          )}
        </View>
        <View style={styles.photoContainer}>
          {photos.map((photo, index) => (
            <Image
              key={index}
              source={{ uri: photo }}
              style={styles.photoItem}
            />
          ))}
        </View>
        <PrimaryButton
          title="Take Photo"
          style={{ marginVertical: 10 }}
          onPress={handleTakePhoto}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContainer: {
    flex: 1,
  },
  permissionText: {
    color: colors.text,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  photoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  photoItem: {
    width: '50%',
    aspectRatio: 1,
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#314ac3',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  container1: {
    marginTop: 16,
    flexDirection: 'column',
    gap: 8,
    borderColor: '#314ac3',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  container2: {
    marginTop: 16,
    flexDirection: 'column',
    gap: 8,
    borderColor: '#314ac3',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  constainer3: {
    backgroundColor: 'black',
    flex: 1,
  },
});

const mainStyle = StyleSheet.flatten([styles.header, styles.constainer3]);

export default Sentry.wrap(CameraScreen);
