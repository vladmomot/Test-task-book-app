/**
 * @format
 */
import ReactTestRenderer, { act } from 'react-test-renderer';
import App from '../App';

// Mock react-native-toast-message
jest.mock('react-native-toast-message', () => {
  const React = require('react');
  const { View } = require('react-native');

  function MockToast() {
    return React.createElement(View, { testID: 'toast' });
  }

  MockToast.show = jest.fn();
  MockToast.hide = jest.fn();

  return {
    __esModule: true,
    default: MockToast,
  };
});

test('renders correctly', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | null = null;

  jest.useFakeTimers();

  await act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });

  expect(renderer).toBeTruthy();
  expect(renderer!.toJSON()).toBeTruthy();

  act(() => {
    jest.runOnlyPendingTimers();
  });

  jest.clearAllTimers();

  if (renderer) {
    act(() => {
      renderer!.unmount();
    });
  }

  jest.useRealTimers();
});
