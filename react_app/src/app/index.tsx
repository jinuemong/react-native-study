
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  content: {
    alignItems: 'center',
    marginBottom: 40,
  },
  message: {
    fontSize: 16,
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export function AuthenticatorScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>인증기</Text>
      <View style={styles.content}>
        <Text style={styles.message}>에서 로그인 시도 중입니다</Text>
        <Text style={styles.location}>sample_location</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>거부</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>승인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
