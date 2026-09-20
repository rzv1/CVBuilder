import { StyleSheet } from '@react-pdf/renderer';

/**
 * Creates a dynamic @react-pdf/renderer StyleSheet from style.json configuration tokens.
 * Consolidates base styles shared across layouts (Classic, Modern) to minimize redundancy.
 * 
 * @param {Object} styleData - Token configuration object (theme, layout, typography, features)
 * @returns {Object} React PDF StyleSheet object
 */
export function createPDFStyles(styleData = {}) {
  const safeStyle = styleData || {};
  const theme = safeStyle.theme || {};
  const layout = safeStyle.layout || {};
  const typography = safeStyle.typography || {};
  const features = safeStyle.features || {};

  // Extract color tokens with fallbacks
  const primaryColor = theme.primaryColor || '#0f172a';
  const accentColor = theme.accentColor || '#2563eb';
  const secondaryAccent = theme.secondaryAccent || '#65a30d';
  const neutralColor = theme.neutralColor || '#1e293b';
  const mutedColor = theme.mutedColor || '#64748b';
  const backgroundColor = theme.backgroundColor || '#ffffff';
  const cardBackgroundColor = theme.cardBackgroundColor || '#2b3446';
  const contactBarBg = theme.contactBarBg || '#1a202c';
  const fontFamily = theme.fontFamily === 'executive' ? 'Times-Roman' : (theme.fontFamily || 'Helvetica');

  // Extract layout tokens
  const margins = layout.margins || { top: 24, right: 28, bottom: 36, left: 28 };
  const sidebarWidth = layout.sidebarWidth || '39%';

  // Calculate scaling for compact mode
  const compact = features.compactMode;
  const spacingScale = compact ? 0.75 : 1.0;

  // Extract typography sizes
  const headerSize = typography.headerSize || 20;
  const titleSize = typography.titleSize || 11;
  const sectionTitleSize = typography.sectionTitleSize || 11;
  const itemTitleSize = typography.itemTitleSize || 10;
  const itemSubSize = typography.itemSubSize || 9.5;
  const bodySize = typography.bodySize || 9.5;
  const smallSize = typography.smallSize || 8.5;
  const microSize = typography.microSize || 7.5;
  const lineHeight = typography.lineHeight || 1.3;

  return StyleSheet.create({
    // --- PAGE CONTAINER ---
    page: {
      paddingTop: margins.top,
      paddingBottom: margins.bottom,
      paddingLeft: margins.left,
      paddingRight: margins.right,
      paddingHorizontal: margins.left,
      fontFamily,
      fontSize: bodySize,
      color: neutralColor,
      backgroundColor
    },

    // --- SHARED TYPOGRAPHY & SECTIONS ---
    section: {
      marginBottom: Math.round(12 * spacingScale)
    },
    sectionTitle: {
      fontSize: sectionTitleSize,
      fontWeight: 'bold',
      color: neutralColor,
      borderBottomWidth: 1,
      borderBottomColor: '#e2e8f0',
      paddingBottom: Math.round(3 * spacingScale),
      marginBottom: Math.round(6 * spacingScale),
      textTransform: 'uppercase',
      letterSpacing: 0.5
    },
    paragraph: {
      fontSize: bodySize,
      color: '#334155',
      lineHeight
    },
    itemGroup: {
      marginBottom: Math.round(8 * spacingScale)
    },
    itemHead: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 2
    },
    itemTitle: {
      fontSize: itemTitleSize,
      fontWeight: 'bold',
      color: primaryColor
    },
    itemSub: {
      fontSize: itemSubSize,
      fontWeight: 'normal',
      color: accentColor
    },
    itemDate: {
      fontSize: smallSize,
      color: mutedColor
    },
    itemDesc: {
      fontSize: smallSize,
      color: '#475569',
      fontStyle: 'italic',
      marginBottom: 3
    },
    bulletList: {
      marginLeft: 8,
      marginTop: 2
    },
    bulletItem: {
      flexDirection: 'row',
      marginBottom: Math.round(3 * spacingScale),
      paddingRight: 10,
      alignItems: 'flex-start'
    },
    bulletPoint: {
      width: 10,
      fontSize: bodySize,
      color: accentColor
    },
    bulletText: {
      fontSize: smallSize,
      color: '#334155',
      lineHeight
    },
    tagsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
      marginTop: 4
    },
    tagPill: {
      backgroundColor: '#f1f5f9',
      color: '#334155',
      fontSize: microSize,
      paddingVertical: 2,
      paddingHorizontal: 6,
      borderRadius: 3,
      borderWidth: 0.5,
      borderColor: '#cbd5e1'
    },
    skillsGroup: {
      marginBottom: Math.round(5 * spacingScale)
    },
    skillCategoryTitle: {
      fontSize: bodySize,
      fontWeight: 'bold',
      color: neutralColor,
      marginBottom: 3
    },
    languagesRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12
    },
    langItem: {
      fontSize: smallSize,
      color: '#334155'
    },

    // --- SHARED DIFF HIGHLIGHTS ---
    diffBoxBefore: {
      backgroundColor: '#fef2f2',
      borderColor: '#ef4444',
      borderWidth: 0.8,
      borderRadius: 3,
      paddingHorizontal: 3,
      paddingVertical: 1
    },
    diffBoxAfter: {
      backgroundColor: '#f0fdf4',
      borderColor: '#22c55e',
      borderWidth: 0.8,
      borderRadius: 3,
      paddingHorizontal: 3,
      paddingVertical: 1
    },
    diffTextBefore: {
      color: '#991b1b'
    },
    diffTextAfter: {
      color: '#166534'
    },

    // --- FOOTER ---
    pageFooter: {
      position: 'absolute',
      bottom: 15,
      left: margins.left,
      right: margins.right,
      borderTopWidth: 0.5,
      borderTopColor: '#e2e8f0',
      paddingTop: 4,
      flexDirection: 'row',
      justifyContent: 'space-between',
      fontSize: microSize,
      color: mutedColor
    },

    // --- CLASSIC LAYOUT STYLES ---
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      borderBottomWidth: 1.5,
      borderBottomColor: accentColor,
      paddingBottom: 10,
      marginBottom: Math.round(12 * spacingScale)
    },
    headerLeft: {
      flex: 1,
      paddingRight: 10
    },
    name: {
      fontSize: headerSize,
      fontWeight: 'bold',
      color: primaryColor,
      marginBottom: 3
    },
    title: {
      fontSize: titleSize,
      color: accentColor,
      fontWeight: 'bold',
      marginBottom: 5
    },
    contactsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 5,
      fontSize: smallSize,
      color: mutedColor
    },
    contactItem: {
      marginRight: 4
    },
    qrContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 60
    },
    qrImage: {
      width: 52,
      height: 52,
      borderRadius: 4
    },
    qrLabel: {
      fontSize: microSize - 1,
      color: mutedColor,
      marginTop: 2,
      textAlign: 'center'
    },

    // --- MODERN 2-COLUMN LAYOUT STYLES ---
    modernHeader: {
      flexDirection: 'row',
      backgroundColor: cardBackgroundColor,
      borderRadius: 6,
      padding: 12,
      alignItems: 'center',
      marginBottom: 0
    },
    modernAvatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      marginRight: 12,
      borderWidth: 2,
      borderColor: '#ffffff'
    },
    modernHeaderMain: {
      flex: 1,
      paddingRight: 6
    },
    modernName: {
      fontSize: headerSize - 4,
      fontWeight: 'bold',
      color: '#ffffff',
      letterSpacing: 0.5,
      marginBottom: 2
    },
    modernTitle: {
      fontSize: titleSize,
      color: secondaryAccent,
      fontWeight: 'bold',
      marginBottom: 3
    },
    modernSummary: {
      fontSize: smallSize - 0.5,
      color: '#cbd5e1'
    },
    modernQrContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      padding: 3,
      borderRadius: 4,
      width: 52,
      marginLeft: 6
    },
    modernQrImage: {
      width: 46,
      height: 46
    },
    modernQrLabel: {
      fontSize: microSize - 2,
      color: '#334155',
      fontWeight: 'bold',
      marginTop: 1,
      textAlign: 'center'
    },
    modernContactBar: {
      flexDirection: 'row',
      backgroundColor: contactBarBg,
      borderRadius: 4,
      paddingVertical: 4.5,
      paddingHorizontal: 12,
      marginTop: 3,
      marginBottom: Math.round(12 * spacingScale),
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexWrap: 'wrap',
      gap: 8
    },
    modernContactItem: {
      fontSize: smallSize - 0.7,
      color: '#e2e8f0'
    },
    modernBody: {
      flexDirection: 'row',
      width: '100%',
      gap: 12
    },
    modernLeftCol: {
      width: '61%',
      paddingRight: 6
    },
    modernRightCol: {
      width: sidebarWidth,
      paddingLeft: 8,
      borderLeftWidth: 0.5,
      borderLeftColor: '#cbd5e1'
    },
    modernSectionTitle: {
      fontSize: sectionTitleSize,
      fontWeight: 'bold',
      color: secondaryAccent,
      marginBottom: Math.round(6 * spacingScale),
      marginTop: 2,
      borderBottomWidth: 1,
      borderBottomColor: '#e2e8f0',
      paddingBottom: 2,
      textTransform: 'capitalize'
    },
    modernBulletPoint: {
      width: 8,
      fontSize: bodySize,
      color: secondaryAccent
    }
  });
}
