import 'package:equatable/equatable.dart';

/// Events for the splash screen
abstract class SplashEvent extends Equatable {
  const SplashEvent();

  @override
  List<Object?> get props => [];
}

/// Event fired when the app starts
class AppStarted extends SplashEvent {
  const AppStarted();
}

/// Event fired when splash screen initialization is complete
class SplashInitializationCompleted extends SplashEvent {
  const SplashInitializationCompleted();
}

/// Event fired when there's an error during splash
class SplashErrorOccurred extends SplashEvent {
  final String message;
  
  const SplashErrorOccurred(this.message);
  
  @override
  List<Object?> get props => [message];
}