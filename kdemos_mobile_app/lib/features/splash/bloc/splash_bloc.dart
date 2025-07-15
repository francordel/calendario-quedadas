import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:package_info_plus/package_info_plus.dart';

import '../../../core/services/preferences_service.dart';
import '../../../core/services/connectivity_service.dart';
import 'splash_event.dart';
import 'splash_state.dart';

/// BLoC for managing splash screen state and initialization
class SplashBloc extends Bloc<SplashEvent, SplashState> {
  final ConnectivityService? _connectivityService;

  SplashBloc({ConnectivityService? connectivityService})
      : _connectivityService = connectivityService,
        super(const SplashInitial()) {
    on<AppStarted>(_onAppStarted);
    on<SplashInitializationCompleted>(_onSplashInitializationCompleted);
    on<SplashErrorOccurred>(_onSplashErrorOccurred);
  }

  /// Handle app started event
  Future<void> _onAppStarted(
    AppStarted event,
    Emitter<SplashState> emit,
  ) async {
    try {
      emit(const SplashLoading(message: 'Initializing...', progress: 0.1));

      // Initialize preferences service
      await PreferencesService.init();
      emit(const SplashLoading(message: 'Loading preferences...', progress: 0.3));

      // Get app version and update if needed
      final PackageInfo packageInfo = await PackageInfo.fromPlatform();
      await PreferencesService.setAppVersion(packageInfo.version);
      emit(const SplashLoading(message: 'Checking version...', progress: 0.5));

      // Check connectivity if service is available
      if (_connectivityService != null) {
        emit(const SplashLoading(message: 'Checking connectivity...', progress: 0.7));
        final isConnected = await _connectivityService!.isConnected();
        
        if (!isConnected) {
          // Still continue but maybe show a warning later
          emit(const SplashLoading(message: 'No internet connection', progress: 0.8));
        }
      }

      // Complete initialization
      emit(const SplashLoading(message: 'Ready!', progress: 1.0));

      // Wait a moment for visual feedback
      await Future.delayed(const Duration(milliseconds: 500));

      // Check if this is first launch
      final isFirstLaunch = PreferencesService.isFirstLaunch;
      
      if (isFirstLaunch) {
        await PreferencesService.setFirstLaunchCompleted();
      }

      emit(SplashCompleted(isFirstLaunch: isFirstLaunch));
    } catch (e) {
      emit(SplashError('Initialization failed: ${e.toString()}'));
    }
  }

  /// Handle splash initialization completed event
  Future<void> _onSplashInitializationCompleted(
    SplashInitializationCompleted event,
    Emitter<SplashState> emit,
  ) async {
    final isFirstLaunch = PreferencesService.isFirstLaunch;
    emit(SplashCompleted(isFirstLaunch: isFirstLaunch));
  }

  /// Handle splash error event
  Future<void> _onSplashErrorOccurred(
    SplashErrorOccurred event,
    Emitter<SplashState> emit,
  ) async {
    emit(SplashError(event.message));
  }

}