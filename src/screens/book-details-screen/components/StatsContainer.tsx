import React from 'react';
import { View, StyleSheet } from 'react-native';
import StatItem from './StatItem';

interface StatData {
  value: string;
  label: string;
}

interface StatsContainerProps {
  stats: StatData[];
}

const StatsContainer: React.FC<StatsContainerProps> = ({ stats }) => {
  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <StatItem key={index} value={stat.value} label={stat.label} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default StatsContainer;

