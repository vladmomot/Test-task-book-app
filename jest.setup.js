/* eslint-env jest */
// Set __DEV__ for tests
global.__DEV__ = true;

// Mock react-native-bootsplash
jest.mock('react-native-bootsplash', () => ({
  hide: jest.fn(() => Promise.resolve()),
  show: jest.fn(() => Promise.resolve()),
  getVisibilityStatus: jest.fn(() => Promise.resolve('hidden')),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  return {
    default: {
      View: View,
      Value: jest.fn(),
      event: jest.fn(),
      add: jest.fn(),
      eq: jest.fn(),
      set: jest.fn(),
      cond: jest.fn(),
      interpolate: jest.fn(),
      Extrapolate: { EXTEND: 'extend', IDENTITY: 'identity', CLAMP: 'clamp' },
      Transition: {
        Together: 'Together',
        OutIn: 'OutIn',
        InOut: 'InOut',
      },
    },
    View: View,
    Value: jest.fn(),
    event: jest.fn(),
    add: jest.fn(),
    eq: jest.fn(),
    set: jest.fn(),
    cond: jest.fn(),
    interpolate: jest.fn(),
    Extrapolate: { EXTEND: 'extend', IDENTITY: 'identity', CLAMP: 'clamp' },
    Transition: {
      Together: 'Together',
      OutIn: 'OutIn',
      InOut: 'InOut',
    },
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    useAnimatedScrollHandler: jest.fn(() => jest.fn()),
    withTiming: jest.fn(),
    withSpring: jest.fn(),
    withRepeat: jest.fn(),
    withSequence: jest.fn(),
    runOnJS: jest.fn(fn => fn),
    runOnUI: jest.fn(fn => fn),
  };
});

// Mock Firebase
jest.mock('@react-native-firebase/app', () => ({
  getApp: jest.fn(() => ({
    name: '[DEFAULT]',
  })),
}));

jest.mock('@react-native-firebase/remote-config', () => ({
  getRemoteConfig: jest.fn(() => ({
    // Mock remote config instance
  })),
  fetchAndActivate: jest.fn(() => Promise.resolve(true)),
  getValue: jest.fn(() => ({
    asString: jest.fn(() =>
      JSON.stringify({ books: [], top_banner_slides: [], you_will_like_section: [] }),
    ),
  })),
  setDefaults: jest.fn(),
  setConfigSettings: jest.fn(),
}));

// Mock react-native-toast-message
jest.mock('react-native-toast-message', () => {
  const React = require('react');
  const { View } = require('react-native');
  function MockToast(props) {
    return React.createElement(View, { testID: 'toast' });
  }
  MockToast.show = jest.fn();
  MockToast.hide = jest.fn();
  return MockToast;
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => inset,
  };
});

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const RN = require('react-native');
  return {
    GestureHandlerRootView: RN.View,
    Swipeable: RN.View,
    DrawerLayout: RN.View,
    State: {},
    ScrollView: RN.ScrollView,
    Slider: RN.View,
    Switch: RN.View,
    TextInput: RN.TextInput,
    ToolbarAndroid: RN.View,
    ViewPagerAndroid: RN.View,
    DrawerLayoutAndroid: RN.View,
    TouchableOpacity: RN.TouchableOpacity,
    TouchableHighlight: RN.TouchableHighlight,
    TouchableWithoutFeedback: RN.TouchableWithoutFeedback,
    TouchableNativeFeedback: RN.TouchableNativeFeedback,
    TouchableBounce: RN.View,
    BorderlessButton: RN.View,
    RectButton: RN.View,
    BaseButton: RN.View,
    FlatList: RN.FlatList,
    gestureHandlerRootHOC: jest.fn(component => component),
    Directions: {},
  };
});

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockNavigationContainer = ({ children }) =>
    React.createElement(View, { testID: 'navigation-container' }, children);
  return {
    ...jest.requireActual('@react-navigation/native'),
    NavigationContainer: MockNavigationContainer,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      setOptions: jest.fn(),
      replace: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

// Mock @react-navigation/native-stack
jest.mock('@react-navigation/native-stack', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockNavigator = ({ children }) =>
    React.createElement(View, { testID: 'stack-navigator' }, children);
  const MockScreen = ({ component: Component }) =>
    Component ? React.createElement(Component) : null;
  return {
    createNativeStackNavigator: () => ({
      Navigator: MockNavigator,
      Screen: MockScreen,
    }),
  };
});
