import 'package:flutter/material.dart';

/// Application color constants matching the webapp design system
class AppColors {
  // Private constructor to prevent instantiation
  AppColors._();

  // Primary colors matching webapp
  static const Color primary = Color(0xFF007AFF);
  static const Color primaryHover = Color(0xFF0056CC);
  static const Color primaryLight = Color(0xFFE3F2FD);
  
  // Secondary colors
  static const Color secondary = Color(0xFF5AC8FA);
  
  // Success/Error/Warning colors matching webapp
  static const Color success = Color(0xFF28A745);
  static const Color successLight = Color(0xFFD4EDDA);
  static const Color warning = Color(0xFFFF9500);
  static const Color warningLight = Color(0xFFFFF3CD);
  static const Color error = Color(0xFFFF3B30);
  static const Color errorLight = Color(0xFFF8D7DA);
  
  // Light theme colors matching webapp
  static const Color lightBackground = Color(0xFFFAFAFA);
  static const Color lightSurface = Color(0xFFFFFFFF);
  static const Color lightSurfaceElevated = Color(0xFFFFFFFF);
  static const Color lightTextPrimary = Color(0xFF1C1C1E);
  static const Color lightTextSecondary = Color(0xFF8E8E93);
  static const Color lightTextTertiary = Color(0xFFC7C7CC);
  static const Color lightBorder = Color(0xFFE5E5EA);
  static const Color lightSeparator = Color(0xFFF2F2F7);
  
  // Dark theme colors matching webapp
  static const Color darkBackground = Color(0xFF121212);
  static const Color darkSurface = Color(0xFF1E1E1E);
  static const Color darkSurfaceElevated = Color(0xFF2C2C2E);
  static const Color darkTextPrimary = Color(0xFFFFFFFF);
  static const Color darkTextSecondary = Color(0xFFBEBEBE);
  static const Color darkTextTertiary = Color(0xFF8E8E93);
  static const Color darkBorder = Color(0xFF333333);
  static const Color darkSeparator = Color(0xFF2C2C2E);
  
  // Calendar specific colors
  static const Color calendarAvailable = success;
  static const Color calendarMaybe = warning;
  static const Color calendarUnavailable = error;
  
  // Professional gray palette
  static const Color gray50 = Color(0xFFFAFAFA);
  static const Color gray100 = Color(0xFFF5F5F5);
  static const Color gray200 = Color(0xFFEEEEEE);
  static const Color gray300 = Color(0xFFE0E0E0);
  static const Color gray400 = Color(0xFFBDBDBD);
  static const Color gray500 = Color(0xFF9E9E9E);
  static const Color gray600 = Color(0xFF757575);
  static const Color gray700 = Color(0xFF616161);
  static const Color gray800 = Color(0xFF424242);
  static const Color gray900 = Color(0xFF212121);
  
  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primary, primaryHover],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  
  static const LinearGradient surfaceGradient = LinearGradient(
    colors: [lightSurface, gray50],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  
  // Shadow colors
  static const Color shadowLight = Color(0x1A000000);
  static const Color shadowMedium = Color(0x33000000);
  static const Color shadowDark = Color(0x4D000000);
}

/// Extension to get colors based on brightness
extension AppColorsX on AppColors {
  static Color surfaceColor(Brightness brightness) {
    return brightness == Brightness.light 
        ? AppColors.lightSurface 
        : AppColors.darkSurface;
  }
  
  static Color backgroundColor(Brightness brightness) {
    return brightness == Brightness.light 
        ? AppColors.lightBackground 
        : AppColors.darkBackground;
  }
  
  static Color textPrimaryColor(Brightness brightness) {
    return brightness == Brightness.light 
        ? AppColors.lightTextPrimary 
        : AppColors.darkTextPrimary;
  }
  
  static Color textSecondaryColor(Brightness brightness) {
    return brightness == Brightness.light 
        ? AppColors.lightTextSecondary 
        : AppColors.darkTextSecondary;
  }
  
  static Color borderColor(Brightness brightness) {
    return brightness == Brightness.light 
        ? AppColors.lightBorder 
        : AppColors.darkBorder;
  }
}