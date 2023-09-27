package com.indigoapp.q20;

import com.facebook.react.bridge.Promise;


import com.tosantechno.pos.pax.e500.ResponseTrnParam;
import com.tosantechno.pos.pax.e500.SendRequestListener;
//*/

public class PromiseSendRequestListener implements SendRequestListener {

  private Promise promise;

  public PromiseSendRequestListener(Promise p) {
    promise = p;
  }

  @Override
  public void onSucc(ResponseTrnParam responseTrnParam) {
    // TODO send response
    promise.resolve(true);
  }

  @Override
  public void onError(String s) {
    promise.reject(Constants.E_Q20_REQUEST, s);
  }
}
