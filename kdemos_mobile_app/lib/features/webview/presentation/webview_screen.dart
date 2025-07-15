import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:webview_flutter/webview_flutter.dart';

import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/router/app_router.dart';
import '../bloc/webview_bloc.dart';
import '../bloc/webview_event.dart';
import '../bloc/webview_state.dart';

/// Professional WebView screen with full navigation and connectivity handling
class WebViewScreen extends StatefulWidget {
  final String url;
  final String? title;
  final bool showAppBar;
  final bool enablePullToRefresh;
  final bool enableJavaScript;

  const WebViewScreen({
    Key? key,
    required this.url,
    this.title,
    this.showAppBar = true,
    this.enablePullToRefresh = true,
    this.enableJavaScript = true,
  }) : super(key: key);

  @override
  State<WebViewScreen> createState() => _WebViewScreenState();
}

class _WebViewScreenState extends State<WebViewScreen> {
  late WebViewController _webViewController;
  late WebViewBloc _webViewBloc;
  bool _isWebViewInitialized = false;

  @override
  void initState() {
    super.initState();
    _initWebView();
    _initBloc();
  }

  void _initWebView() {
    _webViewController = WebViewController()
      ..setJavaScriptMode(widget.enableJavaScript ? JavaScriptMode.unrestricted : JavaScriptMode.disabled)
      ..setBackgroundColor(Colors.white)
      ..setNavigationDelegate(
        NavigationDelegate(
          onProgress: (int progress) {
            _webViewBloc.add(WebViewProgressChanged(progress));
          },
          onPageStarted: (String url) {
            _webViewBloc.add(WebViewStartedLoading(url));
          },
          onPageFinished: (String url) {
            _webViewBloc.add(WebViewFinishedLoading(url));
            _updateNavigationButtons();
          },
          onWebResourceError: (WebResourceError error) {
            _webViewBloc.add(WebViewErrorOccurred(
              error.description,
              url: error.url,
            ));
          },
          onUrlChange: (UrlChange change) {
            if (change.url != null) {
              _webViewBloc.add(WebViewUrlChanged(change.url!));
            }
          },
        ),
      );

    _isWebViewInitialized = true;
  }

  void _initBloc() {
    _webViewBloc = BlocProvider.of<WebViewBloc>(context);
    _webViewBloc.add(WebViewInitialized(widget.url));
  }

  Future<void> _updateNavigationButtons() async {
    if (_isWebViewInitialized) {
      final canGoBack = await _webViewController.canGoBack();
      final canGoForward = await _webViewController.canGoForward();
      // Update bloc state with navigation capabilities
    }
  }

  @override
  void dispose() {
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
        appBar: widget.showAppBar ? _buildAppBar() : null,
        body: BlocListener<WebViewBloc, WebViewState>(
          listener: (context, state) {
            if (state is WebViewInitial || (state is WebViewLoading && state.progress == 0)) {
              _loadUrl();
            }
          },
          child: BlocBuilder<WebViewBloc, WebViewState>(
            builder: (context, state) {
              return Stack(
                children: [
                  // WebView
                  _buildWebView(),
                  
                  // Loading overlay
                  if (state is WebViewLoading && state.progress < 100)
                    _buildLoadingOverlay(state),
                  
                  // Error overlay
                  if (state is WebViewError)
                    _buildErrorOverlay(state),
                  
                  // Offline overlay
                  if (state is WebViewOffline)
                    _buildOfflineOverlay(state),
                ],
              );
            },
          ),
        ),
        bottomNavigationBar: widget.showAppBar ? _buildBottomNavigationBar() : null,
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
      title: BlocBuilder<WebViewBloc, WebViewState>(
        builder: (context, state) {
          String title = widget.title ?? 'Kdemos';
          
          if (state is WebViewLoaded && state.title != null) {
            title = state.title!;
          }
          
          return Text(
            title,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.w600,
            ),
            overflow: TextOverflow.ellipsis,
          );
        },
      ),
      actions: [
        BlocBuilder<WebViewBloc, WebViewState>(
          builder: (context, state) {
            if (state is WebViewLoading) {
              return Padding(
                padding: EdgeInsets.all(16.w),
                child: SizedBox(
                  width: 20.w,
                  height: 20.w,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
                  ),
                ),
              );
            }
            
            return IconButton(
              icon: Icon(Icons.refresh, size: 24.w),
              onPressed: () => _refreshPage(),
            );
          },
        ),
        
