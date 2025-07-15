/// Application route definitions
class AppRoutes {
  // Private constructor to prevent instantiation
  AppRoutes._();

  // Main routes
  static const String splash = '/';
  static const String home = '/home';
  static const String webview = '/webview';
  static const String settings = '/settings';
  
  // Calendar routes
  static const String calendar = '/calendar';
  
  // Static methods for parameterized routes
  static String calendarWithId(String calendarId) => '/calendar/$calendarId';
  static String calendarWithIdAndName(String calendarId, String userName) =>
      '/calendar/$calendarId?name=${Uri.encodeComponent(userName)}';
  
  // WebView with parameters
  static String webviewWithUrl(String url, {String? title}) {
    final uri = Uri(
      path: webview,
      queryParameters: {
        'url': url,
        if (title != null) 'title': title,
      },
    );
    return uri.toString();
  }
  
  // All available routes list
  static const List<String> allRoutes = [
    splash,
    home,
    webview,
    settings,
    calendar,
  ];
}