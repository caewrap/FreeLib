import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  icon?: React.ReactNode;
}

export default function AppHeader({
  title,
  subtitle,
  badge,
  showBack = false,
  onBack,
  rightElement,
  icon,
}: AppHeaderProps) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftCluster}>
        {showBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            accessibilityLabel="Go back"
            activeOpacity={0.7}
          >
            <ArrowLeft size={18} color="#94a3b8" />
          </TouchableOpacity>
        )}

        {icon && !showBack && <View style={styles.iconContainer}>{icon}</View>}

        <View style={styles.titleColumn}>
          <View style={styles.titleRow}>
            <Text style={styles.titleText}>{title}</Text>
            {badge && (
              <View style={styles.badgePill}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            )}
          </View>
          {subtitle && <Text style={styles.subtitleText}>{subtitle}</Text>}
        </View>
      </View>

      {rightElement && <View style={styles.rightCluster}>{rightElement}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 14,
  },
  leftCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleColumn: {
    justifyContent: 'center',
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleText: {
    color: '#f8fafc',
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  badgePill: {
    backgroundColor: '#0284c720',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#38bdf840',
  },
  badgeText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  subtitleText: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  rightCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
