import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/router/app_router.dart';
import '../../../core/services/preferences_service.dart';
import '../../../core/services/connectivity_service.dart';

/// Settings screen with app preferences and information
class SettingsScreen extends StatefulWidget {
  const SettingsScreen({Key? key}) : super(key: key);

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  String _appVersion = '';
  String _connectionStatus = '';
  bool _pushNotifications = true;
  String _themeMode = 'system';
  String _language = 'system';
  String _defaultUrl = '';

  @override
  void initState() {
    super.initState();
    _loadSettings();
    _loadAppInfo();
    _loadConnectionStatus();
  }

  Future<void> _loadSettings() async {
    setState(() {
      _pushNotifications = PreferencesService.pushNotificationsEnabled;
      _themeMode = PreferencesService.themeMode;
      _language = PreferencesService.language;
      _defaultUrl = PreferencesService.lastWebUrl;
    });
  }

  Future<void> _loadAppInfo() async {
    final packageInfo = await PackageInfo.fromPlatform();
    setState(() {
      _appVersion = packageInfo.version;
    });
  }

  Future<void> _loadConnectionStatus() async {
    final connectivityService = ConnectivityService();
    final status = await connectivityService.getConnectivityStatus();
    setState(() {
      _connectionStatus = status;
    });
    connectivityService.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: Theme.of(context).brightness == Brightness.dark
          ? SystemUiOverlayStyle.light
          : SystemUiOverlayStyle.dark,
      child: Scaffold(
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        appBar: _buildAppBar(),
        body: _buildBody(),
      ),
    );
  }

  PreferredSizeWidget _buildAppBar() {
    return AppBar(
      backgroundColor: Theme.of(context).appBarTheme.backgroundColor,
      foregroundColor: Theme.of(context).appBarTheme.foregroundColor,
      elevation: 0,
      leading: IconButton(
        icon: Icon(Icons.arrow_back, size: 24.w),
        onPressed: () => AppRouter.goBack(),
      ),
      title: Text(
        'Settings',
        style: Theme.of(context).textTheme.titleLarge?.copyWith(
          fontWeight: FontWeight.w600,
        ),
      ),
      centerTitle: false,
    );
  }

  Widget _buildBody() {
    return SingleChildScrollView(
      padding: EdgeInsets.all(AppDimensions.paddingMd),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // App Preferences Section
          _buildSectionTitle('App Preferences'),
          _buildPreferencesSection(),
          
          SizedBox(height: 32.h),
          
          // Default Settings Section
          _buildSectionTitle('Default Settings'),
          _buildDefaultSettingsSection(),
          
          SizedBox(height: 32.h),
          
          // Data Management Section
          _buildSectionTitle('Data Management'),
          _buildDataManagementSection(),
          
          SizedBox(height: 32.h),
          
          // App Information Section
          _buildSectionTitle('App Information'),
          _buildAppInfoSection(),
          
          SizedBox(height: 32.h),
          
          // Support Section
          _buildSectionTitle('Support'),
          _buildSupportSection(),
          
          SizedBox(height: 40.h),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: EdgeInsets.only(bottom: 16.h),
      child: Text(
        title,
        style: Theme.of(context).textTheme.titleMedium?.copyWith(
          fontWeight: FontWeight.w600,
          color: AppColors.primary,
        ),
      ),
    );
  }

  Widget _buildPreferencesSection() {
    return _buildSettingsCard([
      _buildSwitchTile(
        icon: Icons.notifications_outlined,
        title: 'Push Notifications',
        subtitle: 'Receive calendar reminders',
        value: _pushNotifications,
        onChanged: _togglePushNotifications,
      ),
      
      _buildDivider(),
      
      _buildActionTile(
        icon: Icons.palette_outlined,
        title: 'Theme',
        subtitle: _getThemeDisplayName(_themeMode),
        onTap: _showThemeSelector,
      ),
      
      _buildDivider(),
      
      _buildActionTile(
        icon: Icons.language_outlined,
        title: 'Language',
        subtitle: _getLanguageDisplayName(_language),
        onTap: _showLanguageSelector,
      ),
    ]);
  }

  Widget _buildDefaultSettingsSection() {
    return _buildSettingsCard([
      _buildActionTile(
        icon: Icons.link_outlined,
        title: 'Default Web URL',
        subtitle: _defaultUrl.isNotEmpty ? _defaultUrl : 'Not set',
        onTap: _editDefaultUrl,
      ),
    ]);
  }

  Widget _buildDataManagementSection() {
    return _buildSettingsCard([
      _buildActionTile(
        icon: Icons.history,
        title: 'Clear Recent Calendars',
        subtitle: 'Remove calendar history',
        onTap: _clearRecentCalendars,
        textColor: Colors.orange,
      ),
      
      _buildDivider(),
      
      _buildActionTile(
        icon: Icons.person_remove_outlined,
        title: 'Clear User Data',
        subtitle: 'Reset saved preferences',
        onTap: _clearUserData,
        textColor: Colors.red,
      ),
      
      _buildDivider(),
      
      _buildActionTile(
        icon: Icons.delete_sweep_outlined,
        title: 'Reset All Settings',
        subtitle: 'Restore default settings',
        onTap: _resetAllSettings,
        textColor: Colors.red,
      ),
    ]);
  }

  Widget _buildAppInfoSection() {
    return _buildSettingsCard([
      _buildInfoTile(
        icon: Icons.info_outlined,
        title: 'App Version',
        subtitle: _appVersion.isNotEmpty ? 'v$_appVersion' : 'Loading...',
      ),
      
      _buildDivider(),
      
      _buildInfoTile(
        icon: Icons.wifi_outlined,
        title: 'Connection Status',
        subtitle: _connectionStatus.isNotEmpty ? _connectionStatus : 'Checking...',
      ),
      
      _buildDivider(),
      
      _buildActionTile(
        icon: Icons.system_update_outlined,
        title: 'Check for Updates',
        subtitle: 'Look for app updates',
        onTap: _checkForUpdates,
      ),
    ]);
  }

  Widget _buildSupportSection() {
    return _buildSettingsCard([
      _buildActionTile(
        icon: Icons.help_outline,
        title: 'Help & FAQ',
        subtitle: 'Get help using the app',
        onTap: _openHelp,
      ),
      
      _buildDivider(),
      
      _buildActionTile(
        icon: Icons.bug_report_outlined,
        title: 'Report a Bug',
        subtitle: 'Send feedback to developers',
        onTap: _reportBug,
      ),
      
      _buildDivider(),
      
      _buildActionTile(
        icon: Icons.privacy_tip_outlined,
        title: 'Privacy Policy',
        subtitle: 'View privacy information',
        onTap: _openPrivacyPolicy,
      ),
      
      _buildDivider(),
      
      _buildActionTile(
        icon: Icons.description_outlined,
        title: 'Terms of Service',
        subtitle: 'View terms and conditions',
        onTap: _openTermsOfService,
      ),
    ]);
  }

  Widget _buildSettingsCard(List<Widget> children) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
        border: Border.all(
          color: Theme.of(context).dividerColor.withOpacity(0.2),
        ),
      ),
      child: Column(children: children),
    );
  }

  Widget _buildSwitchTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return ListTile(
      leading: Icon(icon, size: 24.w, color: AppColors.primary),
      title: Text(
        title,
        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
          fontWeight: FontWeight.w500,
        ),
      ),
      subtitle: Text(
        subtitle,
        style: Theme.of(context).textTheme.bodySmall?.copyWith(
          color: Theme.of(context).textTheme.bodySmall?.color?.withOpacity(0.7),
        ),
      ),
      trailing: Switch(
        value: value,
        onChanged: onChanged,
        activeColor: AppColors.primary,
      ),
      contentPadding: EdgeInsets.symmetric(
        horizontal: AppDimensions.paddingMd,
        vertical: AppDimensions.paddingXs,
      ),
    );
  }

  Widget _buildActionTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
    Color? textColor,
  }) {
    return ListTile(
      leading: Icon(icon, size: 24.w, color: textColor ?? AppColors.primary),
      title: Text(
        title,
        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
          fontWeight: FontWeight.w500,
          color: textColor,
        ),
      ),
      subtitle: Text(
        subtitle,
        style: Theme.of(context).textTheme.bodySmall?.copyWith(
          color: (textColor ?? Theme.of(context).textTheme.bodySmall?.color)?.withOpacity(0.7),
        ),
      ),
      trailing: Icon(
        Icons.arrow_forward_ios,
        size: 16.w,
        color: Theme.of(context).iconTheme.color?.withOpacity(0.5),
      ),
      onTap: onTap,
      contentPadding: EdgeInsets.symmetric(
        horizontal: AppDimensions.paddingMd,
        vertical: AppDimensions.paddingXs,
      ),
    );
  }

  Widget _buildInfoTile({
    required IconData icon,
    required String title,
    required String subtitle,
  }) {
    return ListTile(
      leading: Icon(icon, size: 24.w, color: AppColors.primary),
      title: Text(
        title,
        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
          fontWeight: FontWeight.w500,
        ),
      ),
      subtitle: Text(
        subtitle,
        style: Theme.of(context).textTheme.bodySmall?.copyWith(
          color: Theme.of(context).textTheme.bodySmall?.color?.withOpacity(0.7),
        ),
      ),
      contentPadding: EdgeInsets.symmetric(
        horizontal: AppDimensions.paddingMd,
        vertical: AppDimensions.paddingXs,
      ),
    );
  }

  Widget _buildDivider() {
    return Divider(
      height: 1,
      thickness: 1,
      color: Theme.of(context).dividerColor.withOpacity(0.1),
      indent: 56.w,
    );
  }

  // Settings actions
  Future<void> _togglePushNotifications(bool value) async {
    await PreferencesService.setPushNotificationsEnabled(value);
    setState(() {
      _pushNotifications = value;
    });
  }

  void _showThemeSelector() {
    showModalBottomSheet(
      context: context,
      builder: (context) => _buildThemeSelector(),
    );
  }

  void _showLanguageSelector() {
    showModalBottomSheet(
      context: context,
      builder: (context) => _buildLanguageSelector(),
    );
  }

  Widget _buildThemeSelector() {
    final themes = [
      {'value': 'system', 'title': 'System Default', 'subtitle': 'Follow system theme'},
      {'value': 'light', 'title': 'Light', 'subtitle': 'Light theme always'},
      {'value': 'dark', 'title': 'Dark', 'subtitle': 'Dark theme always'},
    ];

    return Container(
      padding: EdgeInsets.all(AppDimensions.paddingMd),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            'Choose Theme',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
          SizedBox(height: 16.h),
          ...themes.map((theme) => RadioListTile<String>(
            value: theme['value']!,
            groupValue: _themeMode,
            onChanged: (value) async {
              if (value != null) {
                await PreferencesService.setThemeMode(value);
                setState(() {
                  _themeMode = value;
                });
                Navigator.pop(context);
              }
            },
            title: Text(theme['title']!),
            subtitle: Text(theme['subtitle']!),
            activeColor: AppColors.primary,
          )),
        ],
      ),
    );
  }

  Widget _buildLanguageSelector() {
    final languages = [
      {'value': 'system', 'title': 'System Default', 'subtitle': 'Follow system language'},
      {'value': 'en', 'title': 'English', 'subtitle': 'English language'},
      {'value': 'es', 'title': 'Español', 'subtitle': 'Spanish language'},
    ];

    return Container(
      padding: EdgeInsets.all(AppDimensions.paddingMd),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            'Choose Language',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
          SizedBox(height: 16.h),
          ...languages.map((language) => RadioListTile<String>(
            value: language['value']!,
            groupValue: _language,
            onChanged: (value) async {
              if (value != null) {
                await PreferencesService.setLanguage(value);
                setState(() {
                  _language = value;
                });
                Navigator.pop(context);
              }
            },
            title: Text(language['title']!),
            subtitle: Text(language['subtitle']!),
            activeColor: AppColors.primary,
          )),
        ],
      ),
    );
  }

  void _editDefaultUrl() {
    final controller = TextEditingController(text: _defaultUrl);
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Default Web URL'),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(
            hintText: 'https://localhost:3000',
            border: OutlineInputBorder(),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              final newUrl = controller.text.trim();
              if (newUrl.isNotEmpty) {
                await PreferencesService.setLastWebUrl(newUrl);
                setState(() {
                  _defaultUrl = newUrl;
                });
              }
              Navigator.pop(context);
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  void _clearRecentCalendars() {
    _showConfirmationDialog(
      'Clear Recent Calendars',
      'This will remove all recent calendar history. This action cannot be undone.',
      () async {
        await PreferencesService.clearRecentCalendars();
        _showSnackBar('Recent calendars cleared');
      },
    );
  }

  void _clearUserData() {
    _showConfirmationDialog(
      'Clear User Data',
      'This will remove your saved user name, calendar preferences, and recent calendars. App settings will be preserved.',
      () async {
        await PreferencesService.clearUserData();
        _showSnackBar('User data cleared');
        _loadSettings();
      },
    );
  }

  void _resetAllSettings() {
    _showConfirmationDialog(
      'Reset All Settings',
      'This will restore all settings to their default values and clear all saved data. This action cannot be undone.',
      () async {
        await PreferencesService.clearAll();
        _showSnackBar('All settings reset');
        _loadSettings();
      },
    );
  }

  void _showConfirmationDialog(String title, String content, VoidCallback onConfirm) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(title),
        content: Text(content),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              onConfirm();
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Confirm'),
          ),
        ],
      ),
    );
  }

  void _checkForUpdates() {
    _showSnackBar('App is up to date');
  }

  void _openHelp() {
    _launchUrl('https://kdemos.com/help');
  }

  void _reportBug() {
    _launchUrl('https://kdemos.com/support');
  }

  void _openPrivacyPolicy() {
    _launchUrl('https://kdemos.com/privacy');
  }

  void _openTermsOfService() {
    _launchUrl('https://kdemos.com/terms');
  }

  Future<void> _launchUrl(String url) async {
    try {
      final uri = Uri.parse(url);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri);
      } else {
        _showSnackBar('Cannot open URL');
      }
    } catch (e) {
      _showSnackBar('Error opening URL');
    }
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  String _getThemeDisplayName(String theme) {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
      default:
        return 'System Default';
    }
  }

  String _getLanguageDisplayName(String language) {
    switch (language) {
      case 'en':
        return 'English';
      case 'es':
        return 'Español';
      case 'system':
      default:
        return 'System Default';
    }
  }
}