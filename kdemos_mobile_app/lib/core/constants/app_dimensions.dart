import 'package:flutter_screenutil/flutter_screenutil.dart';

/// Application dimension constants for consistent spacing and sizing
class AppDimensions {
  // Private constructor to prevent instantiation
  AppDimensions._();

  // Spacing system (responsive using ScreenUtil)
  static double get space1 => 4.w;
  static double get space2 => 8.w;
  static double get space3 => 12.w;
  static double get space4 => 16.w;
  static double get space5 => 20.w;
  static double get space6 => 24.w;
  static double get space8 => 32.w;
  static double get space10 => 40.w;
  static double get space12 => 48.w;
  static double get space16 => 64.w;
  static double get space20 => 80.w;

  // Padding system
  static double get paddingXs => 4.w;
  static double get paddingSm => 8.w;
  static double get paddingMd => 16.w;
  static double get paddingLg => 24.w;
  static double get paddingXl => 32.w;
  static double get paddingXxl => 40.w;

  // Margin system
  static double get marginXs => 4.w;
  static double get marginSm => 8.w;
  static double get marginMd => 16.w;
  static double get marginLg => 24.w;
  static double get marginXl => 32.w;
  static double get marginXxl => 40.w;

  // Border radius system
  static double get radiusXs => 4.r;
  static double get radiusSm => 8.r;
  static double get radiusMd => 12.r;
  static double get radiusLg => 16.r;
  static double get radiusXl => 24.r;
  static double get radiusXxl => 32.r;
  static double get radiusXxxl => 40.r;

  // Icon sizes
  static double get iconXs => 12.w;
  static double get iconSm => 16.w;
  static double get iconMd => 20.w;
  static double get iconLg => 24.w;
  static double get iconXl => 32.w;
  static double get iconXxl => 40.w;

  // Button heights
  static double get buttonHeightSm => 32.h;
  static double get buttonHeightMd => 44.h;
  static double get buttonHeightLg => 52.h;
  static double get buttonHeightXl => 60.h;

  // Input field heights
  static double get inputHeightSm => 36.h;
  static double get inputHeightMd => 44.h;
  static double get inputHeightLg => 52.h;

  // Card dimensions
  static double get cardPadding => 16.w;
  static double get cardRadius => 12.r;
  static double get cardElevation => 0;

  // AppBar dimensions
  static double get appBarHeight => 56.h;
  static double get toolbarHeight => 72.h;

  // Tab bar dimensions
  static double get tabBarHeight => 48.h;

  // Bottom navigation bar dimensions
  static double get bottomNavHeight => 60.h;

  // Divider dimensions
  static double get dividerThickness => 1.h;

  // Avatar sizes
  static double get avatarSm => 24.w;
  static double get avatarMd => 32.w;
  static double get avatarLg => 40.w;
  static double get avatarXl => 48.w;
  static double get avatarXxl => 64.w;

  // Chip dimensions
  static double get chipHeight => 32.h;
  static double get chipPadding => 12.w;

  // Safe area padding
  static double get safeAreaTop => 44.h; // iPhone safe area
  static double get safeAreaBottom => 34.h; // iPhone safe area

  // Screen breakpoints for responsive design
  static const double mobileBreakpoint = 600;
  static const double tabletBreakpoint = 900;
  static const double desktopBreakpoint = 1200;

  // Calendar specific dimensions
  static double get calendarCellHeight => 80.h;
  static double get calendarCellMinHeight => 60.h;
  static double get calendarHeaderHeight => 40.h;

  // WebView dimensions
  static double get webViewPadding => 0;
  static double get webViewRadius => 0;

  // Splash screen dimensions
  static double get splashLogoSize => 120.w;
  static double get splashProgressSize => 24.w;

  // Animation durations (in milliseconds)
  static const int animationDurationFast = 150;
  static const int animationDurationMedium = 300;
  static const int animationDurationSlow = 500;
  static const int animationDurationVerySlow = 1000;

  // Shadow depths
  static double get shadowBlurSm => 3.r;
  static double get shadowBlurMd => 6.r;
  static double get shadowBlurLg => 12.r;
  static double get shadowBlurXl => 24.r;

  static double get shadowOffsetSm => 1.h;
  static double get shadowOffsetMd => 2.h;
  static double get shadowOffsetLg => 4.h;
  static double get shadowOffsetXl => 8.h;
}

/// Extension for responsive design helpers
extension AppDimensionsX on AppDimensions {
  /// Check if screen is mobile size
  static bool isMobile(double width) => width < AppDimensions.mobileBreakpoint;
  
  /// Check if screen is tablet size
  static bool isTablet(double width) => 
      width >= AppDimensions.mobileBreakpoint && width < AppDimensions.tabletBreakpoint;
  
  /// Check if screen is desktop size
  static bool isDesktop(double width) => width >= AppDimensions.tabletBreakpoint;
  
  /// Get responsive padding based on screen size
  static double getResponsivePadding(double width) {
    if (isMobile(width)) return AppDimensions.paddingMd;
    if (isTablet(width)) return AppDimensions.paddingLg;
    return AppDimensions.paddingXl;
  }
  
  /// Get responsive margin based on screen size
  static double getResponsiveMargin(double width) {
    if (isMobile(width)) return AppDimensions.marginMd;
    if (isTablet(width)) return AppDimensions.marginLg;
    return AppDimensions.marginXl;
  }
}