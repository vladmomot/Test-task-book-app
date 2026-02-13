import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  RefreshControl,
  Button,
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
          <Text style={styles.headerTitle}>Library</Text>
          <Button
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
          <Button
            title="On//Off Flashlight"
            onPress={async () => {
              await NativeFlashlight.toggleFlashlight(!on);
              setOn(!on);
            }}
          />
          <Button
            title="Go to Users"
            onPress={async () => {
              navigation.navigate('Users');
            }}
          />
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
    color: colors.primary,
  },
});

export default Sentry.wrap(MainScreen);
