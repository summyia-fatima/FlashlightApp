import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

import { COLORS } from '../theme';

type Props = {
  title: string;
  subtitle: string;
  value: boolean;
  onChange: (value: boolean) => void;
  icon: React.ReactNode;
};

const SettingSwitch: React.FC<Props> = ({
  title,
  subtitle,
  value,
  onChange,
  icon,
}) => {
  return (
    <View style={styles.row}>
      <View style={styles.iconBox}>{icon}</View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{
          false: '#45454B',
          true: COLORS.yellow,
        }}
        thumbColor={value ? '#493600' : '#D5D0C5'}
      />
    </View>
  );
};

export default SettingSwitch;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#14151B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 4,
  },
});
