import React, { useCallback, useEffect, useState } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  NativeModules,
  Alert,
  Platform,
} from 'react-native';

import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Slider from '@react-native-community/slider';
import { Power, Sun, Megaphone } from 'lucide-react-native';

import { COLORS } from '../theme';
import AdBanner from '../components/AdBanner';

type TorchScreenProps = {
  sound: boolean;
  haptics: boolean;
};

const { FlashlightModule } = NativeModules;

const MODES = [
  { id: 0, label: 'SOS' },
  { id: 1, label: '∞' },
  { id: 2, label: '1' },
  { id: 3, label: '2' },
  { id: 4, label: '3' },
  { id: 5, label: '4' },
  { id: 6, label: '5' },
  { id: 7, label: '6' },
  { id: 8, label: '7' },
  { id: 9, label: '8' },
];

const SOS_PATTERN = [
  [true, 300],
  [false, 300],
  [true, 300],
  [false, 300],
  [true, 300],
  [false, 700],

  [true, 700],
  [false, 300],
  [true, 700],
  [false, 300],
  [true, 700],
  [false, 700],

  [true, 300],
  [false, 300],
  [true, 300],
  [false, 300],
  [true, 300],
  [false, 1000],
] as const;

const TorchScreen: React.FC<TorchScreenProps> = ({ sound, haptics }) => {
  const [torchOn, setTorchOn] = useState(false);
  const [blinkMode, setBlinkMode] = useState(1);

  const applyTorch = useCallback(async (value: boolean) => {
    try {
      if (!FlashlightModule?.setTorch) {
        console.log('FlashlightModule.setTorch is not available');
        return;
      }

      await FlashlightModule.setTorch(value);
    } catch (error) {
      console.log('Torch error:', error);
    }
  }, []);

  const requestCameraPermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.log('Camera permission error:', error);
      return false;
    }
  };

  const handleTorchToggle = async () => {
    if (!torchOn) {
      const hasPermission = await requestCameraPermission();

      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Camera permission is required to use the flashlight.',
        );
        return;
      }
    }

    const newValue = !torchOn;

    setTorchOn(newValue);

    if (sound && FlashlightModule?.playToggleSound) {
      try {
        FlashlightModule.playToggleSound(newValue);
      } catch (error) {
        console.log('Sound error:', error);
      }
    }

    if (haptics) {
      ReactNativeHapticFeedback.trigger('impactHeavy', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
    }
  };

  const handleModeSelect = (mode: number) => {
    setBlinkMode(mode);

    if (haptics) {
      ReactNativeHapticFeedback.trigger('impactLight', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
    }
  };

  // Flashlight mode effect
  useEffect(() => {
    if (!torchOn) {
      applyTorch(false);
      return;
    }

    // Infinity mode: continuous light
    if (blinkMode === 1) {
      applyTorch(true);

      return () => {
        applyTorch(false);
      };
    }

    let timeout: ReturnType<typeof setTimeout>;
    let cancelled = false;

    // SOS mode
    if (blinkMode === 0) {
      let index = 0;

      const runSOS = () => {
        if (cancelled) {
          return;
        }

        const [light, duration] = SOS_PATTERN[index];

        applyTorch(light);

        index = (index + 1) % SOS_PATTERN.length;

        timeout = setTimeout(runSOS, duration);
      };

      runSOS();

      return () => {
        cancelled = true;
        clearTimeout(timeout);
        applyTorch(false);
      };
    }

    // Speed modes: 1 to 8
    const speed = blinkMode - 1;
    const interval = Math.max(125, 1000 / speed);

    let lightState = true;

    applyTorch(true);

    const runBlink = () => {
      if (cancelled) {
        return;
      }

      lightState = !lightState;
      applyTorch(lightState);

      timeout = setTimeout(runBlink, interval);
    };

    timeout = setTimeout(runBlink, interval);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      applyTorch(false);
    };
  }, [torchOn, blinkMode, applyTorch]);

  // Turn flashlight off when leaving this screen
  useEffect(() => {
    return () => {
      applyTorch(false);
    };
  }, [applyTorch]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>LUMEN</Text>
          <Text style={styles.subtitle}>Light up your way</Text>
        </View>

        <View style={styles.sunIcon}>
          <Sun size={23} color={COLORS.yellow} />
        </View>
      </View>

      {/* Power Button */}
      <View style={styles.powerSection}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleTorchToggle}
          style={[styles.powerButton, torchOn && styles.powerButtonActive]}
        >
          <Power
            size={65}
            color={torchOn ? COLORS.background : COLORS.mutedDark}
            strokeWidth={2}
          />
        </TouchableOpacity>

        <Text style={styles.powerStatus}>
          {torchOn ? 'FLASHLIGHT ON' : 'FLASHLIGHT OFF'}
        </Text>

        <Text style={styles.powerHint}>
          {torchOn ? 'Your light is on' : 'Tap the button to turn on'}
        </Text>
      </View>

      {/* Mode Selection */}
      <View style={styles.section}>
        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Flash Modes</Text>
          <Text style={styles.sectionDescription}>
            Select your preferred mode
          </Text>
        </View>

        <View style={styles.modeContainer}>
          {MODES.map(mode => (
            <TouchableOpacity
              key={mode.id}
              activeOpacity={0.75}
              onPress={() => handleModeSelect(mode.id)}
              style={[
                styles.modeButton,
                blinkMode === mode.id && styles.modeButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.modeText,
                  blinkMode === mode.id && styles.modeTextActive,
                ]}
              >
                {mode.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Speed Control */}
      <View style={styles.section}>
        <View style={styles.speedHeader}>
          <View>
            <Text style={styles.sectionTitle}>Blink Speed</Text>
            <Text style={styles.sectionDescription}>
              Adjust your flashing speed
            </Text>
          </View>

          <Text style={styles.speedValue}>
            {blinkMode === 0
              ? 'SOS'
              : blinkMode === 1
              ? '∞'
              : `${blinkMode - 1}`}
          </Text>
        </View>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={9}
          step={1}
          value={blinkMode}
          onValueChange={value => handleModeSelect(value)}
          minimumTrackTintColor={COLORS.yellow}
          maximumTrackTintColor={COLORS.secondaryCard}
          thumbTintColor={COLORS.yellow}
        />

        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>SOS</Text>
          <Text style={styles.sliderLabel}>Continuous</Text>
          <Text style={styles.sliderLabel}>Fast</Text>
        </View>
      </View>

      {/* Sound Effects Card */}
      <View style={styles.soundCard}>
        <View style={styles.soundIcon}>
          <Megaphone size={21} color={COLORS.yellow} />
        </View>

        <View style={styles.soundContent}>
          <Text style={styles.soundTitle}>Sound Effects</Text>
          <Text style={styles.soundDescription}>
            {sound ? 'Sound effects are enabled' : 'Sound effects are disabled'}
          </Text>
        </View>

        <View style={[styles.statusDot, sound && styles.statusDotActive]} />
      </View>

      {/* Footer */}
      <Text style={styles.footer}>LUMEN • Light up your way</Text>

      {/* AdMob Test Banner */}
      <AdBanner />
    </ScrollView>
  );
};

export default TorchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 25,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 35,
  },

  appName: {
    color: COLORS.text,
    fontSize: 25,
    fontWeight: '800',
    letterSpacing: 2,
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 4,
  },

  sunIcon: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },

  powerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },

  powerButton: {
    width: 175,
    height: 175,
    borderRadius: 100,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.secondaryCard,
    elevation: 8,
  },

  powerButtonActive: {
    backgroundColor: COLORS.yellow,
    borderColor: COLORS.yellow,
    elevation: 18,
    shadowColor: COLORS.yellow,
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },

  powerStatus: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 25,
  },

  powerHint: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 7,
  },

  section: {
    marginBottom: 28,
  },

  sectionHeading: {
    marginBottom: 15,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },

  sectionDescription: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 5,
  },

  modeContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },

  modeButton: {
    width: '17%',
    height: 43,
    borderRadius: 12,
    backgroundColor: COLORS.secondaryCard,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modeButtonActive: {
    backgroundColor: COLORS.yellow,
  },

  modeText: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: '700',
  },

  modeTextActive: {
    color: COLORS.background,
  },

  speedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  speedValue: {
    color: COLORS.yellow,
    fontSize: 18,
    fontWeight: '800',
  },

  slider: {
    width: '100%',
    height: 45,
    marginTop: 10,
  },

  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  sliderLabel: {
    color: COLORS.mutedDark,
    fontSize: 10,
  },

  soundCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  soundIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: COLORS.secondaryCard,
    alignItems: 'center',
    justifyContent: 'center',
  },

  soundContent: {
    flex: 1,
    marginLeft: 13,
  },

  soundTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
  },

  soundDescription: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 4,
  },

  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 10,
    backgroundColor: COLORS.mutedDark,
  },

  statusDotActive: {
    backgroundColor: '#4ADE80',
  },

  footer: {
    color: COLORS.mutedDark,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 25,
    marginBottom: 5,
  },
});
