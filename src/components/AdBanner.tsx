import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

// actual ad unit ID import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

import mobileAds, {
  BannerAd,
  BannerAdSize,
} from 'react-native-google-mobile-ads';

// test ad unit ID import { TestIds } from 'react-native-google-mobile-ads';

// import mobileAds, {
//   BannerAd,
//   BannerAdSize,
//   TestIds,
// } from 'react-native-google-mobile-ads';

import { COLORS } from '../theme';

// actual ad unit ID

const BANNER_AD_UNIT_ID = 'ca-app-pub-2192277706609111/8857560924';

// test ad unit ID

// const BANNER_AD_UNIT_ID = __DEV__
//   ? TestIds.BANNER
//   : 'ca-app-pub-2192277706609111/8857560924';

const AdBanner: React.FC = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    mobileAds()
      .initialize()
      .then(() => {
        if (mounted) setIsReady(true);
      })
      .catch(error => {
        console.log('AdMob initialization error:', error);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.adLabel}>ADVERTISEMENT</Text>

      {isReady && (
        <BannerAd
          unitId={BANNER_AD_UNIT_ID}
          size={BannerAdSize.BANNER}
          onAdLoaded={() => console.log('Banner loaded')}
          onAdFailedToLoad={error => console.log('Banner failed:', error)}
        />
      )}
    </View>
  );
};

export default AdBanner;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingVertical: 12,
    marginTop: 25,
    marginBottom: 15,
    overflow: 'hidden',
  },
  adLabel: {
    color: COLORS.mutedDark,
    fontSize: 9,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
});
