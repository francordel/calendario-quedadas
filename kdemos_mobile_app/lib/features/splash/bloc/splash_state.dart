import 'package:equatable/equatable.dart';

/// States for the splash screen
abstract class SplashState extends Equatable {
  const SplashState();

  @override
  List<Object?> get props => [];
}

/// Initial state when splash screen is loading
class SplashInitial extends SplashState {
  const SplashInitial();
}

/// State when splash screen is loading/initializing
class SplashLoading extends SplashState {
  final String? message;
  final double? progress;

  const SplashLoading({this.message, this.progress});

  @override
  List<Object?> get props => [message, progress];
}

/// State when splash initialization is completed successfully
class SplashCompleted extends SplashState {
  final bool isFirstLaunch;

  const SplashCompleted({required this.isFirstLaunch});

  @override
  List<Object?> get props => [isFirstLaunch];
}

/// State when there's an error during splash
class SplashError extends SplashState {
  final String message;

  const SplashError(this.message);

  @override
  List<Object?> get props => [message];
}