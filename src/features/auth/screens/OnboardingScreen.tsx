/**
 * HINCH MART — Onboarding Screen with Carousel & Reanimated Page Indicators
 */
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../../theme';
import { ONBOARDING_SLIDES } from '../../../constants/app';
import { Button } from '../../../components/ui/Button';
import { useAppDispatch } from '../../../redux/hooks';
import { setOnboardingComplete } from '../../../redux/slices/authSlice';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SLIDE_EMOJIS = ['🏗️', '🤝', '📊'];

export function OnboardingScreen({ navigation }: any) {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    dispatch(setOnboardingComplete());
    navigation.replace('Login');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TouchableOpacity onPress={handleFinish} style={styles.skipBtn}>
        <Text style={[styles.skipText, { color: theme.colors.textSecondary }]}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentIndex(index);
        }}
        renderItem={({ item, index }) => (
          <View style={styles.slideContainer}>
            <View style={[styles.imagePlaceholder, { backgroundColor: theme.colors.primaryLight }]}>
              <Text style={{ fontSize: 72 }}>{SLIDE_EMOJIS[index]}</Text>
            </View>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{item.title}</Text>
            <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
              {item.description}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.footer}>
        <View style={styles.indicatorRow}>
          {ONBOARDING_SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                {
                  backgroundColor:
                    index === currentIndex ? theme.colors.primary : theme.colors.border,
                  width: index === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <Button
          title={currentIndex === ONBOARDING_SLIDES.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          size="lg"
          variant={currentIndex === ONBOARDING_SLIDES.length - 1 ? 'primary' : 'navy'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipBtn: {
    position: 'absolute',
    top: 50,
    right: 24,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  slideContainer: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    paddingHorizontal: 32,
    justifyContent: 'center',
    marginTop: 60,
  },
  imagePlaceholder: {
    width: 220,
    height: 220,
    borderRadius: 110,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
