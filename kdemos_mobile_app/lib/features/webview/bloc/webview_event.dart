import 'package:equatable/equatable.dart';

/// Events for the webview screen
abstract class WebViewEvent extends Equatable {
  const WebViewEvent();

  @override
  List<Object?> get props => [];
}

/// Event fired when webview is initialized
class WebViewInitialized extends WebViewEvent {
  final String url;
  
  const WebViewInitialized(this.url);
  
  @override
  List<Object?> get props => [url];
}

/// Event fired when webview starts loading
class WebViewStartedLoading extends WebViewEvent {
  final String url;
  
  const WebViewStartedLoading(this.url);
  
  @override
  List<Object?> get props => [url];
}

/// Event fired when webview finishes loading
class WebViewFinishedLoading extends WebViewEvent {
  final String url;
  
  const WebViewFinishedLoading(this.url);
  
  @override
  List<Object?> get props => [url];
}

/// Event fired when webview loading progress changes
class WebViewProgressChanged extends WebViewEvent {
  final int progress;
  
  const WebViewProgressChanged(this.progress);
  
  @override
  List<Object?> get props => [progress];
}

/// Event fired when there's an error in webview
class WebViewErrorOccurred extends WebViewEvent {
  final String message;
  final String? url;
  
  const WebViewErrorOccurred(this.message, {this.url});
  
  @override
  List<Object?> get props => [message, url];
}

/// Event fired when webview is refreshed
class WebViewRefreshed extends WebViewEvent {
  const WebViewRefreshed();
}

/// Event fired to navigate back in webview
class WebViewNavigateBack extends WebViewEvent {
  const WebViewNavigateBack();
}

/// Event fired to navigate forward in webview
class WebViewNavigateForward extends WebViewEvent {
  const WebViewNavigateForward();
}

/// Event fired to reload webview
class WebViewReload extends WebViewEvent {
  const WebViewReload();
}

/// Event fired when connectivity changes
class WebViewConnectivityChanged extends WebViewEvent {
  final bool isConnected;
  final String connectionType;
  
  const WebViewConnectivityChanged({
    required this.isConnected,
    required this.connectionType,
  });
  
  @override
  List<Object?> get props => [isConnected, connectionType];
}

/// Event fired when webview URL changes
class WebViewUrlChanged extends WebViewEvent {
  final String url;
  
  const WebViewUrlChanged(this.url);
  
  @override
  List<Object?> get props => [url];
}