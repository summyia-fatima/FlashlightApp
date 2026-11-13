import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Alert,
} from 'react-native';

const PRIVACY_POLICY_URL =
  'https://sites.google.com/view/flashlight-privacy-policy98/home';

const PrivacyPolicyLink = () => {
  const openPrivacyPolicy = async () => {
    try {
      await Linking.openURL(PRIVACY_POLICY_URL);
    } catch (error) {
      Alert.alert('Error', 'Unable to open Privacy Policy. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openPrivacyPolicy} activeOpacity={0.7}>
        <Text style={styles.linkText}>Privacy Policy</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },

  linkText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default PrivacyPolicyLink;
