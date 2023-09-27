package com.indigoapp.rasXPrinter;

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
import java.nio.charset.StandardCharsets;
import android.util.Base64;
import java.util.concurrent.*;
//import com.tosantechno.pax.easylink.DeviceBasic;
//import com.tosantechno.pax.easylink.TrnManager;

/*
import net.posprinter.posprinterface.IMyBinder;
import net.posprinter.posprinterface.UiExecute;
import net.posprinter.service.PosprinterService;
import net.posprinter.utils.DataForSendToPrinterPos80;
import net.posprinter.utils.PosPrinterDev;
import com.indigoapp.MainActivity;
//*/

//import net.posprinter.utils.BitmapToByteData.BmpType;
import net.posprinter.utils.BitmapToByteData;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import net.posprinter.utils.DataForSendToPrinterPos80;
import java.util.ArrayList;
import java.util.List;


public class XPrinterRasTransactionModule extends ReactContextBaseJavaModule {

  private ReactApplicationContext reactContext;

  private SocketManager _soketManager;

  public XPrinterRasTransactionModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;

    _soketManager = new SocketManager();
  }

  @Override
  public String getName() {
    return "XPrinterRas";
  }


  /*
  @ReactMethod
  public void print(String ip, String string, Promise promise) {
    //byte[] decodedString = Base64.decode(base64string, Base64.DEFAULT); // String -> Byte array
    //byte[] decodedString = {(byte)0xd9, (byte)0x85, (byte)0xd8, (byte)0xb1, (byte)0xdb, (byte)0x8c, (byte)0xd9, (byte)0x85, (byte)0xa};

    //_soketManager.threadConnectWrite(ip, 9100, (string+"\n").getBytes(StandardCharsets.UTF_8), promise);
    //_soketManager.threadConnectWrite(ip, 9100, decodedString, promise);
  }
  //*/

  /*
  @ReactMethod
  public void initPrinter(String ip, Promise promise) {
    byte[] init = DataForSendToPrinterPos80.initializePrinter();
    _soketManager.threadConnectWrite(ip, 9100, init, promise);
  }
  //*/

  /*
  @ReactMethod
  public void cut(String ip, Promise promise) {
    byte[] cut = DataForSendToPrinterPos80.selectCutPagerModerAndCutPager(66,1);
    _soketManager.threadConnectWrite(ip, 9100, cut, promise);
  }
  //*/


    @ReactMethod
  public void printImage(String ip, String base64string, Promise promise) {
    try {

      if(ip == null || ip.trim() == "") {
        promise.resolve("Empty ip, not printed");
        return;
      }

      byte[] decodedString = Base64.decode(base64string, Base64.DEFAULT); // String -> Byte array
      Bitmap bm = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length); // Byte array -> Bitmap

      byte[] data = DataForSendToPrinterPos80.printRasterBmp(
        0,
        bm,
        BitmapToByteData.BmpType.Threshold,
        BitmapToByteData.AlignType.Left,
        576
      );
      byte[] cut = DataForSendToPrinterPos80.selectCutPagerModerAndCutPager(66,1);
      byte[] init = DataForSendToPrinterPos80.initializePrinter();

      List<byte[]> all = new ArrayList<byte[]>();
      all.add(init);
      all.add(data);
      all.add(cut);

      _soketManager.threadConnectWrite(ip, 9100, all, promise);

    } catch (Exception e) {
      //errorCallback.invoke(e.getMessage());
      //errorCallback.invoke("asdasdsad");
      promise.reject(e.getMessage(), "RAS");
      e.printStackTrace();
    }
  }

  /*
  @ReactMethod
  public void cutOld(String ip, Promise promise) {
    byte cutData[]={0x0a,0x0a,0x1d,0x56,0x01};
    _soketManager.threadConnectWrite(ip, 9100, cutData, promise);
  }

  //*/

  /*
  public static boolean ISCONNECT = false;

  @ReactMethod
  public void Connect(String ipAddress, Promise promise) {
    class InnerUiExecute implements UiExecute {
      Promise promise;
      String ipAddress;
      public InnerUiExecute(Promise promise, String ipAddress) {
        this.promise = promise;
        this.ipAddress = ipAddress;
      }

      @Override
      public void onsucess() {
        class InnerUiExecute2 implements UiExecute {
          Promise promise;
          String ipAddress;

          public InnerUiExecute2(Promise promise, String ipAddress) {
            this.promise = promise;
            this.ipAddress = ipAddress;
          }

          @Override
          public void onsucess() {
            promise.resolve("OK");
          }

          @Override
          public void onfailed() {
            ISCONNECT = false;
            promise.reject("Cannot connect to " + ipAddress, "RAS");
          }

        }

        ISCONNECT = true;
        MainActivity.binder.acceptdatafromprinter(new InnerUiExecute2(promise, ipAddress) );
      }

      @Override
      public void onfailed() {
        //Execution of the connection in the UI thread after the failure of the connection
        ISCONNECT = false;
        promise.reject("Cannot connect to " + ipAddress, "RAS");
      }

    }


    if (ipAddress.equals(null)||ipAddress.equals("")){
      promise.reject("Null or empty IpAddress", "RAS");
    } else {
      //ipAddress :ip address; portal:9100
      if(MainActivity.binder == null) {
        promise.reject("MainActivity.binder == null", "RAS");
        return;
      } else {
        MainActivity.binder.connectNetPort(ipAddress, 9100, new InnerUiExecute(promise, ipAddress) );
      }

    }

  }
  //*/
}
