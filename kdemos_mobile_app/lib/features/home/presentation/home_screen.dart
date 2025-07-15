import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/router/app_router.dart';
import '../../../core/services/preferences_service.dart';

/// Home screen with options to access calendar or settings
class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with TickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  final TextEditingController _urlController = TextEditingController();
  final TextEditingController _calendarIdController = TextEditingController();
  final TextEditingController _userNameController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _initAnimations();
    _loadSavedData();
  }

  void _initAnimations() {
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));

    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeOutCubic,
    ));

    _animationController.forward();
  }

  void _loadSavedData() {
    setState(() {
      _urlController.text = PreferencesService.lastWebUrl;
      _userNameController.text = PreferencesService.userName ?? '';
      _calendarIdController.text = PreferencesService.lastCalendarId ?? '';
    });
  }

  @override
  void dispose() {
    _animationController.dispose();
    _urlController.dispose();
    _calendarIdController.dispose();
    _userNameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: Theme.of(context).brightness == Brightness.dark
          ? SystemUiOverlayStyle.light
          : SystemUiOverlayStyle.dark,
      child: Scaffold(
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        body: SafeArea(
          child: AnimatedBuilder(
            animation: _animationController,
            builder: (context, child) {
              return FadeTransition(
                opacity: _fadeAnimation,
                child: SlideTransition(
                  position: _slideAnimation,
                  child: _buildContent(),
                ),
              );
            },
          ),
        ),
      ),
    );
  }

  Widget _buildContent() {
    return SingleChildScrollView(
      padding: EdgeInsets.all(AppDimensions.paddingLg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(height: 20.h),
          
          // Header section
          _buildHeader(),
          
          SizedBox(height: 40.h),
          
          // Quick access cards
          _buildQuickAccessSection(),
          
          SizedBox(height: 32.h),
          
          // Web URL section
          _buildWebUrlSection(),
          
          SizedBox(height: 32.h),
          
          // Direct calendar access
          _buildDirectCalendarSection(),
          
          SizedBox(height: 32.h),
          
          // Recent calendars
          _buildRecentCalendarsSection(),
          
          SizedBox(height: 40.h),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              width: 48.w,
              height: 48.w,
              decoration: BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
              ),
              child: Icon(
                Icons.calendar_month_rounded,
                color: Colors.white,
                size: 24.w,
              ),
            ),
            SizedBox(width: 16.w),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Kdemos',
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).textTheme.headlineMedium?.color,
                    ),
                  ),
                  Text(
                    'Calendar Scheduling',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7),
                    ),
                  ),
                ],
              ),
            ),
            IconButton(
              onPressed: () => AppRouter.goToSettings(),
              icon: Icon(
                Icons.settings_outlined,
                size: 24.w,
                color: Theme.of(context).iconTheme.color,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildQuickAccessSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Quick Access',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
        
        SizedBox(height: 16.h),
        
        Row(
          children: [
            Expanded(
              child: _buildQuickAccessCard(
                icon: Icons.web,
                title: 'Open Web App',
                subtitle: 'Access full features',
                onTap: () => _openWebApp(),
              ),
            ),
            SizedBox(width: 12.w),
            Expanded(
              child: _buildQuickAccessCard(
                icon: Icons.calendar_today,
                title: 'New Calendar',
                subtitle: 'Create schedule',
                onTap: () => _createNewCalendar(),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildQuickAccessCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
        child: Container(
          padding: EdgeInsets.all(AppDimensions.paddingMd),
          decoration: BoxDecoration(
            color: Theme.of(context).cardColor,
            borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
            border: Border.all(
              color: Theme.of(context).dividerColor.withOpacity(0.2),
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 40.w,
                height: 40.w,
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(AppDimensions.radiusSm),
                ),
                child: Icon(
                  icon,
                  color: AppColors.primary,
                  size: 20.w,
                ),
              ),
              
              SizedBox(height: 12.h),
              
              Text(
                title,
                style: Theme.of(context).textTheme.titleSmall?.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
              
              SizedBox(height: 4.h),
              
              Text(
                subtitle,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: Theme.of(context).textTheme.bodySmall?.color?.withOpacity(0.7),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildWebUrlSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Web Application URL',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
        
        SizedBox(height: 12.h),
        
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: _urlController,
                decoration: InputDecoration(
                  hintText: 'https://localhost:3000',
                  prefixIcon: Icon(Icons.link, size: 20.w),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppDimensions.radiusSm),
                  ),
                  contentPadding: EdgeInsets.symmetric(
                    horizontal: AppDimensions.paddingMd,
                    vertical: AppDimensions.paddingSm,
                  ),
                ),
                style: Theme.of(context).textTheme.bodyMedium,
              ),
            ),
            
            SizedBox(width: 12.w),
            
            ElevatedButton(
              onPressed: _openWebApp,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(AppDimensions.radiusSm),
                ),
                padding: EdgeInsets.symmetric(
                  horizontal: AppDimensions.paddingMd,
                  vertical: AppDimensions.paddingSm + 4.h,
                ),
              ),
              child: Text('Open'),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildDirectCalendarSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Direct Calendar Access',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
        
        SizedBox(height: 12.h),
        
        TextField(
          controller: _calendarIdController,
          decoration: InputDecoration(
            hintText: 'Calendar ID',
            prefixIcon: Icon(Icons.calendar_month, size: 20.w),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppDimensions.radiusSm),
            ),
            contentPadding: EdgeInsets.symmetric(
              horizontal: AppDimensions.paddingMd,
              vertical: AppDimensions.paddingSm,
            ),
          ),
          style: Theme.of(context).textTheme.bodyMedium,
        ),
        
        SizedBox(height: 12.h),
        
        TextField(
          controller: _userNameController,
          decoration: InputDecoration(
            hintText: 'Your name (optional)',
            prefixIcon: Icon(Icons.person, size: 20.w),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppDimensions.radiusSm),
            ),
            contentPadding: EdgeInsets.symmetric(
              horizontal: AppDimensions.paddingMd,
              vertical: AppDimensions.paddingSm,
            ),
          ),
          style: Theme.of(context).textTheme.bodyMedium,
        ),
        
        SizedBox(height: 16.h),
        
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: _openDirectCalendar,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(AppDimensions.radiusSm),
              ),
              padding: EdgeInsets.symmetric(vertical: AppDimensions.paddingMd),
            ),
            child: Text('Open Calendar'),
          ),
        ),
      ],
    );
  }

  Widget _buildRecentCalendarsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Recent Calendars',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
        
        SizedBox(height: 12.h),
        
        FutureBuilder<List<String>>(
          future: Future.value(PreferencesService.recentCalendars),
          builder: (context, snapshot) {
            final recentCalendars = snapshot.data ?? [];
            
            if (recentCalendars.isEmpty) {
              return Container(
                width: double.infinity,
                padding: EdgeInsets.all(AppDimensions.paddingLg),
                decoration: BoxDecoration(
                  color: Theme.of(context).cardColor,
                  borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
                  border: Border.all(
                    color: Theme.of(context).dividerColor.withOpacity(0.2),
                  ),
                ),
                child: Column(
                  children: [
                    Icon(
                      Icons.calendar_month_outlined,
                      size: 48.w,
                      color: Theme.of(context).iconTheme.color?.withOpacity(0.3),
                    ),
                    SizedBox(height: 8.h),
                    Text(
                      'No recent calendars',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7),
                      ),
                    ),
                  ],
                ),
              );
            }
            
            return Column(
              children: recentCalendars.take(5).map((calendarId) {
                return Container(
                  margin: EdgeInsets.only(bottom: 8.h),
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: () => _openRecentCalendar(calendarId),
                      borderRadius: BorderRadius.circular(AppDimensions.radiusSm),
                      child: Container(
                        padding: EdgeInsets.all(AppDimensions.paddingMd),
                        decoration: BoxDecoration(
                          color: Theme.of(context).cardColor,
                          borderRadius: BorderRadius.circular(AppDimensions.radiusSm),
                          border: Border.all(
                            color: Theme.of(context).dividerColor.withOpacity(0.2),
                          ),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              Icons.calendar_today,
                              size: 20.w,
                              color: AppColors.primary,
                            ),
                            SizedBox(width: 12.w),
                            Expanded(
                              child: Text(
                                calendarId,
                                style: Theme.of(context).textTheme.bodyMedium,
                              ),
                            ),
                            Icon(
                              Icons.arrow_forward_ios,
                              size: 16.w,
                              color: Theme.of(context).iconTheme.color?.withOpacity(0.5),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                );
              }).toList(),
            );
          },
        ),
      ],
    );
  }

  Future<void> _openWebApp() async {
    final url = _urlController.text.trim();
    if (url.isNotEmpty) {
      await PreferencesService.setLastWebUrl(url);
      AppRouter.goToWebView(url: url, title: 'Kdemos');
    }
  }

  Future<void> _createNewCalendar() async {
    final url = _urlController.text.trim();
    if (url.isNotEmpty) {
      await PreferencesService.setLastWebUrl(url);
      AppRouter.goToWebView(url: url, title: 'New Calendar');
    }
  }

  Future<void> _openDirectCalendar() async {
    final calendarId = _calendarIdController.text.trim();
    final userName = _userNameController.text.trim();
    
    if (calendarId.isNotEmpty) {
      if (userName.isNotEmpty) {
        await PreferencesService.setUserName(userName);
      }
      await PreferencesService.setLastCalendarId(calendarId);
      await PreferencesService.addRecentCalendar(calendarId);
      
      AppRouter.goToCalendar(calendarId, userName: userName.isNotEmpty ? userName : null);
    }
  }

  Future<void> _openRecentCalendar(String calendarId) async {
    final userName = PreferencesService.userName;
    await PreferencesService.addRecentCalendar(calendarId);
    
    AppRouter.goToCalendar(calendarId, userName: userName);
  }
}