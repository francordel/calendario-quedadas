import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../features/splash/presentation/splash_screen.dart';
import '../../features/home/presentation/home_screen.dart';
import '../../features/webview/presentation/webview_screen.dart';
import '../../features/settings/presentation/settings_screen.dart';
import 'app_routes.dart';

class AppRouter {
  // Private constructor to prevent instantiation
  AppRouter._();

  /// Global navigator key for programmatic navigation
  static final GlobalKey<NavigatorState> navigatorKey = 
      GlobalKey<NavigatorState>();

  /// GoRouter configuration with professional routing setup
  static final GoRouter router = GoRouter(
    navigatorKey: navigatorKey,
    initialLocation: AppRoutes.splash,
    debugLogDiagnostics: false, // Set to true for debugging
    
    // Error page configuration
    errorBuilder: (context, state) => Scaffold(
      appBar: AppBar(
        title: const Text('Error'),
        centerTitle: true,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline,
              size: 64,
              color: Colors.red,
            ),
            const SizedBox(height: 16),
            Text(
              'Page Not Found',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            Text(
              'The requested page could not be found.',
              style: Theme.of(context).textTheme.bodyMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => context.go(AppRoutes.home),
              child: const Text('Go Home'),
            ),
          ],
        ),
      ),
    ),
    
    // Route definitions
    routes: [
      // Splash screen route
      GoRoute(
        path: AppRoutes.splash,
        name: 'splash',
        builder: (context, state) => const SplashScreen(),
      ),
      
      // Home screen route
      GoRoute(
        path: AppRoutes.home,
        name: 'home',
        builder: (context, state) => const HomeScreen(),
      ),
      
      // WebView screen route with parameters
      GoRoute(
        path: AppRoutes.webview,
        name: 'webview',
        builder: (context, state) {
          final url = state.uri.queryParameters['url'];
          final title = state.uri.queryParameters['title'];
          
          return WebViewScreen(
            url: url ?? 'https://localhost:3000',
            title: title ?? 'Kdemos',
          );
        },
      ),
      
      // Calendar screen route (direct calendar access)
      GoRoute(
        path: '/calendar/:calendarId',
        name: 'calendar',
        builder: (context, state) {
          final calendarId = state.pathParameters['calendarId'] ?? '';
          final userName = state.uri.queryParameters['name'];
          
          String webUrl = 'https://localhost:3000/$calendarId';
          if (userName != null && userName.isNotEmpty) {
            webUrl += '?name=${Uri.encodeComponent(userName)}';
          }
          
          return WebViewScreen(
            url: webUrl,
            title: 'Calendar - $calendarId',
            showAppBar: true,
            enablePullToRefresh: true,
          );
        },
      ),
      
      // Settings screen route
      GoRoute(
        path: AppRoutes.settings,
        name: 'settings',
        builder: (context, state) => const SettingsScreen(),
      ),
    ],
    
    // Redirect logic for authentication or onboarding
    redirect: (context, state) {
      // For now, allow all routes
      // In the future, you can add authentication logic here
      return null;
    },
  );

  /// Navigate to home screen
  static void goHome() {
    router.go(AppRoutes.home);
  }

  /// Navigate to webview with URL
  static void goToWebView({
    required String url,
    String? title,
  }) {
    final uri = Uri(
      path: AppRoutes.webview,
      queryParameters: {
        'url': url,
        if (title != null) 'title': title,
      },
    );
    router.go(uri.toString());
  }

  /// Navigate to calendar with ID
  static void goToCalendar(String calendarId, {String? userName}) {
    String path = '/calendar/$calendarId';
    if (userName != null && userName.isNotEmpty) {
      path += '?name=${Uri.encodeComponent(userName)}';
    }
    router.go(path);
  }

  /// Navigate to settings
  static void goToSettings() {
    router.go(AppRoutes.settings);
  }

  /// Navigate back
  static void goBack() {
    if (router.canPop()) {
      router.pop();
    } else {
      goHome();
    }
  }

  /// Push a new route
  static void push(String route) {
    router.push(route);
  }

  /// Replace current route
  static void pushReplacement(String route) {
    router.pushReplacement(route);
  }

  /// Clear stack and navigate to route
  static void pushAndRemoveUntil(String route) {
    router.go(route);
  }

  /// Get current route name
  static String? getCurrentRoute() {
    try {
      return router.routeInformationProvider?.value.uri.path;
    } catch (e) {
      return null;
    }
  }

  /// Check if can pop
  static bool canPop() {
    return router.canPop();
  }
}

/// Extension for context-based navigation
extension AppRouterX on BuildContext {
  /// Navigate to home
  void goHome() => AppRouter.goHome();
  
  /// Navigate to webview
  void goToWebView({required String url, String? title}) =>
      AppRouter.goToWebView(url: url, title: title);
  
  /// Navigate to calendar
  void goToCalendar(String calendarId, {String? userName}) =>
      AppRouter.goToCalendar(calendarId, userName: userName);
  
  /// Navigate to settings
  void goToSettings() => AppRouter.goToSettings();
  
  /// Navigate back
  void goBack() => AppRouter.goBack();
}