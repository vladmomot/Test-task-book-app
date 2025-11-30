import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import BackButton from '../../src/components/buttons/BackButton';
import { TouchableOpacity } from 'react-native';

const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      goBack: mockGoBack,
    }),
  };
});

describe('BackButton', () => {
  const mockOnPress = jest.fn();
  let renderer: ReactTestRenderer.ReactTestRenderer | null = null;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (renderer) {
      act(() => {
        renderer!.unmount();
      });
      renderer = null;
    }
  });

  it('renders correctly', () => {
    act(() => {
      renderer = ReactTestRenderer.create(<BackButton />);
    });

    expect(renderer).toBeTruthy();
    expect(renderer!.toJSON()).toBeTruthy();
  });

  it('calls custom onPress when provided', () => {
    act(() => {
      renderer = ReactTestRenderer.create(<BackButton onPress={mockOnPress} />);
    });

    const instance = renderer!.root;
    const touchables = instance.findAllByType(TouchableOpacity);
    expect(touchables.length).toBeGreaterThan(0);

    const touchable = touchables[0];
    act(() => {
      touchable.props.onPress();
    });

    expect(mockOnPress).toHaveBeenCalledTimes(1);
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('navigates back when pressed', () => {
    act(() => {
      renderer = ReactTestRenderer.create(<BackButton />);
    });

    const instance = renderer!.root;
    const touchables = instance.findAllByType(TouchableOpacity);
    expect(touchables.length).toBeGreaterThan(0);

    const touchable = touchables[0];
    act(() => {
      touchable.props.onPress();
    });

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
