import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

type Props = {
  title: string;
};

const AppHeader: React.FC<Props> = ({ title }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.brand}>LUMEN</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 2,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#191A20',
    paddingBottom: 10,

  },
  brand: {
    color: COLORS.yellow,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
  },
  title: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '600',
   
  }
});
