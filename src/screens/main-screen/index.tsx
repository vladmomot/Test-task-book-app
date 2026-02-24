import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  RefreshControl,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Book, TopBannerSlide } from '@/types';
import { getJsonData, updateData } from '@/services/remoteConfig';
import TopBanner from './components/TopBanner';
import GenreSection from './components/GenreSection';
import { colors, fonts } from '@/theme';
import * as Sentry from '@sentry/react-native';
import notifee from '@notifee/react-native';
import NativeFlashlight from 'specs/NativeFlashlight';
import PrimaryButton from '@/components/buttons/Button';
import CustomSlider from '@/components/slider';
import RNShake from 'react-native-shake';
import Animated, {
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import Collapsible from 'react-native-collapsible';
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { enableLocation, saveKeychainData } from '@/utils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const MainScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [topBannerSlides, setTopBannerSlides] = useState<TopBannerSlide[]>([]);
  const [booksByGenre, setBooksByGenre] = useState<Record<string, Book[]>>({});
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [on, setOn] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    setTimeout(() => {
      setIsCollapsed(false);
    }, 1);
    loadData();
  }, []);

  useEffect(() => {
    const subscription = RNShake.addListener(() => {
      setImageUrl(
        `https://loremflickr.com/640/480/${arrayOfImageUrls[Math.floor(Math.random() * arrayOfImageUrls.length - 1)]}?cacheBust=${Date.now()}`,
      );
    });
    return () => subscription.remove();
  }, []);

  const loadData = async () => {
    try {
      const jsonData = getJsonData();
      setTopBannerSlides(jsonData.top_banner_slides || []);

      const grouped: Record<string, Book[]> = {};
      (jsonData.books || []).forEach((book: Book) => {
        if (!grouped[book.genre]) {
          grouped[book.genre] = [];
        }
        grouped[book.genre].push(book);
      });
      setBooksByGenre(grouped);
    } catch (error) {
      if (__DEV__) {
        console.error('Error loading data:', error);
      }
    }
  };

  const handleBookPress = (bookId: number) => {
    navigation.navigate('BookDetails', { bookId });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Sentry.startSpan({ name: 'Important Function' }, async () => {
        await enableLocation();
        await saveKeychainData();
        await updateData();
        loadData();
      });
    } catch (error) {
      if (__DEV__) {
        console.error('Error refreshing data:', error);
      }
      setRefreshing(false);
    }
    setRefreshing(false);
  };

  const sliderValue = useSharedValue(0);
  let myText = 'Я люблю тебе понад усе на світі моя кохана <3';

  const animatedProps = useAnimatedProps(() => {
    const progress = sliderValue.value / 100;
    const lettersCount = Math.floor(progress * myText.length);

    return {
      text: myText.slice(0, lettersCount),
    };
  });

  const arrayOfImageUrls = [
    'dogs',
    'cats',
    'horses',
    'parrots',
    'chickens',
    'ducks',
    'rabbits',
    'bunnies',
    'squirrels',
    'foxes',
    'home',
    'people',
    'karolina',
    'puppy',
    'kitten',
    'penguin',
    'panda',
    'koala',
    'tiger',
    'lion',
    'elephant',
    'random',
  ];

  const AnimatedTextInput = Animated.createAnimatedComponent(TextInput) as any;

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[StyleSheet.absoluteFill, { top: 50, left: 100, zIndex: 999 }]}
        pointerEvents="none"
      >
        <FontAwesome6 name="heart" size={50} color={colors.primary} />
      </View>
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
          <Text style={styles.headerTitle}>Library</Text>
          <PrimaryButton
            title="Collapse content"
            onPress={async () => {
              setIsCollapsed(!isCollapsed);
            }}
          />
          <Collapsible collapsed={isCollapsed}>
            <View style={styles.buttonContainer}>
              <PrimaryButton
                title="Show Notification"
                onPress={async () => {
                  await notifee.displayNotification({
                    title: 'Вас ктось лайкнув!',
                    body: 'Це ваша кохана - Каролінка',
                    android: {
                      channelId: 'default',
                      pressAction: {
                        id: 'default',
                      },
                    },
                  });
                }}
              />
              <PrimaryButton
                title="On//Off Flashlight"
                onPress={async () => {
                  await NativeFlashlight.toggleFlashlight(!on);
                  setOn(!on);
                }}
              />
              <PrimaryButton
                title="Go to Users"
                onPress={async () => {
                  navigation.navigate('Users');
                }}
              />
              <PrimaryButton
                title="Go to Camera"
                onPress={async () => {
                  navigation.navigate('Camera');
                }}
              />
              <PrimaryButton
                title="Go to Video"
                onPress={async () => {
                  navigation.navigate('Video');
                }}
              />
              <CustomSlider
                minimumValue={0}
                maximumValue={100}
                isVertical={false}
                sharedValue={sliderValue}
              />
              <AnimatedTextInput
                editable={false}
                animatedProps={animatedProps}
                style={styles.headerTitle}
              />
            </View>
            {imageUrl && (
              <View
                style={{
                  width: '100%',
                  height: 240,
                  borderRadius: 16,
                  overflow: 'hidden',
                }}
              >
                <Image
                  source={{ uri: imageUrl }}
                  indicator={Progress.CircleSnail}
                  indicatorProps={{
                    size: 80,
                    borderWidth: 1,
                    borderRadius: 80,
                    borderColor: colors.button,
                    color: colors.button,
                  }}
                  style={{
                    width: '100%',
                    height: 240,
                  }}
                />
              </View>
            )}
            <PrimaryButton
              title="Update Image"
              onPress={async () => {
                setImageUrl(
                  `https://loremflickr.com/640/480/${arrayOfImageUrls[Math.floor(Math.random() * arrayOfImageUrls.length - 1)]}?cacheBust=${Date.now()}`,
                );
              }}
              style={{ marginVertical: 10 }}
            />
          </Collapsible>
        </View>
        <TopBanner slides={topBannerSlides} />
        {Object.keys(booksByGenre).length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Books not found</Text>
          </View>
        ) : (
          Object.entries(booksByGenre).map(([genre, genreBooks]) => (
            <GenreSection
              key={genre}
              genre={genre}
              books={genreBooks}
              onBookPress={handleBookPress}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    minHeight: '75%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: 'column',
    gap: 8,
  },
  emptyText: {
    ...fonts.h1,
    color: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContainer: {
    paddingBottom: 24,
  },
  header: {
    paddingVertical: 28,
    paddingHorizontal: 16,
  },
  headerTitle: {
    ...fonts.h1,
    height: 40,
    color: colors.primary,
  },
});

export default Sentry.wrap(MainScreen);
