import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import mobileAds, {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';

import { COLORS } from '../theme';

const AdBanner = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    mobileAds()
      .initialize()
      .then(() => {
        if (mounted) {
          setIsReady(true);
        }
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
          unitId={TestIds.BANNER}
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
    borderRadius: 15,
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
