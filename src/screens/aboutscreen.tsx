import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

import { Flashlight, Sparkles } from 'lucide-react-native';

import { COLORS } from '../theme';

const AboutScreen = () => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* App Identity */}
      <View style={styles.hero}>
        <View style={styles.logoBox}>
          <Flashlight size={48} color={COLORS.yellow} strokeWidth={1.8} />
        </View>

        <Text style={styles.appName}>LUMEN</Text>

        <Text style={styles.tagline}>Light, Made Simple.</Text>
      </View>

      {/* About Text */}
      <View style={styles.content}>
        <Text style={styles.heading}>About Lumen</Text>

        <Text style={styles.description}>
          Lumen is a simple and intuitive flashlight application designed to
          make everyday lighting quick and effortless.
        </Text>

        <Text style={styles.description}>
          With easy controls, adjustable brightness and a clean interface, Lumen
          puts essential lighting features right at your fingertips.
        </Text>
      </View>

      {/* Features */}
      <View style={styles.featureSection}>
        <View style={styles.sectionHeading}>
          <Sparkles size={20} color={COLORS.yellow} />
          <Text style={styles.featureHeading}>Designed for Simplicity</Text>
        </View>

        <Text style={styles.featureText}>
          A minimal experience focused on convenience, clarity and ease of use.
        </Text>
      </View>

      {/* Developer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Designed & Developed by</Text>

        <Text style={styles.developer}>Summyia Fatima</Text>

        {/* App Version */}
        <Text style={styles.version}>Version 1.0.0</Text>

        <View style={styles.divider} />

        <Text style={styles.copyright}>
          Made with care. Built for everyday use.
        </Text>
      </View>
    </ScrollView>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
  },

  hero: {
    alignItems: 'center',
    paddingVertical: 25,
  },

  logoBox: {
    width: 105,
    height: 105,
    borderRadius: 30,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: '#39302A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  appName: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 2,
  },

  tagline: {
    color: COLORS.mutedDark,
    fontSize: 15,
    marginTop: 7,
    letterSpacing: 1,
  },

  content: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 23,
    marginBottom: 18,
  },

  heading: {
    color: COLORS.text,
    fontSize: 23,
    fontWeight: '700',
    marginBottom: 15,
  },

  description: {
    color: COLORS.muted,
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 12,
  },

  featureSection: {
    backgroundColor: '#1B1C22',
    borderRadius: 22,
    padding: 22,
    marginBottom: 25,
  },

  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },

  featureHeading: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
  },

  featureText: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 24,
  },

  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },

  footerText: {
    color: COLORS.mutedDark,
    fontSize: 14,
  },

  developer: {
    color: COLORS.yellow,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 8,
  },

  version: {
    color: COLORS.mutedDark,
    fontSize: 13,
    marginTop: 6,
    letterSpacing: 0.5,
  },

  divider: {
    width: 45,
    height: 2,
    backgroundColor: COLORS.yellow,
    marginVertical: 18,
  },

  copyright: {
    color: COLORS.mutedDark,
    fontSize: 12,
  },
});
