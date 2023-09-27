package com.indigoapp.q20;

import com.facebook.react.bridge.Promise;

import com.tosantechno.pos.pax.e500.ConnectListener;
import com.tosantechno.pos.pax.e500.TrnManager;
//*/


public class PromiseConnectListener implements ConnectListener {

  private Promise promise;
  private TrnManager manager;

  private int retryCount = 1;

  public PromiseConnectListener(TrnManager manager, Promise p) {
    promise = p;
    this.manager = manager;
  }

  @Override
  public void onSucc() {
    promise.resolve(true);
  }

  @Override
  public void onError(String s) {
    // This is a workaround that first-time connection always fails in the E500 TrnManager API.
    // So we have a second try whenever the first try fails.
    if (retryCount <= 0) {
      promise.reject(Constants.E_Q20_USB_CONNECTION, s);
      return;
    }

    retryCount --;
    manager.connectToUSB(this);
  }
}

