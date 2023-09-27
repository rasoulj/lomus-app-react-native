package com.indigoapp.q20;

import com.facebook.react.bridge.Promise;


import com.tosantechno.pos.pax.e500.RequestTrnParam;
import com.tosantechno.pos.pax.e500.SendRequestListener;
import com.tosantechno.pos.pax.e500.SendVerifyListener;
import com.tosantechno.pos.pax.e500.TrnManager;

import java.math.BigDecimal;

public class PromiseSendVerifyListener implements SendVerifyListener {

  private Promise promise;
  private SendRequestListener requestListener;
  private String amount;
  private TrnManager _manager;

  public PromiseSendVerifyListener(String amount, TrnManager manager, SendRequestListener requestListener, Promise p) {
    this.amount = amount;
    _manager = manager;
    this.requestListener = requestListener;
    promise = p;
  }

  @Override
  public void onSucc(String s) {
    RequestTrnParam requestTrnParam = new RequestTrnParam("01", "000000", "01", amount, "", "", "", "", "", "", "", "", "", "", "", "");
    _manager.sendRequest(requestTrnParam, requestListener);
  }

  @Override
  public void onError(String s) {
    promise.reject(Constants.E_Q20_VERIFY, s);
  }
}
