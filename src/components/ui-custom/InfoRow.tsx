import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string | number;
  sublabel?: string;
  onPress?: () => void;
  accentColor?: string;
  showChevron?: boolean;
}

export default function InfoRow({
  icon,
  label,
  value,
  sublabel,
  onPress,
  accentColor = '#38bdf8',
  showChevron = false,
}: InfoRowProps) {
  const content = (
    <View style={styles.container}>
      <View style={[styles.iconWrapper, { backgroundColor: `${accentColor}18` }]}>
        {icon}
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.labelText}>{label}</Text>
        {sublabel && <Text style={styles.sublabelText}>{sublabel}</Text>}
      </View>

      {value !== undefined && (
        <View style={styles.valueContainer}>
          <Text style={[styles.valueText, { color: accentColor }]}>{value}</Text>
        </View>
      )}

      {showChevron && <ChevronRight size={18} color="#64748b" style={styles.chevron} />}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={styles.touchable}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.touchable}>{content}</View>;
}

const styles = StyleSheet.create({
  touchable: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 8,
    overflow: 'hidden',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  labelText: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '600',
  },
  sublabelText: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  valueContainer: {
    paddingLeft: 8,
  },
  valueText: {
    fontSize: 14,
    fontWeight: '700',
  },
  chevron: {
    marginLeft: 6,
  },
});
