import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

import {
  Power,
  Zap,
  SlidersHorizontal,
  Volume2,
  Vibrate,
  Share2,
  Siren,
  Sun,
} from 'lucide-react-native';

import { COLORS, SPACING } from '../theme';

type Props = {
  onFinish: () => void;
  showAdBeforeThird: (onDone: () => void) => void;
};

const pages = [
  {
    id: '1',
    title: 'Light Up Your Way',
    description:
      'Turn your phone into a powerful flashlight with just one tap.',
    icon: Power,
    features: [
      { icon: Power, text: 'One-tap flashlight control' },
      { icon: Sun, text: 'Simple and easy interface' },
    ],
  },
  {
    id: '2',
    title: 'Explore Flash Modes',
    description:
      'Choose different blinking modes and adjust the speed as you like.',
    icon: Zap,
    features: [
      { icon: Siren, text: 'SOS and multiple blinking modes' },
      { icon: SlidersHorizontal, text: 'Adjustable blinking speed' },
    ],
  },
  {
    id: '3',
    title: 'Make It Your Own',
    description:
      'Customize your flashlight experience and share LUMEN with friends.',
    icon: Sun,
    features: [
      { icon: Volume2, text: 'Sound effects' },
      { icon: Vibrate, text: 'Vibration feedback' },
      { icon: Share2, text: 'Share app with friends' },
    ],
  },
];

const OnboardingScreen: React.FC<Props> = ({ onFinish, showAdBeforeThird }) => {
  const { width } = useWindowDimensions();

  const listRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [thirdUnlocked, setThirdUnlocked] = useState(false);
  const adRunning = useRef(false);

  const goToPage = (index: number) => {
    listRef.current?.scrollToOffset({
      offset: width * index,
      animated: true,
    });
  };

  const unlockThird = () => {
    if (thirdUnlocked || adRunning.current) {
      return;
    }

    adRunning.current = true;

    listRef.current?.scrollToOffset({
      offset: width,
      animated: false,
    });

    setCurrentIndex(1);

    showAdBeforeThird(() => {
      setThirdUnlocked(true);
      adRunning.current = false;
      setCurrentIndex(2);

      requestAnimationFrame(() => {
        goToPage(2);
      });
    });
  };

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);

    if (index === 2 && !thirdUnlocked) {
      unlockThird();
      return;
    }

    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex === 0) {
      goToPage(1);
    } else if (currentIndex === 1) {
      unlockThird();
    } else {
      onFinish();
    }
  };

  const renderPage = ({ item }: { item: (typeof pages)[number] }) => {
    const MainIcon = item.icon;

    return (
      <View style={[styles.page, { width }]}>
        <View style={styles.pageContent}>
          <View style={styles.illustrationArea}>
            <View style={styles.outerCircle}>
              <View style={styles.innerCircle}>
                <MainIcon size={65} color={COLORS.yellow} strokeWidth={1.7} />
              </View>
            </View>

            <View style={styles.glowDot} />
            <View style={styles.glowDotTwo} />
          </View>

          <Text style={styles.title}>{item.title}</Text>

          <Text style={styles.description}>{item.description}</Text>

          <View style={styles.featureList}>
            {item.features.map((feature, index) => {
              const FeatureIcon = feature.icon;

              return (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <FeatureIcon size={19} color={COLORS.yellow} />
                  </View>

                  <Text style={styles.featureText}>{feature.text}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.brandIcon}>
          <Power size={20} color={COLORS.yellow} />
        </View>

        <Text style={styles.brandName}>LUMEN</Text>
      </View>

      <FlatList
        ref={listRef}
        data={pages}
        renderItem={renderPage}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        bounces={false}
        overScrollMode="never"
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        scrollEventThrottle={16}
        nestedScrollEnabled={false}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {pages.map((page, index) => (
            <View
              key={page.id}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
        </View>

        <View style={styles.bottomArea}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex === 2 ? 'Get Started' : 'Continue'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.bottomText}>
            {currentIndex === 2
              ? 'Your light, your way.'
              : 'Swipe to explore LUMEN'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },

  header: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  brandIcon: {
    width: 35,
    height: 35,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  brandName: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 3,
  },

  page: {
    flex: 1,
    paddingHorizontal: SPACING.screen,
    justifyContent: 'center',
    alignItems: 'center',
  },

  pageContent: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
  },

  illustrationArea: {
    width: '100%',
    height: 165,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  outerCircle: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: '#252319',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#51431B',
  },

  innerCircle: {
    width: 112,
    height: 112,
    borderRadius: 70,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.yellow,
  },

  glowDot: {
    position: 'absolute',
    top: 8,
    right: '23%',
    width: 12,
    height: 12,
    borderRadius: 10,
    backgroundColor: COLORS.yellow,
  },

  glowDotTwo: {
    position: 'absolute',
    bottom: 12,
    left: '22%',
    width: 8,
    height: 8,
    borderRadius: 10,
    backgroundColor: COLORS.yellow,
  },

  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 9,
  },

  description: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 310,
    marginBottom: 17,
  },

  featureList: {
    width: '100%',
    gap: 10,
  },

  featureItem: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: COLORS.secondaryCard,
  },

  featureIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.secondaryCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  featureText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },

  footer: {
    paddingBottom: 8,
  },

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 10,
    backgroundColor: COLORS.secondaryCard,
  },

  activeDot: {
    width: 25,
    backgroundColor: COLORS.yellow,
  },

  bottomArea: {
    paddingHorizontal: SPACING.screen,
    paddingBottom: 5,
  },

  nextButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },

  nextButtonText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: '800',
  },

  bottomText: {
    color: COLORS.mutedDark,
    textAlign: 'center',
    fontSize: 11,
    marginTop: 9,
  },
});
