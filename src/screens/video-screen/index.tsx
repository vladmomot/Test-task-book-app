import PrimaryButton from '@/components/buttons/Button';
import { colors } from '@/theme';
import React, { useState, useCallback, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import YoutubePlayer, {
  PLAYER_STATES,
  YoutubeIframeRef,
} from 'react-native-youtube-iframe';

const VideoScreen: React.FC = () => {
  const playerRef = useRef<YoutubeIframeRef>(null);
  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state: PLAYER_STATES) => {
    console.log(state);
    if (state === 'ended') {
      setPlaying(false);
    }
  }, []);

  const togglePlaying = useCallback(() => {
    console.log(playerRef.current?.getCurrentTime());
    setPlaying(prev => {
      console.log('toggle', !prev);
      return !prev;
    });
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: 100, backgroundColor: colors.background }}
    >
      <YoutubePlayer
        ref={playerRef}
        play={playing}
        height={300}
        playList={'PLUbVnDiskj_UI2pQqguc286QMpD0u9h3l'}
        onChangeState={onStateChange}
        forceAndroidAutoplay={true}
      />
      <PrimaryButton
        title={playing ? 'Pause' : 'Play'}
        onPress={togglePlaying}
      />
    </SafeAreaView>
  );
};

export default VideoScreen;
