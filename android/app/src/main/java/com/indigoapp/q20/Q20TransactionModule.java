package com.indigoapp.q20;

import android.util.Log;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;

import com.indigoapp.MainActivity;


import com.tosantechno.pos.pax.e500.ConnectListener;
import com.tosantechno.pos.pax.e500.ItemMenuTrnParam;
import com.tosantechno.pos.pax.e500.RequestTrnParam;
import com.tosantechno.pos.pax.e500.ResponseTrnParam;
import com.tosantechno.pos.pax.e500.SendItemMenuListener;
import com.tosantechno.pos.pax.e500.SendRequestListener;
import com.tosantechno.pos.pax.e500.SendVerifyListener;
import com.tosantechno.pos.pax.e500.TrnManager;
//*/


public class Q20TransactionModule extends ReactContextBaseJavaModule {

  private static final String TAG = "Q20";

  private ReactApplicationContext reactContext;

  private Boolean _status;

  public Q20TransactionModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "Q20TransactionModule";
  }


  @ReactMethod
  public void connect(Promise promise) {
    Log.i(TAG, "Connect");
    TrnManager manager = MainActivity.getTransactionManager();
    try {
      ConnectListener connectListener = new PromiseConnectListener(manager, promise);
      manager.connectToUSB(connectListener);
    }
    catch (Exception ex) {
      promise.reject(Constants.E_Q20_USB_CONNECTION, ex);
    }
  }

  @ReactMethod
  public void disconnect(Promise promise) {
    Log.i(TAG, "Disconnect");
    try {
      TrnManager manager = MainActivity.getTransactionManager();
      ConnectListener listener = new PromiseDisconnectListener(promise);
      manager.disconnectUSB(listener);
    }
    catch (Exception ex) {
      promise.reject(Constants.E_Q20_USB_CONNECTION, ex);
    }
  }

  @ReactMethod
  private void transact(String amount, Promise promise) {
    Log.i(TAG, String.format("Transact %s", amount));
    try {
      TrnManager manager = MainActivity.getTransactionManager();
      SendRequestListener sendRequestListener = new PromiseSendRequestListener(promise);
      SendVerifyListener sendVerifyListener = new PromiseSendVerifyListener(
              amount, manager, sendRequestListener, promise);
      manager.sendVerify(sendVerifyListener);
    }
    catch (Exception ex) {
      promise.reject(Constants.E_Q20_TRANSACT, ex);
    }
  }

}
