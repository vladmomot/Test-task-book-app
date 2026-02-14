import {
  useQuery,
  useMutation,
  useQueryClient,
  queryOptions,
} from '@tanstack/react-query';
import { getUsers, createUser, deleteUser } from '@/services/api';
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
//import { NativeStackNavigationProp } from '@react-navigation/native-stack';
//import { RootStackParamList } from '@/types';
import { colors, fonts } from '@/theme';
import { randomString } from 'zod/v4/core/util.cjs';
import PrimaryButton from '@/components/buttons/Button';
import BackButton from '@/components/buttons/BackButton';
import styled from 'styled-components/native';
//type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Users'>;
import StyledButtonPrimary from '@/components/buttons/StyledPrimaryButton';

const UsersScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const usersQueryOptions = () =>
    queryOptions({
      queryKey: ['users'],
      queryFn: getUsers,
    });

  const { data: users, isPending, isError } = useQuery(usersQueryOptions());

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error) {
      if (__DEV__) {
        console.error('Error refreshing data:', error);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleCreateUser = async () => {
    try {
      await createUserMutation.mutateAsync({
        id: Math.floor(Math.random() * 1000000),
        name:
          [
            'Моя кохана',
            'Мій котусик',
            'Мое сонечко',
            'Моя булочка',
            'Мій всесвіт',
          ][Math.floor(Math.random() * 5)] + ' Каролінка',
        email: randomString(10) + '@example.com',
        phone:
          '+380' +
          Math.floor(Math.random() * 1000000000)
            .toString()
            .padStart(9, '0'),
      });
    } catch (error) {
      if (__DEV__) {
        console.error('Error creating user:', error);
      }
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUserMutation.mutateAsync(id);
    } catch (error) {
      if (__DEV__) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const StyledButton = styled(PrimaryButton).attrs<{ $rotate?: string }>(
    props => ({
      title: props.title || 'Default Title',
      onPress: props.onPress || (() => {}),
      $rotate: props.$rotate || '3deg',
    }),
  )`
    background-color: #ff6f91;
    margin: 10px;
    transform: rotate(${props => props.$rotate});
  `;

  const StyledButtonProps = styled(PrimaryButton)<{ $primary?: boolean }>`
    background-color: ${props => (props.$primary ? '#BF4F74' : '#d3d3d3')};
    height: ${props => (props.$primary ? 40 : 20)}px;
    margin-bottom: 10px;
    color: 'red';
    border-radius: 30px;
  `;

  // Дополнение для React
  /*
      &:hover {
      color: red; // <Button> when hovered
    }

    & ~ & {
      background: tomato; // <Button> as a sibling of <Button>, but maybe not directly next to it
    }

    & + & {
      background: lime; // <Button> next to <Button>
    }

    &.something {
      background: orange; // <Button> tagged with an additional CSS class ".something"
    }

    .something-else & {
      border: 1px solid; // <Button> inside another element labeled ".something-else"
    } 
   */

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
          <BackButton />
          <StyledButtonProps
            title="Go to Main"
            onPress={() => {}}
            textStyle={{ color: colors.primary, fontSize: 20 }}
          />
          <StyledButtonProps $primary title="Go to Main" onPress={() => {}} />
          <StyledButtonPrimary title="Secondary" variant="secondary" />
          <StyledButtonPrimary title="Outline" variant="outline" />
          <View style={styles.buttonContainer}>
            <StyledButton title="Create User" onPress={handleCreateUser} />
            <StyledButton
              title="Delete random user"
              onPress={() => {
                if (users && users.length > 0) {
                  const randomUser =
                    users[Math.floor(Math.random() * users.length)];
                  handleDeleteUser(randomUser.id);
                }
              }}
              $rotate="-3deg"
            />
          </View>
        </View>
        <View style={styles.header}>
          {isError ? (
            <Text style={styles.userText}>Error loading users</Text>
          ) : isPending ? (
            <Text style={styles.emailText}>Loading...</Text>
          ) : (
            <View>
              {users?.map(user => (
                <View key={user.id} style={{ alignItems: 'center' }}>
                  <Text style={styles.userText}>{user.name}</Text>
                  <Text style={styles.emailText}>{user.email}</Text>
                  <Text style={styles.phoneText}>{user.phone}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
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
    paddingBottom: 24,
  },
  header: {
    paddingVertical: 28,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: 'column',
    gap: 8,
  },
  headerTitle: {
    ...fonts.h1,
    color: colors.primary,
  },
  userText: {
    ...fonts.h1,
    color: '#EE5A24',
  },
  emailText: {
    ...fonts.authorName,
    color: '#F79F1F',
  },
  phoneText: {
    ...fonts.authorName,
    color: '#FFC312',
  },
});

export default UsersScreen;
