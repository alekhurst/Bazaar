/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import "CodePush.h"

#import "RNGoogleSignin.h"
#import "Firebase.h" // if you are using Non Cocoapod approach
#import "RNFIRMessaging.h"

#import "RCTBundleURLProvider.h"
#import "RCTRootView.h"
#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  
  [Fabric with:@[[Crashlytics class]]];
  [FIRApp configure];

  [[RCTBundleURLProvider sharedSettings] setDefaults];
  
#ifdef DEBUG
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
#else
    jsCodeLocation = [CodePush bundleURL];
#endif

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"Bazaar"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
  
  return [RNGoogleSignin application:application openURL:url sourceApplication:sourceApplication annotation:annotation];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))handler {
  [[NSNotificationCenter defaultCenter] postNotificationName:FCMNotificationReceived object:self userInfo:notification];
  handler(UIBackgroundFetchResultNewData);
}

@end
