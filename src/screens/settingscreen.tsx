import React from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  ScrollView,
  Pressable,
  Share,
  Alert,
} from 'react-native';

import {
  Volume2,
  Vibrate,
  Share2,
  Users,
  ChevronRight,
} from 'lucide-react-native';

import { COLORS } from '../theme';

type Props = {
  sound: boolean;
  haptics: boolean;
  onSoundChange: (value: boolean) => void;
  onHapticsChange: (value: boolean) => void;
};

const SettingsScreen = ({
  sound,
  haptics,
  onSoundChange,
  onHapticsChange,
}: Props) => {
  const handleShareApp = async () => {
    try {
      await Share.share({
        message:
          'Check out LUMEN – Light, Made Simple! A simple and intuitive flashlight app.',
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share the app.');
    }
  };

  const handleInviteFriend = async () => {
    try {
      await Share.share({
        message:
          'Hey! I am using LUMEN, a simple flashlight app. Give it a try!',
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to send invitation.');
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* Main Heading */}
      <Text style={styles.heading}>Settings</Text>

      <Text style={styles.subtitle}>Customize your experience.</Text>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <Text style={styles.sectionSubtitle}>Manage your app experience</Text>

        <View style={styles.card}>
          {/* Sound Effects */}
          <View style={styles.settingRow}>
            <View style={styles.iconBox}>
              <Volume2 size={23} color={COLORS.yellow} />
            </View>

            <View style={styles.textBox}>
              <Text style={styles.title}>Sound Effects</Text>
              <Text style={styles.description}>
                Play sound when toggling torch
              </Text>
            </View>

            <Switch
              value={sound}
              onValueChange={onSoundChange}
              trackColor={{
                false: '#45454B',
                true: COLORS.yellow,
              }}
              thumbColor={sound ? '#493600' : '#D5D0C5'}
            />
          </View>

          <View style={styles.divider} />

          {/* Vibration */}
          <View style={styles.settingRow}>
            <View style={styles.iconBox}>
              <Vibrate size={23} color={COLORS.yellow} />
            </View>

            <View style={styles.textBox}>
              <Text style={styles.title}>Vibration</Text>
              <Text style={styles.description}>
                Vibrate when pressing buttons
              </Text>
            </View>

            <Switch
              value={haptics}
              onValueChange={onHapticsChange}
              trackColor={{
                false: '#45454B',
                true: COLORS.yellow,
              }}
              thumbColor={haptics ? '#493600' : '#D5D0C5'}
            />
          </View>
        </View>
      </View>

      {/* Stay Connected Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stay Connected</Text>

        <Text style={styles.sectionSubtitle}>
          Share LUMEN with your friends
        </Text>

        <View style={styles.card}>
          {/* Share App */}
          <Pressable style={styles.actionRow} onPress={handleShareApp}>
            <View style={styles.iconBox}>
              <Share2 size={22} color={COLORS.yellow} />
            </View>

            <View style={styles.textBox}>
              <Text style={styles.title}>Share App</Text>
              <Text style={styles.description}>Share LUMEN with others</Text>
            </View>

            <ChevronRight size={20} color={COLORS.mutedDark} />
          </Pressable>

          <View style={styles.divider} />

          {/* Invite Friend */}
          <Pressable style={styles.actionRow} onPress={handleInviteFriend}>
            <View style={styles.iconBox}>
              <Users size={22} color={COLORS.yellow} />
            </View>

            <View style={styles.textBox}>
              <Text style={styles.title}>Invite a Friend</Text>
              <Text style={styles.description}>
                Let your friends discover LUMEN
              </Text>
            </View>

            <ChevronRight size={20} color={COLORS.mutedDark} />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
    paddingBottom: 35,
  },

  heading: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: '700',
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 15,
    marginTop: 7,
    marginBottom: 28,
  },

  section: {
    marginBottom: 25,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  sectionSubtitle: {
    color: COLORS.mutedDark,
    fontSize: 13,
    marginTop: 5,
    marginBottom: 14,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    paddingHorizontal: 17,
    paddingVertical: 8,
  },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 17,
    gap: 13,
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    gap: 13,
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#14151B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textBox: {
    flex: 1,
  },

  title: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },

  description: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 5,
  },

  divider: {
    height: 1,
    backgroundColor: '#34353C',
  },
});
