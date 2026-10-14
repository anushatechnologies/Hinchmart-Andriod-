import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { firebaseConfig } from '../../config/firebase';

interface FirebaseRecaptchaModalProps {
  visible: boolean;
  phoneNumber: string;
  onSuccess: (verificationId: string) => void;
  onError: (errorMessage: string) => void;
  onClose: () => void;
}

const ANDROID_CHROME_USER_AGENT =
  'Mozilla/5.0 (Linux; Android 14; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.127 Mobile Safari/537.36';

export function FirebaseRecaptchaModal({
  visible,
  phoneNumber,
  onSuccess,
  onError,
  onClose,
}: FirebaseRecaptchaModalProps) {
  const webViewRef = useRef<WebView>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      // 50-second timeout to allow human completion of interactive reCAPTCHA puzzles on Wi-Fi
      timeoutRef.current = setTimeout(() => {
        onError(
          'Verification timed out. If you are on a restricted Wi-Fi, please try switching to mobile data and try again.'
        );
        onClose();
      }, 50000);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [visible, onError, onClose]);

  if (!visible) return null;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Security Verification</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: #FFFFFF;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      overflow: hidden;
      position: relative;
    }
    #loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 20px;
      text-align: center;
      z-index: 1;
    }
    .spinner {
      width: 42px;
      height: 42px;
      border: 3.5px solid #F1F5F9;
      border-top-color: #E01E26;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 16px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .status-title {
      font-size: 15px;
      font-weight: 600;
      color: #0F172A;
      margin-bottom: 6px;
    }
    .status-desc {
      font-size: 13px;
      color: #64748B;
      line-height: 18px;
      max-width: 280px;
    }
    #recaptcha-container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10;
    }
  </style>
  <script>
    function post(data) {
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
      }
    }
    function onScriptLoadError(libName) {
      post({
        type: 'ERROR',
        message: 'Could not load ' + libName + '. Please check your internet connection.',
        code: 'auth/network-request-failed'
      });
    }
    window.onerror = function(msg, url, line) {
      post({
        type: 'ERROR',
        message: 'Script error: ' + msg,
        code: 'auth/script-error'
      });
    };
    window.onunhandledrejection = function(event) {
      post({
        type: 'ERROR',
        message: 'Promise error: ' + (event.reason ? (event.reason.message || event.reason) : 'Unknown'),
        code: 'auth/promise-error'
      });
    };
  </script>
  <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js" onerror="onScriptLoadError('Firebase SDK')"></script>
  <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js" onerror="onScriptLoadError('Firebase Auth')"></script>
</head>
<body>
  <div id="loading-container">
    <div class="spinner"></div>
    <div class="status-title" id="status-title">Verifying device security...</div>
    <div class="status-desc" id="status-desc">Please complete the verification challenge if prompted by Google.</div>
  </div>
  <div id="recaptcha-container"></div>
  <script>
    try {
      if (typeof firebase === 'undefined' || !firebase.auth) {
        post({
          type: 'ERROR',
          message: 'Firebase library not loaded. Please check your internet connection.',
          code: 'auth/sdk-not-loaded'
        });
      } else {
        const config = ${JSON.stringify(firebaseConfig)};
        if (!firebase.apps.length) {
          firebase.initializeApp(config);
        }

        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
          size: 'invisible',
          callback: function(token) {
            document.getElementById('status-title').innerText = 'Sending OTP...';
            document.getElementById('status-desc').innerText = 'Please wait while we send the verification code to your phone.';
            post({ type: 'SOLVED' });
          },
          'expired-callback': function() {
            post({
              type: 'ERROR',
              message: 'Verification expired. Please try again.',
              code: 'auth/captcha-expired'
            });
          }
        });

        post({ type: 'SENDING' });

        firebase.auth().signInWithPhoneNumber("${phoneNumber}", window.recaptchaVerifier)
          .then(function(confirmationResult) {
            post({
              type: 'SUCCESS',
              verificationId: confirmationResult.verificationId
            });
          })
          .catch(function(error) {
            post({
              type: 'ERROR',
              message: error.message,
              code: error.code
            });
          });
      }
    } catch(e) {
      post({
        type: 'ERROR',
        message: e.message || 'Verification initialization failed',
        code: 'auth/init-exception'
      });
    }
  </script>
</body>
</html>
`;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'SENDING' || data.type === 'SOLVED') {
        // In progress
      } else if (data.type === 'SUCCESS') {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        onSuccess(data.verificationId);
      } else if (data.type === 'ERROR') {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        let errorMsg = data.message || 'Verification failed. Please try again.';
        if (data.code === 'auth/invalid-phone-number') {
          errorMsg = 'Invalid mobile number. Please check and try again.';
        } else if (data.code === 'auth/too-many-requests') {
          errorMsg = 'Too many requests. Please wait a few minutes before trying again.';
        } else if (data.code === 'auth/quota-exceeded') {
          errorMsg = 'SMS quota reached. Please try again later.';
        } else if (data.code === 'auth/captcha-check-failed') {
          errorMsg = 'Security check failed. Please try again.';
        } else if (data.code === 'auth/network-request-failed') {
          errorMsg = 'Network error. Please check your internet connection or try switching to mobile data.';
        }
        onError(errorMsg);
        onClose();
      }
    } catch (e) {
      console.warn('Phone auth message parse error:', e);
    }
  };

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const modalWidth = Math.min(screenWidth - 32, 380);
  const modalHeight = Math.min(screenHeight - 100, 540);

  const RNWebView = WebView as any;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { width: modalWidth, height: modalHeight }]}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons name="shield-checkmark" size={18} color="#0038A8" style={styles.headerIcon} />
              <Text style={styles.headerTitle}>Security Verification</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.closeBtn}
              accessibilityLabel="Cancel security verification"
            >
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={styles.webViewWrap}>
            <RNWebView
              ref={webViewRef}
              source={{
                html: htmlContent,
                baseUrl: `https://${firebaseConfig.authDomain}`,
              }}
              onMessage={handleMessage}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              thirdPartyCookiesEnabled={true}
              sharedCookiesEnabled={true}
              scalesPageToFit={true}
              mixedContentMode="always"
              originWhitelist={['*']}
              userAgent={Platform.OS === 'android' ? ANDROID_CHROME_USER_AGENT : undefined}
              style={styles.webView}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  webViewWrap: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

