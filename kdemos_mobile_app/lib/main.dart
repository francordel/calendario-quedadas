import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'core/router/app_router.dart';
import 'core/theme/app_theme.dart';
import 'core/services/connectivity_service.dart';
import 'core/services/preferences_service.dart';
import 'features/splash/bloc/splash_bloc.dart';
import 'features/splash/bloc/splash_event.dart';
import 'features/webview/bloc/webview_bloc.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize core services
  await PreferencesService.init();
  
  // Set preferred orientations for mobile optimization
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
    DeviceOrientation.landscapeLeft,
    DeviceOrientation.landscapeRight,
  ]);
  
  // Configure status bar for professional appearance
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      statusBarBrightness: Brightness.light,
    ),
  );
  
  runApp(const KdemosApp());
}

class KdemosApp extends StatelessWidget {
  const KdemosApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ScreenUtilInit(
      designSize: const Size(375, 812), // iPhone 12 Pro design size
      minTextAdapt: true,
      splitScreenMode: true,
      builder: (context, child) {
        return MultiBlocProvider(
          providers: [
            BlocProvider(
              create: (context) => SplashBloc()..add(const AppStarted()),
            ),
            BlocProvider(
              create: (context) => WebViewBloc(
                connectivityService: ConnectivityService(),
              ),
            ),
          ],
          child: MaterialApp.router(
            title: 'Kdemos - Calendar Scheduling',
            debugShowCheckedModeBanner: false,
            
            // Theme configuration matching webapp
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            themeMode: ThemeMode.system,
            
            // Router configuration
            routerConfig: AppRouter.router,
            
            // Localization
            supportedLocales: const [
              Locale('en', 'US'),
              Locale('es', 'ES'),
            ],
            
            builder: (context, widget) {
              // Ensure consistent UI across different screen densities
              return MediaQuery(
                data: MediaQuery.of(context).copyWith(
                  textScaler: TextScaler.linear(
                    MediaQuery.of(context).textScaler.scale(1.0).clamp(0.8, 1.3),
                  ),
                ),
                child: widget!,
              );
            },
          ),
        );
      },
    );
  }
}