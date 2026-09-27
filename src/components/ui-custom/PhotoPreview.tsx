import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon, Trash2, Upload } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface PhotoPreviewProps {
  imageUri?: string | null;
  onImageSelected: (uri: string) => void;
  onClear?: () => void;
  title?: string;
  subtitle?: string;
  aspectRatio?: [number, number];
}

export default function PhotoPreview({
  imageUri,
  onImageSelected,
  onClear,
  title = 'Library Card & Book Snapshot',
  subtitle = 'Upload or snap a photo of your book note or card',
  aspectRatio = [4, 3],
}: PhotoPreviewProps) {
  const [loading, setLoading] = useState(false);

  const handlePickFromLibrary = async () => {
    try {
      setLoading(true);
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permission Required',
          'FreeLib requires access to your photo library to choose a photo.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: aspectRatio,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to select image');
    } finally {
      setLoading(false);
    }
  };

  const handleTakePhoto = async () => {
    try {
      setLoading(true);
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Camera Permission Required',
          'FreeLib requires access to your camera to take a photo.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: aspectRatio,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to capture photo from camera');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>

      {imageUri ? (
        <View style={styles.previewWrapper}>
          <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
          <View style={styles.previewActionOverlay}>
            <TouchableOpacity
              style={styles.changeBtn}
              onPress={handlePickFromLibrary}
              disabled={loading}
            >
              <Upload size={14} color="#ffffff" />
              <Text style={styles.changeBtnText}>Change</Text>
            </TouchableOpacity>

            {onClear && (
              <TouchableOpacity style={styles.deleteBtn} onPress={onClear}>
                <Trash2 size={14} color="#ef4444" />
                <Text style={styles.deleteBtnText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.emptyPickerContainer}>
          <View style={styles.emptyIconCircle}>
            <ImageIcon size={28} color="#64748b" />
          </View>
          <Text style={styles.emptyText}>No photo selected yet</Text>

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handlePickFromLibrary}
              disabled={loading}
            >
              <ImageIcon size={16} color="#38bdf8" />
              <Text style={styles.actionBtnText}>Choose Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.cameraBtn]}
              onPress={handleTakePhoto}
              disabled={loading}
            >
              <Camera size={16} color="#ffffff" />
              <Text style={styles.cameraBtnText}>Take Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginVertical: 10,
  },
  cardTitle: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '700',
  },
  cardSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 12,
  },
  previewWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  previewImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#0f172a',
  },
  previewActionOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#0f172a',
  },
  changeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563eb',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  changeBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ef444420',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteBtnText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyPickerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#0f172a80',
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#334155',
  },
  emptyIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 13,
    marginBottom: 14,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  actionBtnText: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: '600',
  },
  cameraBtn: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  cameraBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
});
