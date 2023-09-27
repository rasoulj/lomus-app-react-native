package com.indigoapp.q20;

import com.facebook.react.bridge.Promise;

import com.tosantechno.pos.pax.e500.ConnectListener;

public class PromiseDisconnectListener implements ConnectListener {

  private Promise promise;

  private int retryCount = 1;

  public PromiseDisconnectListener(Promise p) {
    promise = p;
  }

  @Override
  public void onSucc() {
    promise.resolve(true);
  }

  @Override
  public void onError(String s) {
    promise.reject(Constants.E_Q20_USB_CONNECTION, s);
  }
}
