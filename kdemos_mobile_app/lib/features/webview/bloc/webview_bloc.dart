import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:connectivity_plus/connectivity_plus.dart';

import '../../../core/services/connectivity_service.dart';
import '../../../core/services/preferences_service.dart';
import 'webview_event.dart';
import 'webview_state.dart';

/// BLoC for managing webview state and navigation
class WebViewBloc extends Bloc<WebViewEvent, WebViewState> {
  final ConnectivityService _connectivityService;
  StreamSubscription<ConnectivityResult>? _connectivitySubscription;

  WebViewBloc({required ConnectivityService connectivityService})
      : _connectivityService = connectivityService,
        super(const WebViewInitial()) {
    on<WebViewInitialized>(_onWebViewInitialized);
    on<WebViewStartedLoading>(_onWebViewStartedLoading);
    on<WebViewFinishedLoading>(_onWebViewFinishedLoading);
    on<WebViewProgressChanged>(_onWebViewProgressChanged);
    on<WebViewErrorOccurred>(_onWebViewErrorOccurred);
    on<WebViewRefreshed>(_onWebViewRefreshed);
    on<WebViewNavigateBack>(_onWebViewNavigateBack);
    on<WebViewNavigateForward>(_onWebViewNavigateForward);
    on<WebViewReload>(_onWebViewReload);
    on<WebViewConnectivityChanged>(_onWebViewConnectivityChanged);
    on<WebViewUrlChanged>(_onWebViewUrlChanged);

    _startConnectivityListener();
  }

  /// Start listening to connectivity changes
  void _startConnectivityListener() {
    _connectivitySubscription = _connectivityService.connectivityStream.listen(
      (ConnectivityResult result) async {
        final isConnected = result != ConnectivityResult.none;
        final connectionType = _connectivityService.connectivityResultToString(result);
        
        add(WebViewConnectivityChanged(
          isConnected: isConnected,
          connectionType: connectionType,
        ));
      },
    );
  }

  /// Handle webview initialization
  Future<void> _onWebViewInitialized(
    WebViewInitialized event,
    Emitter<WebViewState> emit,
  ) async {
    try {
      // Check connectivity first
      final isConnected = await _connectivityService.isConnected();
      
      if (!isConnected) {
        emit(WebViewOffline(lastUrl: event.url));
        return;
      }

      emit(WebViewLoading(url: event.url, message: 'Initializing...'));
      
      // Save the URL for future reference
      await PreferencesService.setLastWebUrl(event.url);
    } catch (e) {
      emit(WebViewError(
        message: 'Failed to initialize: ${e.toString()}',
        url: event.url,
      ));
    }
  }

  /// Handle webview started loading
  Future<void> _onWebViewStartedLoading(
    WebViewStartedLoading event,
    Emitter<WebViewState> emit,
  ) async {
    emit(WebViewLoading(
      url: event.url,
      progress: 0,
      message: 'Loading...',
    ));
  }

  /// Handle webview finished loading
  Future<void> _onWebViewFinishedLoading(
    WebViewFinishedLoading event,
    Emitter<WebViewState> emit,
  ) async {
    emit(WebViewLoaded(
      url: event.url,
      canGoBack: false, // Will be updated by webview controller
      canGoForward: false, // Will be updated by webview controller
    ));
    
    // Save successful URL
    await PreferencesService.setLastWebUrl(event.url);
  }

  /// Handle webview progress changes
  Future<void> _onWebViewProgressChanged(
    WebViewProgressChanged event,
    Emitter<WebViewState> emit,
  ) async {
    if (state is WebViewLoading) {
      final loadingState = state as WebViewLoading;
      emit(WebViewLoading(
        url: loadingState.url,
        progress: event.progress,
        message: 'Loading ${event.progress}%...',
      ));
    }
  }

  /// Handle webview errors
  Future<void> _onWebViewErrorOccurred(
    WebViewErrorOccurred event,
    Emitter<WebViewState> emit,
  ) async {
    final isConnected = await _connectivityService.isConnected();
    
    emit(WebViewError(
      message: event.message,
      url: event.url,
      isConnected: isConnected,
    ));
  }

  /// Handle webview refresh
  Future<void> _onWebViewRefreshed(
    WebViewRefreshed event,
    Emitter<WebViewState> emit,
  ) async {
    if (state is WebViewLoaded) {
      final loadedState = state as WebViewLoaded;
      emit(WebViewRefreshing(loadedState.url));
    } else if (state is WebViewError) {
      final errorState = state as WebViewError;
      if (errorState.url != null) {
        emit(WebViewRefreshing(errorState.url!));
      }
    }
  }

  /// Handle webview back navigation
  Future<void> _onWebViewNavigateBack(
    WebViewNavigateBack event,
    Emitter<WebViewState> emit,
  ) async {
    // This will be handled by the webview controller
    // The state might be updated based on navigation capability
  }

  /// Handle webview forward navigation
  Future<void> _onWebViewNavigateForward(
    WebViewNavigateForward event,
    Emitter<WebViewState> emit,
  ) async {
    // This will be handled by the webview controller
    // The state might be updated based on navigation capability
  }

  /// Handle webview reload
  Future<void> _onWebViewReload(
    WebViewReload event,
    Emitter<WebViewState> emit,
  ) async {
    if (state is WebViewLoaded) {
      final loadedState = state as WebViewLoaded;
      emit(WebViewLoading(
        url: loadedState.url,
        message: 'Reloading...',
      ));
    }
  }

  /// Handle connectivity changes
  Future<void> _onWebViewConnectivityChanged(
    WebViewConnectivityChanged event,
    Emitter<WebViewState> emit,
  ) async {
    if (!event.isConnected) {
      String? lastUrl;
      
      if (state is WebViewLoaded) {
        lastUrl = (state as WebViewLoaded).url;
      } else if (state is WebViewLoading) {
        lastUrl = (state as WebViewLoading).url;
      }
      
      emit(WebViewOffline(
        lastUrl: lastUrl,
        connectionType: event.connectionType,
      ));
    } else {
      // If we were offline and now online, try to reload
      if (state is WebViewOffline) {
        final offlineState = state as WebViewOffline;
        if (offlineState.lastUrl != null) {
          add(WebViewInitialized(offlineState.lastUrl!));
        }
      }
    }
  }

  /// Handle URL changes
  Future<void> _onWebViewUrlChanged(
    WebViewUrlChanged event,
    Emitter<WebViewState> emit,
  ) async {
    if (state is WebViewLoaded) {
      final loadedState = state as WebViewLoaded;
      emit(WebViewLoaded(
        url: event.url,
        title: loadedState.title,
        canGoBack: loadedState.canGoBack,
        canGoForward: loadedState.canGoForward,
      ));
    }
    
    // Save the new URL
    await PreferencesService.setLastWebUrl(event.url);
  }

  @override
  Future<void> close() {
    _connectivitySubscription?.cancel();
    return super.close();
  }
}