        PopupMenuButton<String>(
          icon: Icon(Icons.more_vert, size: 24.w),
          onSelected: _handleMenuAction,
          itemBuilder: (context) => [
            const PopupMenuItem(
              value: 'refresh',
              child: ListTile(
                leading: Icon(Icons.refresh),
                title: Text('Refresh'),
                contentPadding: EdgeInsets.zero,
              ),
            ),
            const PopupMenuItem(
              value: 'home',
              child: ListTile(
                leading: Icon(Icons.home),
                title: Text('Home'),
                contentPadding: EdgeInsets.zero,
              ),
            ),
            const PopupMenuItem(
              value: 'settings',
              child: ListTile(
                leading: Icon(Icons.settings),
                title: Text('Settings'),
                contentPadding: EdgeInsets.zero,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildWebView() {
    if (!_isWebViewInitialized) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    Widget webView = WebViewWidget(controller: _webViewController);

    if (widget.enablePullToRefresh) {
      return RefreshIndicator(
        onRefresh: _refreshPage,
        child: webView,
      );
    }

    return webView;
  }

  Widget _buildLoadingOverlay(WebViewLoading state) {
    return Container(
      color: Theme.of(context).scaffoldBackgroundColor.withOpacity(0.8),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(
              value: state.progress / 100,
              valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
            ),
            
            SizedBox(height: 16.h),
            
            Text(
              state.message ?? 'Loading...',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            
            SizedBox(height: 8.h),
            
            Text(
              '${state.progress}%',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: Theme.of(context).textTheme.bodySmall?.color?.withOpacity(0.7),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildErrorOverlay(WebViewError state) {
    return Container(
      color: Theme.of(context).scaffoldBackgroundColor,
      padding: EdgeInsets.all(AppDimensions.paddingLg),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              state.isConnected ? Icons.error_outline : Icons.wifi_off,
              size: 64.w,
              color: Colors.red,
            ),
            
            SizedBox(height: 24.h),
            
            Text(
              state.isConnected ? 'Failed to Load' : 'No Internet Connection',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
            
            SizedBox(height: 12.h),
            
            Text(
              state.message,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7),
              ),
              textAlign: TextAlign.center,
            ),
            
            SizedBox(height: 32.h),
            
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ElevatedButton(
                  onPressed: _refreshPage,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                  ),
                  child: const Text('Try Again'),
                ),
                
                SizedBox(width: 16.w),
                
                OutlinedButton(
                  onPressed: () => AppRouter.goHome(),
                  child: const Text('Go Home'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOfflineOverlay(WebViewOffline state) {
    return Container(
      color: Theme.of(context).scaffoldBackgroundColor,
      padding: EdgeInsets.all(AppDimensions.paddingLg),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.cloud_off,
              size: 64.w,
              color: Colors.orange,
            ),
            
            SizedBox(height: 24.h),
            
            Text(
              'You\'re Offline',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
            
            SizedBox(height: 12.h),
            
            Text(
              'Please check your internet connection and try again.',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7),
              ),
              textAlign: TextAlign.center,
            ),
            
            SizedBox(height: 32.h),
            
            ElevatedButton(
              onPressed: () {
                _webViewBloc.add(WebViewInitialized(state.lastUrl ?? widget.url));
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
              ),
              child: const Text('Retry'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomNavigationBar() {
    return Container(
      height: 60.h,
      decoration: BoxDecoration(
        color: Theme.of(context).bottomAppBarTheme.color,
        border: Border(
          top: BorderSide(
            color: Theme.of(context).dividerColor.withOpacity(0.2),
            width: 1,
          ),
        ),
      ),
      child: BlocBuilder<WebViewBloc, WebViewState>(
        builder: (context, state) {
          final canGoBack = state is WebViewLoaded ? state.canGoBack : false;
          final canGoForward = state is WebViewLoaded ? state.canGoForward : false;
          
          return Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              IconButton(
                onPressed: canGoBack ? _goBack : null,
                icon: Icon(
                  Icons.arrow_back_ios,
                  size: 20.w,
                  color: canGoBack 
                      ? Theme.of(context).iconTheme.color 
                      : Theme.of(context).iconTheme.color?.withOpacity(0.3),
                ),
              ),
              
              IconButton(
                onPressed: canGoForward ? _goForward : null,
                icon: Icon(
                  Icons.arrow_forward_ios,
                  size: 20.w,
                  color: canGoForward 
                      ? Theme.of(context).iconTheme.color 
                      : Theme.of(context).iconTheme.color?.withOpacity(0.3),
                ),
              ),
              
              IconButton(
                onPressed: _refreshPage,
                icon: Icon(
                  Icons.refresh,
                  size: 20.w,
                  color: Theme.of(context).iconTheme.color,
                ),
              ),
              
              IconButton(
                onPressed: () => AppRouter.goHome(),
                icon: Icon(
                  Icons.home,
                  size: 20.w,
                  color: Theme.of(context).iconTheme.color,
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Future<void> _loadUrl() async {
    if (_isWebViewInitialized) {
      await _webViewController.loadRequest(Uri.parse(widget.url));
    }
  }

  Future<void> _refreshPage() async {
    if (_isWebViewInitialized) {
      _webViewBloc.add(const WebViewRefreshed());
      await _webViewController.reload();
    }
  }

  Future<void> _goBack() async {
    if (_isWebViewInitialized && await _webViewController.canGoBack()) {
      _webViewBloc.add(const WebViewNavigateBack());
      await _webViewController.goBack();
      _updateNavigationButtons();
    }
  }

  Future<void> _goForward() async {
    if (_isWebViewInitialized && await _webViewController.canGoForward()) {
      _webViewBloc.add(const WebViewNavigateForward());
      await _webViewController.goForward();
      _updateNavigationButtons();
    }
  }

  void _handleMenuAction(String action) {
    switch (action) {
      case 'refresh':
        _refreshPage();
        break;
      case 'home':
        AppRouter.goHome();
        break;
      case 'settings':
        AppRouter.goToSettings();
        break;
    }
  }
}