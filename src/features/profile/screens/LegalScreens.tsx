/**
 * HINCH MART — Legal & Support Screens
 * - Privacy Policy Screen (Fetches https://api.hinchmart.com/api/content/privacy-policy)
 * - Help & Support Screen (support@hinchmart.com & Call Us Now +91 8388899999)
 * - About HINCH MART Screen (Clean structural layout)
 * - Terms & Conditions Screen (Clean structural layout)
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { useTheme } from '../../../theme';
import { Screen, Header } from '../../../components/layout/Screen';
import { Card } from '../../../components/ui/Card';

interface PolicySection {
  title?: string;
  heading?: string;
  content?: string | string[];
  body?: string;
  bullets?: string[];
}

interface PolicyData {
  title?: string;
  effectiveDate?: string;
  company?: string;
  app?: string;
  website?: string;
  contactEmail?: string;
  sections?: PolicySection[];
  copyright?: string;
  content?: string;
}

// ==========================================
// 1. PRIVACY POLICY SCREEN
// ==========================================
export function PrivacyPolicyScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [policyData, setPolicyData] = useState<PolicyData | string | null>(null);
  const [error, setError] = useState(false);

  const fetchPrivacyPolicy = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await axios.get('https://api.hinchmart.com/api/content/privacy-policy', {
        timeout: 8000,
      });
      if (res.data) {
        const raw = res.data.data || res.data.content || res.data;
        setPolicyData(raw);
      } else {
        setPolicyData(null);
      }
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  const renderPolicyContent = () => {
    if (!policyData) {
      // Formatted Fallback Privacy Policy Text
      return (
        <View style={styles.policySections}>
          <Text style={[styles.sectionHeading, { color: theme.colors.navy }]}>
            1. Information We Collect
          </Text>
          <Text style={[styles.bodyText, { color: theme.colors.textSecondary }]}>
            HINCH MART collects information necessary to facilitate B2B construction transactions, including business profile details, GST/Tax IDs, contact numbers, delivery addresses, and payment references.
          </Text>

          <Text style={[styles.sectionHeading, { color: theme.colors.navy }]}>
            2. How We Use Your Data
          </Text>
          <Text style={[styles.bodyText, { color: theme.colors.textSecondary }]}>
            Your data is exclusively used for fulfilling purchase orders, processing custom RFQ quotations, delivering heavy building materials, communicating logistics updates, and ensuring platform security.
          </Text>

          <Text style={[styles.sectionHeading, { color: theme.colors.navy }]}>
            3. Information Sharing & Security
          </Text>
          <Text style={[styles.bodyText, { color: theme.colors.textSecondary }]}>
            We do not sell personal or enterprise data. Information is shared strictly with verified logistics partners and suppliers fulfilling your active construction orders under strict confidentiality.
          </Text>

          <Text style={[styles.sectionHeading, { color: theme.colors.navy }]}>
            4. Data Protection Rights
          </Text>
          <Text style={[styles.bodyText, { color: theme.colors.textSecondary }]}>
            You reserve the right to request access, correction, or deletion of your stored business account information at any time by contacting our support team at support@hinchmart.com.
          </Text>
        </View>
      );
    }

    // Case 1: Plain string content
    if (typeof policyData === 'string') {
      return <Text style={[styles.bodyText, { color: theme.colors.textPrimary }]}>{policyData}</Text>;
    }

    // Case 2: Object response with sections or fields
    const obj = policyData as PolicyData;
    const sections: PolicySection[] = Array.isArray(obj.sections) ? obj.sections : [];

    return (
      <View style={styles.policySections}>
        {obj.effectiveDate && (
          <Text style={[styles.cardHeaderSub, { color: theme.colors.textTertiary, marginBottom: 12 }]}>
            Effective Date: {String(obj.effectiveDate)}
          </Text>
        )}

        {obj.content && typeof obj.content === 'string' && (
          <Text style={[styles.bodyText, { color: theme.colors.textPrimary, marginBottom: 12 }]}>
            {obj.content}
          </Text>
        )}

        {sections.map((sec, idx) => {
          const titleText = sec.title || sec.heading || `Section ${idx + 1}`;
          const contentText = typeof sec.content === 'string'
            ? sec.content
            : Array.isArray(sec.content)
              ? sec.content.join('\n\n')
              : sec.body || '';

          return (
            <View key={idx} style={{ marginBottom: 14 }}>
              <Text style={[styles.sectionHeading, { color: theme.colors.navy }]}>{titleText}</Text>
              {Boolean(contentText) && (
                <Text style={[styles.bodyText, { color: theme.colors.textSecondary }]}>
                  {String(contentText)}
                </Text>
              )}
              {Array.isArray(sec.bullets) &&
                sec.bullets.map((b, i) => (
                  <Text key={i} style={[styles.bodyText, { color: theme.colors.textSecondary, marginLeft: 8, marginTop: 2 }]}>
                    • {String(b)}
                  </Text>
                ))}
            </View>
          );
        })}

        {obj.contactEmail && (
          <Text style={[styles.bodyText, { color: theme.colors.textPrimary, marginTop: 12 }]}>
            Contact: {String(obj.contactEmail)}
          </Text>
        )}

        {obj.copyright && (
          <Text style={[styles.cardHeaderSub, { color: theme.colors.textTertiary, marginTop: 14 }]}>
            {String(obj.copyright)}
          </Text>
        )}
      </View>
    );
  };

  return (
    <Screen scrollable={false}>
      <Header
        title="Privacy Policy"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollPadding} showsVerticalScrollIndicator={false}>
        <Card variant="outlined" style={styles.contentCard}>
          <View style={styles.cardHeaderRow}>
            <LinearGradient
              colors={[`${theme.colors.primary}20`, `${theme.colors.primary}08`]}
              style={styles.iconCircle}
            >
              <Ionicons name="shield-checkmark" size={22} color={theme.colors.primary} />
            </LinearGradient>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.cardHeaderTitle, { color: theme.colors.textPrimary }]}>
                {typeof policyData === 'object' && policyData?.title
                  ? String(policyData.title)
                  : 'HINCH MART Privacy Policy'}
              </Text>
              <Text style={[styles.cardHeaderSub, { color: theme.colors.textTertiary }]}>
                {typeof policyData === 'object' && policyData?.company
                  ? String(policyData.company)
                  : 'Official Privacy Terms'}
              </Text>
            </View>
          </View>

          {loading ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
                Loading Privacy Policy...
              </Text>
            </View>
          ) : (
            renderPolicyContent()
          )}

          {error && (
            <TouchableOpacity onPress={fetchPrivacyPolicy} style={styles.retryBtn}>
              <Ionicons name="refresh" size={16} color={theme.colors.primary} />
              <Text style={[styles.retryText, { color: theme.colors.primary }]}>Refresh Content</Text>
            </TouchableOpacity>
          )}
        </Card>
      </ScrollView>
    </Screen>
  );
}

// ==========================================
// 2. HELP & SUPPORT SCREEN
// ==========================================
export function HelpSupportScreen({ navigation }: any) {
  const { theme } = useTheme();

  const handleCall = () => {
    Linking.openURL('tel:+918388899999');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@hinchmart.com?subject=HINCH%20MART%20Support%20Inquiry');
  };

  return (
    <Screen scrollable>
      <Header title="Help & Support" showBack onBackPress={() => navigation.goBack()} />

      <View style={{ padding: 16 }}>
        {/* Support Call Card — Gradient */}
        <View style={styles.supportCardWrap}>
          <LinearGradient
            colors={['#152238', '#1A3050', '#223D60']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.supportCard}
          >
            <View style={styles.supportAccentStripe} />
            <View style={styles.supportHeaderRow}>
              <View style={styles.phoneIconCircle}>
                <Ionicons name="call" size={26} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.supportCardTitle}>Need Instant Assistance?</Text>
                <Text style={styles.supportCardSub}>Our B2B support desk is available 24/7</Text>
              </View>
            </View>

            <TouchableOpacity onPress={handleCall} style={styles.callNowBtn} activeOpacity={0.85}>
              <Ionicons name="call" size={18} color="#152238" />
              <Text style={styles.callNowBtnText}>Call Us Now: +91 8388899999</Text>
              <Ionicons name="arrow-forward" size={14} color="#152238" />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Email Support Card */}
        <Card variant="outlined" style={styles.optionCard}>
          <TouchableOpacity onPress={handleEmail} style={styles.optionRow} activeOpacity={0.7}>
            <View style={[styles.optionIconCircle, { backgroundColor: '#3B82F618' }]}>
              <Ionicons name="mail" size={22} color="#3B82F6" />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[styles.optionTitle, { color: theme.colors.textPrimary }]}>Email Support</Text>
              <Text style={[styles.optionDetail, { color: theme.colors.textSecondary }]}>support@hinchmart.com</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
          </TouchableOpacity>
        </Card>

        {/* FAQs Option Card */}
        <Card variant="outlined" style={styles.optionCard}>
          <TouchableOpacity onPress={() => navigation.navigate('FAQ')} style={styles.optionRow} activeOpacity={0.7}>
            <View style={[styles.optionIconCircle, { backgroundColor: '#F59E0B18' }]}>
              <Ionicons name="help-circle" size={22} color="#F59E0B" />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[styles.optionTitle, { color: theme.colors.textPrimary }]}>Frequently Asked Questions</Text>
              <Text style={[styles.optionDetail, { color: theme.colors.textSecondary }]}>Orders, payments & delivery answers</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
          </TouchableOpacity>
        </Card>
      </View>
    </Screen>
  );
}

