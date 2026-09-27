import * as ImagePicker from 'expo-image-picker';
import { Camera, Sparkles } from 'lucide-react-native';
import React from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ProfileCardProps {
  name: string;
  email: string;
  avatarUri?: string;
  badgeText?: string;
  onAvatarChanged?: (uri: string) => void;
  onPressCard?: () => void;
}

export default function ProfileCard({
  name,
  email,
  avatarUri,
  badgeText = 'FreeLib Member',
  onAvatarChanged,
  onPressCard,
}: ProfileCardProps) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handlePickAvatar = async () => {
    if (!onAvatarChanged) return;

    Alert.alert('Update Profile Photo', 'Choose an option', [
      {
        text: 'Choose from Gallery',
        onPress: async () => {
          try {
            const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!granted) {
              Alert.alert('Permission needed', 'Please grant library access to select a photo.');
              return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ['images'],
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });
            if (!result.canceled && result.assets && result.assets[0]?.uri) {
              onAvatarChanged(result.assets[0].uri);
            }
          } catch (e: any) {
            Alert.alert('Error', e?.message || 'Could not pick image');
          }
        },
      },
      {
        text: 'Take Photo',
        onPress: async () => {
          try {
            const { granted } = await ImagePicker.requestCameraPermissionsAsync();
            if (!granted) {
              Alert.alert('Permission needed', 'Please grant camera access to take a photo.');
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });
            if (!result.canceled && result.assets && result.assets[0]?.uri) {
              onAvatarChanged(result.assets[0].uri);
            }
          } catch (e: any) {
            Alert.alert('Error', e?.message || 'Could not take photo');
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPressCard}
      disabled={!onPressCard}
      activeOpacity={0.8}
    >
      <View style={styles.avatarContainer}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.initialsText}>{initials}</Text>
          </View>
        )}

        {onAvatarChanged && (
          <TouchableOpacity
            style={styles.cameraIconBtn}
            onPress={handlePickAvatar}
            accessibilityLabel="Change avatar photo"
          >
            <Camera size={12} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.userName}>{name}</Text>
      <Text style={styles.userEmail}>{email}</Text>

      {badgeText && (
        <View style={styles.badge}>
          <Sparkles size={11} color="#38bdf8" />
          <Text style={styles.badgeText}>{badgeText}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginVertical: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatarImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#38bdf8',
  },
  avatarFallback: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#38bdf840',
  },
  initialsText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
  },
  cameraIconBtn: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    backgroundColor: '#2563eb',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1e293b',
  },
  userName: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '800',
  },
  userEmail: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#0284c720',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#38bdf830',
  },
  badgeText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '600',
  },
});
