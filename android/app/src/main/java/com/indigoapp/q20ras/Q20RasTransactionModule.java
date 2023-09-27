package com.indigoapp.q20ras;

import android.os.Handler;
import android.os.Message;

import org.json.JSONObject;


import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.indigoapp.MainActivity;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.tosantechno.pax.easylink.*;

import java.util.concurrent.*;
import android.util.Log;
//import com.tosantechno.pax.easylink.DeviceBasic;
//import com.tosantechno.pax.easylink.TrnManager;

public class Q20RasTransactionModule extends ReactContextBaseJavaModule {

  public static byte[] hexToBytes(String s) {
    int len = s.length();
    byte[] data = new byte[len / 2];
    for (int i = 0; i < len; i += 2) {
      data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
        + Character.digit(s.charAt(i + 1), 16));
    }
    return data;
  }

  private ExecutorService backgroundExecutor;

  abstract class RasTask implements Runnable {
    public Promise promise;
    TrnManager trnManager;
    public DeviceBasic deviceBasic;

    public RasTask(Promise pr) {
      promise = pr;
    }

    public boolean preRun() {
      return preRun(true);
    }

    public boolean preRun(boolean checkReady) {
      try {
        deviceBasic = MainActivity.getDeviceBasic();
        if (deviceBasic == null) {
          promise.reject("deviceBasic == null", RasTag);
          return false;
        } else if (!deviceBasic.connectQ20()) {
          promise.reject("Not Connected!!!", RasTag);
          return false;
        } else {
          trnManager = MainActivity.getTrnManager();
          if (trnManager == null) {
            promise.reject("trnManager == null", RasTag);
            return false;
          }


          if (checkReady && !trnManager.checkReadyForTrn()) {
            promise.reject("Not ready for transaction", RasTag);
            return false;
          }
          //*/

          return true;
        }

      } catch (ParsException e) {
        promise.reject(e.getMessage(), RasTag+"1");
        e.printStackTrace();
        return false;
      }
    }
  }

  private static final String RasTag = "Ras-ERROR:";

  private ReactApplicationContext reactContext;

  public Q20RasTransactionModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;

    class MyThreadFactory implements ThreadFactory {

      public MyThreadFactory() {
      }

      public Thread newThread(Runnable runnable) {
        Thread thread = new Thread(runnable, "Background executor service");
        thread.setPriority(Thread.MIN_PRIORITY);
        thread.setDaemon(true);
        return thread;
      }
    }

    this.backgroundExecutor = Executors.newFixedThreadPool(10, new MyThreadFactory());
  }


  @ReactMethod
  public void testPost(ReadableMap args, Promise promise) {
    try {
      JSONObject params = new JSONObject();

      JSONObject WSContext = new JSONObject();
      WSContext.put("UserId", "1365");
      WSContext.put("Password", "123456");

      params.put("IMEISerial", "09133834091");
      params.put("MPOSSerial", "6A751477");
      params.put("WSContext", WSContext);
/*
{
      "FuncName": "LoginUser",
      "CellPhone": "09123209988",
      "Password": "321"
    }
 */


    /*

    class CbPost implements Handler.Callback {
      Promise _promise;
      boolean _err;
      CbPost(boolean err, Promise p) {
        _err = err;
        _promise = p;
      }

      public boolean handleMessage(Message msg) {
        if(_err) _promise.reject(msg.obj.toString(), RasTag);
        else _promise.resolve(msg.obj);
        return false;
      }
    }

    //*/

      RestClient restClient = MainActivity.getRestClient();
      //restClient.request("http://saloomeh.netsima.ir/WS.aspx", params, new CbPost(false, promise), new CbPost(true, promise));
      //*/

      //String tt = restClient.POST("https://ipg.tosantechno.com/mpostest/MPOSInit", params);
      String tt = restClient.POST("https://merchant.tosantechno.com/mpos/MPOSInit", params);
      JSONObject ts = new JSONObject(tt);
      promise.resolve(tt);
    } catch (Exception e) {
      promise.reject(e.getMessage(), RasTag+"2");
      return;
    }
  }


  @ReactMethod
  public void doInit(String baseUrl, ReadableMap args, Promise promise) {
    try {
      DeviceBasic deviceBasic = MainActivity.getDeviceBasic();
      if(!deviceBasic.connectQ20()) {
        promise.reject("Not Connected!!!", RasTag);
        return;
      }

      Log.e("doInit-1", "doInit-1");
      JSONObject WSContext = new JSONObject();
      WSContext.put("UserId", args.getString("UserId"));
      WSContext.put("Password", args.getString("Password"));

      JSONObject data = new JSONObject();
      data.put("IMEISerial",  android.os.Build.SERIAL);//args.getString("TerminalSerial"));
      Log.e("doInit-2", "doInit-2");
      data.put("MPOSSerial", deviceBasic.readSN().substring(0));//args.getString("PinPadSerial"));
      Log.e("doInit-3", "doInit-3");
      data.put("WSContext", WSContext);
      Log.e("doInit-4", "doInit-4");

      RestClient restClient = MainActivity.getRestClient();
      Log.e("doInit-5", "doInit-5");
      //String tt = restClient.POST(baseUrl + "mpostest/MPOSInit", data);
      String tt = restClient.POST(baseUrl + "mpos/MPOSInit", data);
      //restClient


      promise.resolve(tt);
    } catch (Exception e) {
      promise.reject(e.getMessage(), RasTag);
    }
  }

  @ReactMethod
    public void readSerials(Promise promise) {
    class ConnTask extends RasTask {
          public ConnTask(Promise promise) {
            super(promise);
          }

          public void run() {
            if (!super.preRun()) return;
            try {
              String q20ser = deviceBasic.readSN();
              if(q20ser == null) q20ser = "(Null)";

              promise.resolve(android.os.Build.SERIAL + "   " + q20ser);
            } catch (Exception e) {
              promise.reject(e.getMessage(), RasTag);
              e.printStackTrace();
            }
          }
        }

        try {
          runInBackground(new ConnTask(promise));
        } catch (Exception e) {
          promise.reject(e.getMessage(), RasTag);
        }
    }

  @ReactMethod
  public void getSwVersion(Promise promise) {
  class ConnTask extends RasTask {
        public ConnTask(Promise promise) {
          super(promise);
        }

        public void run() {
          if (!super.preRun()) return;
          try {
            String q20ser = deviceBasic.getSwVersion();
            if(q20ser == null) q20ser = "(Null)";
            Log.e(q20ser, q20ser);
            promise.resolve(q20ser);
          } catch (Exception e) {
            promise.reject(e.getMessage(), RasTag);
            e.printStackTrace();
          }
        }
      }

      try {
        runInBackground(new ConnTask(promise));
      } catch (Exception e) {
        promise.reject(e.getMessage(), RasTag);
      }
  }


  @ReactMethod
  public void doVerify(String baseUrl, ReadableMap args, Promise promise) {
    class ConnTask extends RasTask {
      ReadableMap _args;
      String _baseUrl;
      public ConnTask(String baseUrl, ReadableMap args, Promise promise) {
        super(promise);
        _args = args;
        _baseUrl = baseUrl;
      }

      public void run() {
        if (!super.preRun()) return;
        try {

          JSONObject WSContext = new JSONObject();
          WSContext.put("UserId", _args.getString("UserId"));
          WSContext.put("Password", _args.getString("Password"));


          JSONObject data = new JSONObject();
          data.put("ReferenceNum", _args.getString("ReferenceNum"));
          data.put("WSContext", WSContext);


          RestClient restClient = MainActivity.getRestClient();
          String tt = restClient.POST(_baseUrl + "mpos/verifyMPOSTrans", data);
          //String tt = restClient.POST(_baseUrl + "mpostest/verifyMPOSTrans", data);
          //restClient


          promise.resolve(tt);


        } catch (Exception e) {
          promise.reject(e.getMessage(), RasTag);
          e.printStackTrace();
        }
      }
    }

    try {
      runInBackground(new ConnTask(baseUrl, args, promise));
    } catch (Exception e) {
      promise.reject(e.getMessage(), RasTag);
    }
  }

  @ReactMethod
  public void giveResponse(String data, Promise promise) {
    class ConnTask extends RasTask {
      String _data;
      public ConnTask(String data, Promise promise) {
        super(promise);
        _data = data;
      }

      public void run() {
        if (!super.preRun()) return;
        try {

          //Log.e("tt", tt);
          Log.e("SecureResponse", _data);

          String res[] = trnManager.giveResponse(new ResponseTrnParam(_data, (byte) 1, 1));

          if(res != null && res.length >= 1) promise.resolve(res[0]);
          else promise.reject("res == null || res.length == 1", RasTag);

        } catch (Exception e) {
          promise.reject(e.getMessage(), RasTag);
          e.printStackTrace();
        }
      }
    }

    try {
      runInBackground(new ConnTask(data, promise));
    } catch (Exception e) {
      promise.reject(e.getMessage(), RasTag);
    }
  }




  @ReactMethod
  public void doPayment(String baseUrl, ReadableMap args, Promise promise) {
    class ConnTask extends RasTask {
      ReadableMap _args;
      String _baseUrl;
      public ConnTask(String baseUrl, ReadableMap args, Promise promise) {
        super(promise);
        _args = args;
        _baseUrl = baseUrl;
      }

      public void run() {
        if (!super.preRun()) return;
        try {
          String amount = _args.getString("Amount");
          RequestTrnResponse requestTrnResponse = trnManager.getTransaction(
            new RequestTrnParam(
              TrnManager.PROCESSING_CODE_GOODS_AND_SERVICE,
              amount,
              "0",
              "",
              "364",
              (byte) 1,
              15, 15
            )
          );



          JSONObject CardData = new JSONObject();
          CardData.put("SecureData", requestTrnResponse.data);
          CardData.put("PinBlock", requestTrnResponse.pinBlk );
          CardData.put("KSN", requestTrnResponse.ksn);

          JSONObject WSContext = new JSONObject();
          WSContext.put("UserId", _args.getString("UserId"));
          WSContext.put("Password", _args.getString("Password"));


          JSONObject data = new JSONObject();
          data.put("TerminalSerial", android.os.Build.SERIAL);//_args.getString("TerminalSerial"));
          data.put("CardData", CardData);
          data.put("PinPadSerial", deviceBasic.readSN().substring(0));// _args.getString("PinPadSerial"));
          data.put("TransType", "EN_GOODS");
          data.put("TerminalID", _args.getString("TerminalID"));
          data.put("MerchantID", _args.getString("MerchantID"));
          data.put("Lang", "fa");
          data.put("ReserveNum", "12345");
          data.put("IsDukPT", true);
          data.put("Amount", amount);
          data.put("WSContext", WSContext);


          RestClient restClient = MainActivity.getRestClient();


          //String tt = restClient.POST(_baseUrl + "mpostest/doMPOSTrans", data);
          String tt = restClient.POST(_baseUrl + "mpos/doMPOSTrans", data);
          JSONObject resp = new JSONObject(tt);


          promise.resolve(tt);


        } catch (Exception e) {
          promise.reject(e.getMessage(), RasTag);
          e.printStackTrace();
        }
      }
    }

    try {
      runInBackground(new ConnTask(baseUrl, args, promise));
    } catch (Exception e) {
      promise.reject(e.getMessage(), RasTag);
    }
  }


  @ReactMethod
  public void TestConnection(Promise promise) {
    class ConnTask extends RasTask {
      public ConnTask(Promise promise) {
        super(promise);
      }

      public void run() {
        if (!super.preRun()) return;
        try {
          promise.resolve("Connected");

          /*
            RequestTrnResponse requestTrnResponse = new RequestTrnResponse(
              "2000359C200900000000",
              "22222",
              "22222",
              "2000359C200900000000",
              "2000359C2009000000002000359C200900000000",
              "50470000****5632",
              "0",
              "20000");
            //*/

          //TODO: MA-Call
        } catch (Exception e) {
          promise.reject(e.getMessage(), RasTag);
          e.printStackTrace();
        }
      }
    }

    try {
      runInBackground(new ConnTask(promise));
    } catch (Exception e) {
      promise.reject(e.getMessage(), RasTag);
    }
  }


  @ReactMethod
  public void injectTLKKey(String tlkKey, Promise promise) {
    class ConnTask extends RasTask {
      String _tlkKey;

      ConnTask(String tlkKey, Promise promise) {
        super(promise);
        _tlkKey = tlkKey;
      }

      public void run() {
        if (!this.preRun()) return;
        try {
          //56F54537A7CB416556F54537A7CB4165
          trnManager.injectTLKKey(hexToBytes(_tlkKey));
          promise.resolve("Sucessfully 'trnManager.injectTLKKey(key)';");
        } catch (ParsException e) {
          promise.reject(e.getMessage(), RasTag);
          e.printStackTrace();
        }
      }
    }

    try {
      runInBackground(new ConnTask(tlkKey, promise));
    } catch (Exception e) {
      promise.reject(e.getMessage(), RasTag);
    }
  }


  @ReactMethod
  public void injectDpPinMacKey(String dpKey, String pinKey, String macKey, Promise promise) {
    class ConnTask extends RasTask {
      String _dpKey;
      String _pinKey;
      String _macKey;

      ConnTask(String dpKey, String pinKey, String macKey, Promise promise) {
        super(promise);
        _dpKey = dpKey;
        _pinKey = pinKey;
        _macKey = macKey;
      }

      public void run() {
        if (!this.preRun(false)) return;
        try {

          trnManager.injectSessionKey(trnManager.KEY_TYPE_DATA_KEY, _dpKey);
          trnManager.injectSessionKey(trnManager.KEY_TYPE_PIN_KEY, _pinKey);
          trnManager.injectSessionKey(trnManager.KEY_TYPE_MAC_KEY, _macKey);

          promise.resolve("Sucessfully 'trnManager.injectPinKey';");

        } catch (Exception e) {
          promise.reject(e.getMessage(), RasTag);
          e.printStackTrace();
        }
      }
    }

    try {
      runInBackground(new ConnTask(dpKey, pinKey, macKey, promise));
    } catch (Exception e) {
      promise.reject(e.getMessage(), RasTag);
    }
  }


  @ReactMethod
  public void injectThreeKey(String tik, String ksn, String kcv, Promise promise) {
    class ConnTask extends RasTask {
      String _tik, _ksn, _kcv;

      ConnTask(String tik, String ksn, String kcv, Promise promise) {
        super(promise);
        _tik = tik;
        _ksn = ksn;
        _kcv = kcv;
      }

      public void run() {
        if (!this.preRun(false)) return;
        try {
          trnManager.injectSessionKey(TrnManager.KEY_TYPE_TIK_KSN_KCV_KEY, _tik, _ksn, _kcv);

          promise.resolve("Sucessfully 'trnManager.injectThreeKey';");

        } catch (Exception e) {
          promise.reject(e.getMessage(), RasTag);
          e.printStackTrace();
        }
      }
    }

    try {
      runInBackground(new ConnTask(tik, ksn, kcv, promise));
    } catch (Exception e) {
      promise.reject(e.getMessage(), RasTag);
    }

  }

  @Override
  public String getName() {
    return "Q20RasTransactionModule";
  }


  public void runInBackground(final RasTask task) {
    this.backgroundExecutor.submit(task);
  }

  @ReactMethod
  public void connect(Promise promise) {
    try {
      DeviceBasic db = MainActivity.getDeviceBasic();
      TrnManager trn = MainActivity.getTrnManager();

      promise.resolve(trn == null ? "null" : trn.toString());

        /*if(!db.connectQ20()) {
          promise.reject("Cannot connect to Q20");
        } else promise.resolve(db.readSN().substring(0));
        //*/
      //throw new Exception("SSS");
    } catch (Exception e) {
      promise.reject(e.getMessage(), "Ras-ERROR");
    }
  }


}
