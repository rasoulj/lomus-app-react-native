package com.indigoapp;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.microsoft.appcenter.reactnative.crashes.AppCenterReactNativeCrashesPackage;
import com.microsoft.appcenter.reactnative.analytics.AppCenterReactNativeAnalyticsPackage;
import com.microsoft.appcenter.reactnative.appcenter.AppCenterReactNativePackage;
import com.microsoft.codepush.react.CodePush;
import com.beefe.picker.PickerViewPackage;
import com.rnfs.RNFSPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import io.realm.react.RealmReactPackage;

import com.indigoapp.q20.Q20TransactionPackage;
import com.indigoapp.q20ras.Q20RasTransactionPackage;
import com.indigoapp.rasXPrinter.XPrinterRasTransactionPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.i18n.reactnativei18n.ReactNativeI18n;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.slowpath.hockeyapp.RNHockeyAppModule;
import com.slowpath.hockeyapp.RNHockeyAppPackage;

import com.indigoapp.printer.PrinterPackage;
import com.indigoapp.barcodescanner.BarcodeScannerPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
        }
    
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new RNHockeyAppPackage(MainApplication.this),
          new MainReactPackage(),
            new AppCenterReactNativeCrashesPackage(MainApplication.this, getResources().getString(R.string.appCenterCrashes_whenToSendCrashes)),
            new AppCenterReactNativeAnalyticsPackage(MainApplication.this, getResources().getString(R.string.appCenterAnalytics_whenToEnableAnalytics)),
            new AppCenterReactNativePackage(MainApplication.this),
            new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
            new PickerViewPackage(),
            new RNFSPackage(),
            new RNDeviceInfo(),
            new RNViewShotPackage(),
            new RealmReactPackage(),
            new VectorIconsPackage(),
            new RCTCameraPackage(),
            new ReactNativeI18n(),
            new PrinterPackage(),
            new Q20TransactionPackage(),
            new Q20RasTransactionPackage(),
            new BarcodeScannerPackage(),
            new XPrinterRasTransactionPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
