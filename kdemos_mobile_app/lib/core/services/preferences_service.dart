import 'package:shared_preferences/shared_preferences.dart';

/// Service for managing application preferences and local storage
class PreferencesService {
  // Private constructor
  PreferencesService._();

  static SharedPreferences? _prefs;

  /// Initialize preferences service
  static Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  /// Get preferences instance
  static SharedPreferences get prefs {
    if (_prefs == null) {
      throw Exception('PreferencesService not initialized. Call init() first.');
    }
    return _prefs!;
  }

  // Keys for preferences
  static const String _keyFirstLaunch = 'first_launch';
  static const String _keyThemeMode = 'theme_mode';
  static const String _keyLanguage = 'language';
  static const String _keyLastWebUrl = 'last_web_url';
  static const String _keyUserName = 'user_name';
  static const String _keyLastCalendarId = 'last_calendar_id';
  static const String _keyAppVersion = 'app_version';
  static const String _keyPushNotifications = 'push_notifications';

  // First launch
  static bool get isFirstLaunch => prefs.getBool(_keyFirstLaunch) ?? true;
  static Future<void> setFirstLaunchCompleted() async {
    await prefs.setBool(_keyFirstLaunch, false);
  }

  // Theme mode
  static String get themeMode => prefs.getString(_keyThemeMode) ?? 'system';
  static Future<void> setThemeMode(String mode) async {
    await prefs.setString(_keyThemeMode, mode);
  }

  // Language
  static String get language => prefs.getString(_keyLanguage) ?? 'system';
  static Future<void> setLanguage(String language) async {
    await prefs.setString(_keyLanguage, language);
  }

  // Last web URL
  static String get lastWebUrl => 
      prefs.getString(_keyLastWebUrl) ?? 'https://localhost:3000';
  static Future<void> setLastWebUrl(String url) async {
    await prefs.setString(_keyLastWebUrl, url);
  }

  // User name for quick access
  static String? get userName => prefs.getString(_keyUserName);
  static Future<void> setUserName(String? name) async {
    if (name != null) {
      await prefs.setString(_keyUserName, name);
    } else {
      await prefs.remove(_keyUserName);
    }
  }

  // Last calendar ID for quick access
  static String? get lastCalendarId => prefs.getString(_keyLastCalendarId);
  static Future<void> setLastCalendarId(String? calendarId) async {
    if (calendarId != null) {
      await prefs.setString(_keyLastCalendarId, calendarId);
    } else {
      await prefs.remove(_keyLastCalendarId);
    }
  }

  // App version for migration purposes
  static String? get appVersion => prefs.getString(_keyAppVersion);
  static Future<void> setAppVersion(String version) async {
    await prefs.setString(_keyAppVersion, version);
  }

  // Push notifications
  static bool get pushNotificationsEnabled => 
      prefs.getBool(_keyPushNotifications) ?? true;
  static Future<void> setPushNotificationsEnabled(bool enabled) async {
    await prefs.setBool(_keyPushNotifications, enabled);
  }

  // Recent calendars (stored as JSON string list)
  static const String _keyRecentCalendars = 'recent_calendars';
  
  static List<String> get recentCalendars {
    final List<String>? calendars = prefs.getStringList(_keyRecentCalendars);
    return calendars ?? [];
  }

  static Future<void> addRecentCalendar(String calendarId) async {
    final List<String> recent = recentCalendars;
    
    // Remove if already exists
    recent.remove(calendarId);
    
    // Add to beginning
    recent.insert(0, calendarId);
    
    // Keep only last 10
    if (recent.length > 10) {
      recent.removeRange(10, recent.length);
    }
    
    await prefs.setStringList(_keyRecentCalendars, recent);
  }

  static Future<void> removeRecentCalendar(String calendarId) async {
    final List<String> recent = recentCalendars;
    recent.remove(calendarId);
    await prefs.setStringList(_keyRecentCalendars, recent);
  }

  static Future<void> clearRecentCalendars() async {
    await prefs.remove(_keyRecentCalendars);
  }

  // Clear all preferences (for logout or reset)
  static Future<void> clearAll() async {
    await prefs.clear();
  }

  // Clear user data only (keep app settings)
  static Future<void> clearUserData() async {
    await prefs.remove(_keyUserName);
    await prefs.remove(_keyLastCalendarId);
    await prefs.remove(_keyRecentCalendars);
    await prefs.remove(_keyLastWebUrl);
  }

  // Debug: Get all preferences
  static Map<String, dynamic> getAllPreferences() {
    final keys = prefs.getKeys();
    final Map<String, dynamic> allPrefs = {};
    
    for (final key in keys) {
      allPrefs[key] = prefs.get(key);
    }
    
    return allPrefs;
  }
}