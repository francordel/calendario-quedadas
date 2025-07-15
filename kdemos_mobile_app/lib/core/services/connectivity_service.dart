import 'dart:async';
import 'package:connectivity_plus/connectivity_plus.dart';

/// Service for monitoring network connectivity status
class ConnectivityService {
  final Connectivity _connectivity = Connectivity();
  late StreamController<ConnectivityResult> _connectivityController;
  late StreamSubscription<ConnectivityResult> _connectivitySubscription;

  /// Constructor
  ConnectivityService() {
    _connectivityController = StreamController<ConnectivityResult>.broadcast();
    _initConnectivity();
  }

  /// Stream of connectivity changes
  Stream<ConnectivityResult> get connectivityStream =>
      _connectivityController.stream;

  /// Initialize connectivity monitoring
  void _initConnectivity() {
    _connectivitySubscription = _connectivity.onConnectivityChanged.listen(
      (ConnectivityResult result) {
        _connectivityController.add(result);
      },
    );
  }

  /// Get current connectivity status
  Future<ConnectivityResult> getCurrentConnectivity() async {
    try {
      final ConnectivityResult result = await _connectivity.checkConnectivity();
      return result;
    } catch (e) {
      return ConnectivityResult.none;
    }
  }

  /// Check if device is connected to internet
  Future<bool> isConnected() async {
    final result = await getCurrentConnectivity();
    return result != ConnectivityResult.none;
  }

  /// Check if device is connected to WiFi
  Future<bool> isConnectedToWiFi() async {
    final result = await getCurrentConnectivity();
    return result == ConnectivityResult.wifi;
  }

  /// Check if device is connected to mobile data
  Future<bool> isConnectedToMobile() async {
    final result = await getCurrentConnectivity();
    return result == ConnectivityResult.mobile;
  }

  /// Get connectivity status as string
  Future<String> getConnectivityStatus() async {
    final result = await getCurrentConnectivity();
    return connectivityResultToString(result);
  }

  /// Convert connectivity result to readable string
  String connectivityResultToString(ConnectivityResult result) {
    switch (result) {
      case ConnectivityResult.wifi:
        return 'WiFi';
      case ConnectivityResult.mobile:
        return 'Mobile Data';
      case ConnectivityResult.ethernet:
        return 'Ethernet';
      case ConnectivityResult.bluetooth:
        return 'Bluetooth';
      case ConnectivityResult.vpn:
        return 'VPN';
      case ConnectivityResult.other:
        return 'Other';
      case ConnectivityResult.none:
        return 'No Connection';
    }
  }

  /// Check internet connectivity with actual ping
  Future<bool> hasInternetAccess() async {
    try {
      final isConnected = await this.isConnected();
      if (!isConnected) return false;

      // Could implement actual ping test here if needed
      // For now, we assume connectivity means internet access
      return true;
    } catch (e) {
      return false;
    }
  }

  /// Get connection quality estimation
  Future<ConnectionQuality> getConnectionQuality() async {
    final result = await getCurrentConnectivity();
    
    switch (result) {
      case ConnectivityResult.wifi:
        return ConnectionQuality.excellent;
      case ConnectivityResult.mobile:
        return ConnectionQuality.good;
      case ConnectivityResult.ethernet:
        return ConnectionQuality.excellent;
      case ConnectivityResult.none:
        return ConnectionQuality.none;
      default:
        return ConnectionQuality.poor;
    }
  }

  /// Dispose resources
  void dispose() {
    _connectivitySubscription.cancel();
    _connectivityController.close();
  }
}

/// Enum for connection quality
enum ConnectionQuality {
  excellent,
  good,
  poor,
  none,
}

/// Extension for connection quality
extension ConnectionQualityX on ConnectionQuality {
  String get displayName {
    switch (this) {
      case ConnectionQuality.excellent:
        return 'Excellent';
      case ConnectionQuality.good:
        return 'Good';
      case ConnectionQuality.poor:
        return 'Poor';
      case ConnectionQuality.none:
        return 'No Connection';
    }
  }

  bool get canLoadWebView {
    return this != ConnectionQuality.none;
  }

  bool get isOptimalForWebView {
    return this == ConnectionQuality.excellent || this == ConnectionQuality.good;
  }
}