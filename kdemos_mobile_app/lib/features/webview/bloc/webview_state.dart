import 'package:equatable/equatable.dart';

/// States for the webview screen
abstract class WebViewState extends Equatable {
  const WebViewState();

  @override
  List<Object?> get props => [];
}

/// Initial state for webview
class WebViewInitial extends WebViewState {
  const WebViewInitial();
}

/// State when webview is loading
class WebViewLoading extends WebViewState {
  final String url;
  final int progress;
  final String? message;

  const WebViewLoading({
    required this.url,
    this.progress = 0,
    this.message,
  });

  @override
  List<Object?> get props => [url, progress, message];
}

/// State when webview has loaded successfully
class WebViewLoaded extends WebViewState {
  final String url;
  final String? title;
  final bool canGoBack;
  final bool canGoForward;

  const WebViewLoaded({
    required this.url,
    this.title,
    this.canGoBack = false,
    this.canGoForward = false,
  });

  @override
  List<Object?> get props => [url, title, canGoBack, canGoForward];
}

/// State when webview encounters an error
class WebViewError extends WebViewState {
  final String message;
  final String? url;
  final bool isConnected;

  const WebViewError({
    required this.message,
    this.url,
    this.isConnected = true,
  });

  @override
  List<Object?> get props => [message, url, isConnected];
}

/// State when device is offline
class WebViewOffline extends WebViewState {
  final String? lastUrl;
  final String connectionType;

  const WebViewOffline({
    this.lastUrl,
    this.connectionType = 'No Connection',
  });

  @override
  List<Object?> get props => [lastUrl, connectionType];
}

/// State when webview is refreshing
class WebViewRefreshing extends WebViewState {
  final String url;

  const WebViewRefreshing(this.url);

  @override
  List<Object?> get props => [url];
}