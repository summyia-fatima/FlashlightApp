import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// actual ad unit ID

import mobileAds, {
  AdEventType,
  InterstitialAd,
} from 'react-native-google-mobile-ads';

// test ad unit ID

// import mobileAds, {
//   InterstitialAd,
//   AdEventType,
//   TestIds,
// } from 'react-native-google-mobile-ads';


import AppHeader from './src/components/appheader';
import BottomNavigation, { TabName } from './src/components/bottomnavigation';
import AboutScreen from './src/screens/aboutscreen';
import OnboardingScreen from './src/screens/onboardingscreen';
import SettingsScreen from './src/screens/settingscreen';
import TorchScreen from './src/screens/torchscreen';
import { COLORS } from './src/theme';

// actual ad unit ID

const INTERSTITIAL_AD_UNIT_ID = 'ca-app-pub-2192277706609111/6231397582';
const interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID);

// test ad unit ID

// const INTERSTITIAL_AD_UNIT_ID = __DEV__
//   ? TestIds.INTERSTITIAL
//   : 'ca-app-pub-2192277706609111/6231397582';

// const interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID);


const App = () => {
  const [activeTab, setActiveTab] = useState<TabName>('Torch');
  const [sound, setSound] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);

  const adLoadedRef = useRef(false);
  const pendingAdCallback = useRef<(() => void) | null>(null);

  const finishAdFlow = useCallback(() => {
    const callback = pendingAdCallback.current;
    pendingAdCallback.current = null;
    callback?.();
  }, []);

  useEffect(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        adLoadedRef.current = true;
        console.log('Interstitial loaded');
      },
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        adLoadedRef.current = false;
        finishAdFlow();
        interstitial.load();
      },
    );

    const unsubscribeError = interstitial.addAdEventListener(
      AdEventType.ERROR,
      error => {
        console.log('Interstitial error:', error);
        adLoadedRef.current = false;
        finishAdFlow();
        interstitial.load();
      },
    );

    mobileAds()
      .initialize()
      .then(() => interstitial.load())
      .catch(error => console.log('AdMob initialization error:', error));

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, [finishAdFlow]);

  const showAdBeforeThird = useCallback(
    (onDone: () => void) => {
      if (!adLoadedRef.current) {
        console.log('Interstitial not ready. Continuing onboarding.');
        onDone();
        return;
      }

      pendingAdCallback.current = onDone;
      adLoadedRef.current = false;

      interstitial.show().catch(error => {
        console.log('Interstitial show error:', error);
        finishAdFlow();
        interstitial.load();
      });
    },
    [finishAdFlow],
  );

  const renderScreen = () => {
    switch (activeTab) {
      case 'Torch':
        return <TorchScreen sound={sound} haptics={haptics} />;
      case 'Settings':
        return (
          <SettingsScreen
            sound={sound}
            haptics={haptics}
            onSoundChange={setSound}
            onHapticsChange={setHaptics}
          />
        );
      case 'About':
        return <AboutScreen />;
      default:
        return <TorchScreen sound={sound} haptics={haptics} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {showOnboarding ? (
        <OnboardingScreen
          onFinish={() => setShowOnboarding(false)}
          showAdBeforeThird={showAdBeforeThird}
        />
      ) : (
        <>
          <AppHeader title={activeTab} />
          <View style={styles.content}>{renderScreen()}</View>
          <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </>
      )}
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