// ==========================================
// 3. ABOUT HINCH MART SCREEN
// ==========================================
export function AboutScreen({ navigation }: any) {
  const { theme } = useTheme();

  return (
    <Screen scrollable>
      <Header title="About HINCH MART" showBack onBackPress={() => navigation.goBack()} />

      <View style={{ padding: 16 }}>
        <Card variant="outlined" style={styles.aboutCard}>
          {/* Gold accent stripe */}
          <View style={styles.aboutAccentStripe} />
          <View style={styles.aboutLogoBox}>
            <Image
              source={require('../../../../assets/logo.png')}
              style={{ width: 180, height: 48 }}
              contentFit="contain"
            />
            <View style={styles.aboutDivider}>
              <View style={[styles.aboutDividerLine, { backgroundColor: theme.colors.primary }]} />
            </View>
            <Text style={[styles.tagline, { color: theme.colors.textSecondary }]}>
              "EVERYTHING FOR EVERY CONSTRUCTION"
            </Text>
            <View style={[styles.versionPill, { backgroundColor: `${theme.colors.primary}14` }]}>
              <Ionicons name="information-circle" size={13} color={theme.colors.primary} />
              <Text style={[styles.versionChip, { color: theme.colors.primary }]}>
                Version 1.0.0 (Build 1)
              </Text>
            </View>
          </View>
        </Card>

        {/* Mission & Overview */}
        <Card variant="outlined" style={{ padding: 16, marginTop: 14, borderRadius: 16 }}>
          <Text style={[styles.sectionHeading, { color: theme.colors.navy, marginTop: 0 }]}>
            🏗️ Who We Are
          </Text>
          <Text style={[styles.bodyText, { color: theme.colors.textSecondary, marginTop: 4 }]}>
            HINCH MART is an international B2B marketplace engineered exclusively for the global construction industry. We bridge certified building material manufacturers, heavy equipment rental fleets, and infrastructure contractors across verified trade corridors.
          </Text>

          <Text style={[styles.sectionHeading, { color: theme.colors.navy, marginTop: 16 }]}>
            ⭐ Core Platform Pillars
          </Text>
          {[
            { title: 'Mill-Certified Supplies', desc: 'Direct sourcing of TMT rebar, OPC/PPC cement, structural beams, and MEP piping.' },
            { title: 'Heavy Fleet Rentals', desc: 'On-demand dispatch of 20-Ton excavators, tower cranes, loaders, and backup power generators.' },
            { title: 'Custom RFQ Procurement', desc: 'Post exact BOQ requirements and receive competitive bids within 24 hours.' },
            { title: 'B2B Escrow Protection', desc: 'Secure payment settlement via Letters of Credit, Escrow transfers, and enterprise credit.' },
          ].map((item, idx) => (
            <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 10, gap: 10 }}>
              <Ionicons name="shield-checkmark" size={16} color={theme.colors.primary} style={{ marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 13, color: theme.colors.textPrimary }}>{item.title}</Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: theme.colors.textSecondary, marginTop: 1 }}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Corporate Information */}
        <Card variant="outlined" style={{ padding: 16, marginTop: 14, borderRadius: 16 }}>
          <Text style={[styles.sectionHeading, { color: theme.colors.navy, marginTop: 0 }]}>
            📍 Corporate Office
          </Text>
          <Text style={[styles.bodyText, { color: theme.colors.textSecondary }]}>
            Anusha Bazaar Technologies Pvt Ltd{'\n'}
            Plot 405, Industrial Trade Zone, Business Bay{'\n'}
            Contact: +91 8388899999 · support@hinchmart.com
          </Text>
        </Card>
      </View>
    </Screen>
  );
}

