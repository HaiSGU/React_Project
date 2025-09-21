import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Pressable, Modal } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

export const QRScanner = ({ visible, onClose, onScanSuccess }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (visible && !permission?.granted) {
      requestPermission();
    }
  }, [visible, permission, requestPermission]);

  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned) return;
    
    setScanned(true);
    
    // Kiểm tra định dạng QR code
    if (type === 'qr' || type === 'org.iso.QRCode') {
      try {
        // Parse QR data (có thể là JSON hoặc string)
        let qrData;
        try {
          qrData = JSON.parse(data);
        } catch {
          qrData = { type: 'payment', data: data };
        }

        // Xử lý QR code thanh toán
        if (qrData.type === 'payment' || data.includes('payment') || data.includes('qr')) {
          Alert.alert(
            'QR Code được quét thành công!',
            `Dữ liệu: ${data}\n\nBạn có muốn tiếp tục thanh toán không?`,
            [
              {
                text: 'Hủy',
                style: 'cancel',
                onPress: () => {
                  setScanned(false);
                  onClose();
                }
              },
              {
                text: 'Thanh toán',
                onPress: () => {
                  onScanSuccess(qrData);
                  onClose();
                }
              }
            ]
          );
        } else {
          Alert.alert(
            'QR Code không hợp lệ',
            'Đây không phải là QR code thanh toán. Vui lòng quét QR code từ nhà hàng.',
            [
              {
                text: 'Thử lại',
                onPress: () => setScanned(false)
              },
              {
                text: 'Đóng',
                onPress: onClose
              }
            ]
          );
        }
      } catch (_error) {
        Alert.alert('Lỗi', 'Không thể xử lý QR code. Vui lòng thử lại.');
        setScanned(false);
      }
    } else {
      Alert.alert(
        'Định dạng không hỗ trợ',
        'Vui lòng quét QR code thanh toán.',
        [
          {
            text: 'Thử lại',
            onPress: () => setScanned(false)
          }
        ]
      );
    }
  };

  if (!permission) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.container}>
          <Text style={styles.text}>Đang tải camera...</Text>
        </View>
      </Modal>
    );
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.container}>
          <View style={styles.permissionContainer}>
            <Text style={styles.title}>Cần quyền truy cập camera</Text>
            <Text style={styles.text}>
              Ứng dụng cần quyền truy cập camera để quét QR code thanh toán.
            </Text>
            <Pressable style={styles.button} onPress={requestPermission}>
              <Text style={styles.buttonText}>Cấp quyền</Text>
            </Pressable>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing={CameraType.back}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'pdf417'],
          }}
        >
          <View style={styles.overlay}>
            <View style={styles.topOverlay}>
              <Text style={styles.overlayTitle}>Quét QR thanh toán</Text>
              <Text style={styles.overlaySubtitle}>
                Đặt camera vào QR code để quét
              </Text>
            </View>
            
            <View style={styles.middleOverlay}>
              <View style={styles.scanArea}>
                <View style={styles.corner} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
            </View>
            
            <View style={styles.bottomOverlay}>
              <Pressable style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Đóng</Text>
              </Pressable>
            </View>
          </View>
        </CameraView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  topOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  overlayTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  overlaySubtitle: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  middleOverlay: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#00b14f',
    borderWidth: 4,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    top: 0,
    left: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    left: 'auto',
    borderTopWidth: 0,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    top: 'auto',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    top: 'auto',
    left: 'auto',
    borderTopWidth: 0,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 0,
  },
  bottomOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  closeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'white',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#00b14f',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    opacity: 0.7,
  },
});

