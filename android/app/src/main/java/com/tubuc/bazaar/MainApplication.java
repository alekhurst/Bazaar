package com.tubuc.bazaar;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.microsoft.codepush.react.CodePush;
import com.joshblour.reactnativepermissions.ReactNativePermissionsPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.sbugert.rnadmob.RNAdMobPackage;
import com.smixx.fabric.FabricPackage;
import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;

import co.apptailor.googlesignin.RNGoogleSigninPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  @Override
  public void onCreate() {
    super.onCreate();
    Fabric.with(this, new Crashlytics());
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
            new ReactNativePermissionsPackage(),
            new FIRMessagingPackage(),
          new RNGoogleSigninPackage(),
          new RNAdMobPackage(),
          new RNSpinkitPackage(),
          new FabricPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
