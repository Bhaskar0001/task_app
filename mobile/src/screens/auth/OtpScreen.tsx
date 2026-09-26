import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { FontSize } from '../../constants/spacing';
import { Button } from '../../components/Button';
import { authService } from '../../services/auth.service';
import { useAuth } from '../../hooks/useAuth';

export const OtpScreen = ({ route, navigation }: any) => {
  const { email } = route.params;
  const { login } = useAuth();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [countdown]);

  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 300);
  }, []);

  const handleChange = (text: string, index: number) => {
    setError('');
    const newOtp = [...otp];
    
    // Handle paste
    if (text.length === 6) {
      const chars = text.split('');
      setOtp(chars);
      inputRefs.current[5]?.focus();
      return;
    }
    
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-advance
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    return `${name.charAt(0)}*****@${domain}`;
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length < 6) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.verifyOtp(email, otpString);
      const token = response.token || response.data?.token;
      const user = response.user || response.data?.user;
      if (!token || !user) {
        throw new Error('Failed to retrieve authentication token.');
      }
      await login(token, user);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid or expired code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setLoading(true);
    setError('');
    try {
      await authService.sendOtp(email);
      setCountdown(60);
    } catch (err: any) {
      setError('Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.heading}>Verify email</Text>
          <Text style={styles.description}>
            We sent a verification code to{'\n'}
            <Text style={styles.emailText}>{maskEmail(email)}</Text>
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                style={[styles.otpInput, error ? styles.otpInputError : null]}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={6}
                selectTextOnFocus
              />
            ))}
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button
            title="Verify"
            onPress={handleVerify}
            loading={loading}
            disabled={otp.join('').length < 6 || loading}
            style={styles.verifyButton}
          />

          <View style={styles.resendContainer}>
            {countdown > 0 ? (
              <Text style={styles.resendText}>
                Resend code in <Text style={styles.timerText}>00:{countdown.toString().padStart(2, '0')}</Text>
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResend} disabled={loading}>
                <Text style={styles.resendLink}>Resend code</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.changeEmailButton}>
          <Text style={styles.changeEmailText}>Change email</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  backButton: {
    marginBottom: 24,
  },
  backText: {
    fontSize: 28,
    color: Colors.text,
  },
  content: {
    flex: 1,
  },
  heading: {
    fontSize: 28,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 32,
  },
  emailText: {
    color: Colors.text,
    fontWeight: '500',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  otpInput: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: Colors.white,
    color: Colors.text,
  },
  otpInputError: {
    borderColor: Colors.danger,
  },
  errorText: {
    color: Colors.danger,
    fontSize: FontSize.sm,
    marginBottom: 16,
    textAlign: 'center',
  },
  verifyButton: {
    marginBottom: 24,
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  timerText: {
    color: Colors.text,
    fontWeight: '500',
  },
  resendLink: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: '500',
  },
  changeEmailButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  changeEmailText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
