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
import Animated, {
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import Gallery from '@/components/gallery';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const MainScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [topBannerSlides, setTopBannerSlides] = useState<TopBannerSlide[]>([]);
  const [booksByGenre, setBooksByGenre] = useState<Record<string, Book[]>>({});
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [on, setOn] = useState<boolean>(false);

  useEffect(() => {
    loadData();
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
        await updateData();
        loadData();
      });
    } catch {
      setRefreshing(false);
    }
    setRefreshing(false);
  };

  const sliderValue = useSharedValue(50);

  let myText = 'Я люблю тебе понад усе на світі моя кохана <3';

  const animatedProps = useAnimatedProps(() => {
    const progress = sliderValue.value / 100;
    const lettersCount = Math.floor(progress * myText.length);

    return {
      text: myText.slice(0, lettersCount),
    };
  });

  const AnimatedTextInput = Animated.createAnimatedComponent(TextInput) as any;

  return (
    <SafeAreaView style={styles.container}>
      <Gallery />
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
          <AnimatedTextInput
            editable={false}
            animatedProps={animatedProps}
            style={styles.headerTitle}
          />
          <CustomSlider
            minimumValue={0}
            maximumValue={100}
            isVertical={false}
            sharedValue={sliderValue}
            style={{ marginTop: 10 }}
          />
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
          </View>
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