// ==========================================
// 4. TERMS & CONDITIONS SCREEN
// ==========================================
export function TermsScreen({ navigation }: any) {
  const { theme } = useTheme();

  const TERMS_SECTIONS = [
    {
      title: '1. Acceptance of Terms',
      body: 'By creating an account or transacting on HINCH MART, you agree to abide by these B2B Platform Terms and Conditions, all applicable international trade laws, and commercial logistics standards.',
    },
    {
      title: '2. B2B Account Verification',
      body: 'Users must maintain authentic commercial registration details (GST, Tax ID, Corporate registration). HINCH MART reserves the right to verify trade licenses prior to activating wholesale pricing tiers.',
    },
    {
      title: '3. Orders, Quotations & RFQs',
      body: 'Quotations submitted by verified vendors are binding for the agreed validity period. Purchase orders finalized through the platform are fulfilled in accordance with published delivery and site mobilization schedules.',
    },
    {
      title: '4. Heavy Equipment Rental Terms',
      body: 'Rental machinery is inspected prior to site dispatch. Certified machine operators must be permitted access to designated project site coordinates. Equipment return timelines and site mobilization fees are governed by active rental agreements.',
    },
    {
      title: '5. Payment & Escrow Settlement',
      body: 'Payments processed via Letter of Credit (L/C), Wire Transfer, Corporate Card, or Business Wallet are held in protected escrow until bill-of-lading or site delivery confirmation.',
    },
    {
      title: '6. Limitation of Liability',
      body: 'HINCH MART acts as a secure platform connecting commercial buyers and verified suppliers. Material compliance with ISO/ASTM standards is certified directly by manufacturer Mill Test Reports (MTC).',
    },
  ];

  return (
    <Screen scrollable>
      <Header title="Terms & Conditions" showBack onBackPress={() => navigation.goBack()} />

      <View style={{ padding: 16 }}>
        <Card variant="outlined" style={styles.termsCard}>
          <View style={styles.termsAccentStripe} />
          <View style={styles.termsHeader}>
            <View style={[styles.termsIconCircle, { backgroundColor: `${theme.colors.primary}15` }]}>
              <Ionicons name="document-text" size={28} color={theme.colors.primary} />
            </View>
            <Text style={[styles.termsTitle, { color: theme.colors.textPrimary }]}>
              Terms of Service
            </Text>
            <Text style={[styles.termsSubtitle, { color: theme.colors.textTertiary }]}>
              Last Updated: August 2026 · HINCH MART Platform
            </Text>
          </View>
        </Card>

        {TERMS_SECTIONS.map((sec, idx) => (
          <Card key={idx} variant="outlined" style={{ padding: 16, marginTop: 12, borderRadius: 16 }}>
            <Text style={[styles.sectionHeading, { color: theme.colors.navy, marginTop: 0 }]}>
              {sec.title}
            </Text>
            <Text style={[styles.bodyText, { color: theme.colors.textSecondary, marginTop: 4 }]}>
              {sec.body}
            </Text>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollPadding: {
    padding: 16,
    paddingBottom: 32,
  },
  contentCard: {
    padding: 18,
    borderRadius: 18,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E2E8F0',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeaderTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
  },
  cardHeaderSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 2,
  },
  centerBox: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    marginTop: 10,
  },
  policySections: {
    marginTop: 4,
  },
  sectionHeading: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    marginTop: 14,
    marginBottom: 4,
  },
  bodyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 20,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 8,
    gap: 6,
  },
  retryText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  // Support Styles
  supportCardWrap: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 14,
    ...(Platform.OS === 'ios'
      ? { shadowColor: '#152238', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 16 }
      : { elevation: 6 }),
  },
  supportAccentStripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#FDB913',
  },
  supportCard: {
    padding: 20,
    borderRadius: 20,
  },
  supportHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  phoneIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(253, 185, 19, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportCardTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  supportCardSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#E2E8F0',
    marginTop: 2,
  },
  callNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDB913',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  callNowBtnText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    color: '#152238',
  },
  optionCard: {
    marginBottom: 12,
    borderRadius: 14,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    direction: 'ltr',
  },
  optionIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },
  optionDetail: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 1,
  },
  // About & Terms Styles
  aboutCard: {
    padding: 28,
    alignItems: 'center',
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  aboutAccentStripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#FDB913',
  },
  aboutLogoBox: {
    alignItems: 'center',
  },
  aboutDivider: {
    width: 60,
    height: 2,
    marginVertical: 12,
    alignItems: 'center',
  },
  aboutDividerLine: {
    width: '100%',
    height: '100%',
    borderRadius: 1,
  },
  tagline: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  versionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 14,
    gap: 6,
  },
  versionChip: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
  },
  termsCard: {
    padding: 24,
    alignItems: 'center',
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  termsAccentStripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#FDB913',
  },
  termsHeader: {
    alignItems: 'center',
  },
  termsIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  termsTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    marginTop: 6,
  },
  termsSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 4,
  },
});
