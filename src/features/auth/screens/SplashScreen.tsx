/**
 * HINCH MART — Premium Animated Splash Screen & Brand Experience
 * Enhanced with radial gradient, shimmer progress, stagger animations
 */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '../../../theme';
import { useAppSelector } from '../../../redux/hooks';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CATEGORIES = [
  { icon: '🏗️', label: 'Steel & Cement' },
  { icon: '🧱', label: 'Bricks & Blocks' },
  { icon: '🏠', label: 'Roofing' },
  { icon: '🚰', label: 'Plumbing' },
  { icon: '🪟', label: 'Windows & Doors' },
  { icon: '🎨', label: 'Paints & Finishes' },
  { icon: '🛠️', label: 'Tools & Hardware' },
];

export function SplashScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { isAuthenticated, hasCompletedOnboarding } = useAppSelector((state) => state.auth);

  // Animations
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const progress = useSharedValue(0);
  const pulseGlow = useSharedValue(0.6);
  const shimmerX = useSharedValue(-1);

  // Category stagger values
  const catScales = CATEGORIES.map(() => useSharedValue(0));

  useEffect(() => {
    // Logo entrance
    logoScale.value = withSpring(1, { damping: 14, stiffness: 80 });
    logoOpacity.value = withTiming(1, { duration: 600 });

    // Text & categories reveal
    textOpacity.value = withDelay(350, withTiming(1, { duration: 500 }));

    // Category stagger
    catScales.forEach((sv, i) => {
      sv.value = withDelay(500 + i * 80, withSpring(1, { damping: 12, stiffness: 120 }));
    });

    // Progress bar fill
    progress.value = withTiming(1, { duration: 2400, easing: Easing.out(Easing.quad) });

    // Shimmer on progress bar
    shimmerX.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      false
    );

    // Pulse glow animation
    pulseGlow.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Auto-navigate after splash sequence
    const timer = setTimeout(() => {
      if (!hasCompletedOnboarding) {
        navigation.replace('Onboarding');
      } else if (!isAuthenticated) {
        navigation.replace('Login');
      } else {
        navigation.replace('MainTabs');
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulseGlow.value, [0.6, 1], [0.3, 0.7]),
    transform: [{ scale: interpolate(pulseGlow.value, [0.6, 1], [0.96, 1.06]) }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(shimmerX.value, [-1, 1], [-100, SCREEN_WIDTH]) }],
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Subtle radial gradient background */}
      <LinearGradient
        colors={['#FFFFFF', '#FFF8E1', '#FFFFFF']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Ambient Background Accent */}
      <Animated.View
        style={[
          styles.ambientGlow,
          { backgroundColor: theme.colors.primary },
          glowStyle,
        ]}
      />

      {/* Central Official Brand Logo Image */}
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <Image
          source={require('../../../../assets/logo.png')}
          style={styles.logoImage}
          contentFit="contain"
        />

        {/* Subtitle Divider */}
        <View style={styles.dividerRow}>
          <LinearGradient
            colors={['transparent', '#FDB913']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.dividerGradient}
          />
          <Text style={styles.taglineText}>EVERYTHING FOR EVERY CONSTRUCTION</Text>
          <LinearGradient
            colors={['#FDB913', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.dividerGradient}
          />
        </View>
      </Animated.View>

      {/* Category Icons Strip — with stagger */}
      <Animated.View style={[styles.categoriesContainer, textAnimatedStyle]}>
        <View style={styles.categoriesRow}>
          {CATEGORIES.map((cat, idx) => {
            const catAnimStyle = useAnimatedStyle(() => ({
              transform: [{ scale: catScales[idx].value }],
              opacity: catScales[idx].value,
            }));
            return (
              <Animated.View key={idx} style={[styles.categoryBadge, catAnimStyle]}>
                <Text style={styles.categoryEmoji}>{cat.icon}</Text>
              </Animated.View>
            );
          })}
        </View>
      </Animated.View>

      {/* Bottom Loading Progress & Slogan */}
      <Animated.View style={[styles.bottomSection, textAnimatedStyle]}>
        <Text style={styles.sloganText}>BUILD BETTER. LIVE BETTER.</Text>
        <Text style={styles.subSloganText}>ONE STOP. ALL SOLUTIONS.</Text>

        {/* Enhanced Progress Bar with shimmer */}
        <View style={styles.progressBarTrack}>
          <Animated.View style={[styles.progressBarFill, progressAnimatedStyle]}>
            <Animated.View style={[styles.shimmerOverlay, shimmerStyle]} />
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  ambientGlow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.12,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  logoImage: {
    width: SCREEN_WIDTH * 0.8,
    height: 160,
    marginBottom: 16,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
    width: '100%',
  },
  dividerGradient: {
    flex: 1,
    height: 1.5,
  },
  taglineText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#152238',
    letterSpacing: 1.5,
    marginHorizontal: 10,
    textTransform: 'uppercase',
  },
  categoriesContainer: {
    marginTop: 24,
    marginBottom: 40,
  },
  categoriesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(253, 185, 19, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FDB913',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryEmoji: {
    fontSize: 18,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 50,
    left: 32,
    right: 32,
    alignItems: 'center',
  },
  sloganText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#152238',
    letterSpacing: 2,
    marginBottom: 2,
  },
  subSloganText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FDB913',
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  progressBarTrack: {
    width: SCREEN_WIDTH - 80,
    height: 5,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FDB913',
    borderRadius: 3,
    overflow: 'hidden',
    shadowColor: '#FDB913',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 3,
  },
});
