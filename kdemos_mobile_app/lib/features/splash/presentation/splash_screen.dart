import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/router/app_router.dart';
import '../bloc/splash_bloc.dart';
import '../bloc/splash_event.dart';
import '../bloc/splash_state.dart';

/// Professional splash screen with animated logo and progress indicator
class SplashScreen extends StatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with TickerProviderStateMixin {
  late AnimationController _logoAnimationController;
  late AnimationController _progressAnimationController;
  late Animation<double> _logoScaleAnimation;
  late Animation<double> _logoOpacityAnimation;
  late Animation<double> _progressOpacityAnimation;

  @override
  void initState() {
    super.initState();
    _initAnimations();
    _triggerSplashStart();
  }

  void _initAnimations() {
    // Logo animation controller
    _logoAnimationController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );

    // Progress animation controller
    _progressAnimationController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    // Logo animations
    _logoScaleAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _logoAnimationController,
      curve: Curves.elasticOut,
    ));

    _logoOpacityAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _logoAnimationController,
      curve: const Interval(0.0, 0.6, curve: Curves.easeInOut),
    ));

    // Progress animation
    _progressOpacityAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _progressAnimationController,
      curve: Curves.easeInOut,
    ));

    // Start logo animation
    _logoAnimationController.forward();
    
    // Start progress animation after logo
    Future.delayed(const Duration(milliseconds: 800), () {
      if (mounted) {
        _progressAnimationController.forward();
      }
    });
  }

  void _triggerSplashStart() {
    // Trigger the splash initialization
    context.read<SplashBloc>().add(const AppStarted());
  }

  @override
  void dispose() {
    _logoAnimationController.dispose();
    _progressAnimationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.light.copyWith(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.light,
      ),
      child: Scaffold(
        backgroundColor: AppColors.primary,
        body: BlocListener<SplashBloc, SplashState>(
          listener: (context, state) {
            if (state is SplashCompleted) {
              // Navigate to home screen after completion
              Future.delayed(const Duration(milliseconds: 500), () {
                if (mounted) {
                  AppRouter.goHome();
                }
              });
            } else if (state is SplashError) {
              // Show error and navigate to home after delay
              Future.delayed(const Duration(milliseconds: 2000), () {
                if (mounted) {
                  AppRouter.goHome();
                }
              });
            }
          },
          child: SafeArea(
            child: SizedBox.expand(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Spacer to push content up slightly
                  SizedBox(height: 80.h),
                  
                  // Logo section
                  Expanded(
                    flex: 3,
                    child: Center(
                      child: AnimatedBuilder(
                        animation: _logoAnimationController,
                        builder: (context, child) {
                          return Transform.scale(
                            scale: _logoScaleAnimation.value,
                            child: Opacity(
                              opacity: _logoOpacityAnimation.value,
                              child: _buildLogo(),
                            ),
                          );
                        },
                      ),
                    ),
                  ),

                  // Status and progress section
                  Expanded(
                    flex: 2,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        // App name
                        Text(
                          'Kdemos',
                          style: TextStyle(
                            fontSize: 32.sp,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                            letterSpacing: 1.2,
                          ),
                        ),
                        
                        SizedBox(height: 8.h),
                        
                        // Subtitle
                        Text(
                          'Calendar Scheduling',
                          style: TextStyle(
                            fontSize: 16.sp,
                            color: Colors.white70,
                            fontWeight: FontWeight.w300,
                          ),
                        ),
                        
                        SizedBox(height: 40.h),
                        
                        // Progress section
                        AnimatedBuilder(
                          animation: _progressAnimationController,
                          builder: (context, child) {
                            return Opacity(
                              opacity: _progressOpacityAnimation.value,
                              child: _buildProgressSection(),
                            );
                          },
                        ),
                      ],
                    ),
                  ),

                  // Bottom section
                  Padding(
                    padding: EdgeInsets.only(bottom: 40.h),
                    child: Text(
                      'Powered by Flutter',
                      style: TextStyle(
                        fontSize: 12.sp,
                        color: Colors.white54,
                        fontWeight: FontWeight.w300,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLogo() {
    return Container(
      width: AppDimensions.splashLogoSize,
      height: AppDimensions.splashLogoSize,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppDimensions.radiusXl),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: AppDimensions.shadowBlurLg,
            offset: Offset(0, AppDimensions.shadowOffsetMd),
          ),
        ],
      ),
      child: Icon(
        Icons.calendar_month_rounded,
        size: 60.w,
        color: AppColors.primary,
      ),
    );
  }

  Widget _buildProgressSection() {
    return BlocBuilder<SplashBloc, SplashState>(
      builder: (context, state) {
        String message = 'Starting up...';
        double progress = 0.0;
        bool showError = false;

        if (state is SplashLoading) {
          message = state.message ?? 'Loading...';
          progress = state.progress ?? 0.0;
        } else if (state is SplashCompleted) {
          message = 'Ready!';
          progress = 1.0;
        } else if (state is SplashError) {
          message = 'Something went wrong';
          showError = true;
        }

        return Column(
          children: [
            // Status message
            Container(
              height: 24.h,
              child: Text(
                message,
                style: TextStyle(
                  fontSize: 14.sp,
                  color: showError ? Colors.red[300] : Colors.white,
                  fontWeight: FontWeight.w400,
                ),
                textAlign: TextAlign.center,
              ),
            ),
            
            SizedBox(height: 24.h),
            
            // Progress indicator
            if (!showError) ...[
              Container(
                width: 200.w,
                height: 4.h,
                decoration: BoxDecoration(
                  color: Colors.white24,
                  borderRadius: BorderRadius.circular(2.r),
                ),
                child: FractionallySizedBox(
                  alignment: Alignment.centerLeft,
                  widthFactor: progress,
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(2.r),
                    ),
                  ),
                ),
              ),
            ] else ...[
              // Error icon
              Icon(
                Icons.error_outline,
                size: 24.w,
                color: Colors.red[300],
              ),
            ],
          ],
        );
      },
    );
  }
}