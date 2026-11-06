import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { Flashlight, SlidersHorizontal, Info } from 'lucide-react-native';

import { COLORS } from '../theme';

export type TabName = 'Torch' | 'Settings' | 'About';

type Props = {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
};

const BottomNavigation: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { name: 'Torch' as TabName, Icon: Flashlight },
    { name: 'Settings' as TabName, Icon: SlidersHorizontal },
    { name: 'About' as TabName, Icon: Info },
  ];

  return (
    <View style={styles.container}>
      {tabs.map(({ name, Icon }) => {
        const active = activeTab === name;

        return (
          <TouchableOpacity
            key={name}
            style={styles.tab}
            activeOpacity={0.7}
            onPress={() => onTabChange(name)}
          >
            <Icon
              size={24}
              color={active ? COLORS.yellow : COLORS.muted}
              strokeWidth={active ? 2 : 1.5}
            />

            <Text style={[styles.label, active && styles.activeLabel]}>
              {name.toUpperCase()}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({
  container: {
    height: 80,
    backgroundColor: COLORS.bottom,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#191A20',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.muted,
    letterSpacing: 0.5,
  },
  activeLabel: {
    color: COLORS.yellow,
  },
});
