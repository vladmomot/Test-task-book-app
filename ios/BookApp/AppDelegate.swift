import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import RNBootSplash

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)
    
    // Make status bar transparent and set style
    if let window = window {
      window.backgroundColor = UIColor.clear
    }
    
    // Set status bar style to light content
    if #available(iOS 13.0, *) {
      // Status bar style will be controlled by React Native StatusBar component
    } else {
      UIApplication.shared.statusBarStyle = .lightContent
    }

    factory.startReactNative(
      withModuleName: "BookApp",
      in: window,
      launchOptions: launchOptions
    )
    
    // Initialize BootSplash after React Native is started
    DispatchQueue.main.async {
      if let rootViewController = self.window?.rootViewController {
        RNBootSplash.initWithStoryboard("BootSplash", rootView: rootViewController.view)
      }
    }

    return true
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
