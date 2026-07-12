import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView, Image, ActivityIndicator } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import useAuthStore from '../../store/useAuthStore';
import { colors } from '../../theme/colors';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    const success = await login(email.trim(), password);
    if (!success) {
      Alert.alert('Login Failed', useAuthStore.getState().error || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Image source={require('../../assets/logo.png')} style={{width: 140, height: 140}} resizeMode="contain" />
          </View>
          <Text style={styles.appName}>digiStaff</Text>
          <Text style={styles.tagline}>Enterprise Orchestration System</Text>
        </View>

        {/* Login Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign In</Text>
          <Text style={styles.cardSubtitle}>Enter your credentials to access your workspace.</Text>
          
          {/* Email Input */}
          <Text style={styles.inputLabel}>Email or Phone Number</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="alternate-email" size={20} color={colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="name@company.com"
              placeholderTextColor="#A0A0A0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={styles.passwordHeader}>
            <Text style={styles.inputLabel}>Password</Text>
            <TouchableOpacity><Text style={styles.forgotLink}>Forgot Password?</Text></TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color={colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#A0A0A0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Feather name={showPassword ? "eye" : "eye-off"} size={20} color={colors.textLight} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.signInBtn} onPress={() => handleLogin()} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={colors.card} />
            ) : (
              <>
                <Text style={styles.signInBtnText}>Sign In</Text>
                <MaterialIcons name="login" size={20} color={colors.card} style={{ marginLeft: 8 }} />
              </>
            )}
          </TouchableOpacity>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <View style={styles.infoIconWrapper}>
              <Feather name="info" size={20} color={colors.primary} />
            </View>
            <View style={styles.infoTextWrapper}>
              <Text style={styles.infoTitle}>TEST CREDENTIALS (PWD: 111111)</Text>
              <Text style={styles.infoDesc}>• admin@company.com</Text>
              <Text style={styles.infoDesc}>• telecaller@company.com</Text>
              <Text style={styles.infoDesc}>• video@company.com</Text>
              <Text style={styles.infoDesc}>• social@company.com</Text>
              <Text style={styles.infoDesc}>• developer@company.com</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            New to TaskFlow? <Text style={styles.contactLink}>Contact Administrator</Text>
          </Text>
          <View style={styles.footerLinks}>
            <Text style={styles.footerSubText}>Security Policy</Text>
            <Text style={styles.footerSubText}>Compliance</Text>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: 20, flexGrow: 1, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 20, marginTop: 40 },
  logoBox: { marginBottom: -15, alignItems: 'center', justifyContent: 'center' },
  appName: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 6 },
  tagline: { fontSize: 14, color: colors.textLight },
  card: { backgroundColor: colors.card, padding: 24, borderRadius: 16, borderWidth: 1, borderColor: colors.border, elevation: 1 },
  cardTitle: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 8 },
  cardSubtitle: { fontSize: 14, color: colors.textLight, marginBottom: 24, lineHeight: 20 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 8, backgroundColor: colors.card, marginBottom: 20 },
  inputIcon: { padding: 12 },
  input: { flex: 1, paddingVertical: 12, fontSize: 15, color: colors.text },
  eyeIcon: { padding: 12 },
  passwordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  forgotLink: { fontSize: 13, fontWeight: '600', color: colors.primary, marginBottom: 8 },
  signInBtn: { backgroundColor: colors.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 8, marginTop: 10, marginBottom: 24 },
  signInBtnText: { color: colors.card, fontSize: 16, fontWeight: '700' },
  infoBox: { flexDirection: 'row', borderTopWidth: 1, borderColor: colors.border, paddingTop: 24 },
  infoIconWrapper: { backgroundColor: colors.roles.admin.bg, padding: 10, borderRadius: 8, marginRight: 16, alignSelf: 'flex-start' },
  infoTextWrapper: { flex: 1 },
  infoTitle: { fontSize: 11, fontWeight: '700', color: colors.text, letterSpacing: 0.5, marginBottom: 6 },
  infoDesc: { fontSize: 13, color: colors.textLight, lineHeight: 20 },
  footer: { alignItems: 'center', marginTop: 30 },
  footerText: { fontSize: 14, color: colors.textLight, marginBottom: 16 },
  contactLink: { color: colors.primary, fontWeight: '600' },
  footerLinks: { flexDirection: 'row', gap: 24 },
  footerSubText: { fontSize: 12, color: colors.textLight },
  mockContainer: { marginTop: 40, borderTopWidth: 1, borderColor: colors.border, paddingTop: 20 },
  mockTitle: { textAlign: 'center', marginBottom: 10, color: colors.textLight },
  mockBtn: { padding: 8, borderRadius: 6 },
  mockBtnText: { color: colors.card, fontWeight: '600', fontSize: 12 }
});
