import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import PrimaryButton from '../../src/components/buttons/Button';
import { Text, TouchableOpacity } from 'react-native';

describe('Button', () => {
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

  it('renders correctly with text', () => {
    act(() => {
      renderer = ReactTestRenderer.create(<PrimaryButton text="Click Me" onPress={mockOnPress} />);
    });

    expect(renderer).toBeTruthy();
    expect(renderer!.toJSON()).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    act(() => {
      renderer = ReactTestRenderer.create(<PrimaryButton text="Click Me" onPress={mockOnPress} />);
    });

    const instance = renderer!.root;
    const touchables = instance.findAllByType(TouchableOpacity);
    expect(touchables.length).toBeGreaterThan(0);

    const touchable = touchables[0];
    act(() => {
      touchable.props.onPress();
    });

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('does not crash when onPress is not provided', () => {
    act(() => {
      renderer = ReactTestRenderer.create(<PrimaryButton text="Click Me" />);
    });

    const instance = renderer!.root;
    const touchables = instance.findAllByType(TouchableOpacity);
    expect(touchables.length).toBeGreaterThan(0);

    const touchable = touchables[0];
    expect(() => {
      act(() => {
        touchable.props.onPress?.();
      });
    }).not.toThrow();
  });

  it('displays correct text', () => {
    act(() => {
      renderer = ReactTestRenderer.create(<PrimaryButton text="Click Me" onPress={mockOnPress} />);
    });

    const instance = renderer!.root;
    const texts = instance.findAllByType(Text);
    expect(texts.length).toBeGreaterThan(0);

    const text = texts.find(t => t.props.children === 'Click Me');
    expect(text).toBeTruthy();
    expect(text?.props.children).toBe('Click Me');
  });
});
