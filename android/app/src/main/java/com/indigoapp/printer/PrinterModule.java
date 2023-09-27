package com.indigoapp.printer;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import com.indigoapp.R;

import com.pax.api.PrintManager;
import com.pax.api.PrintException;

import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;
import java.net.URL;
import java.io.IOException;
import java.io.InputStream;
import java.io.FileInputStream;
import java.io.BufferedInputStream;
import java.net.URLConnection;
import java.io.ByteArrayOutputStream;
import android.util.Base64;
import android.net.Uri;

import java.lang.IndexOutOfBoundsException;

import com.indigoapp.MainActivity;

import android.widget.Toast;

public class PrinterModule extends ReactContextBaseJavaModule {
  private ReactApplicationContext reactContext;

  private PrintManager iPrint;

  public PrinterModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "PrinterAndroid";
  }

  private void printBitmap(Bitmap bm) {
    // Get the print manager from main activity
    iPrint = MainActivity.getPrintManager();
    // --> Printing function <-- //
    try {
      // Printer init
      iPrint.prnInit();
      // Print bitmap function
      iPrint.prnBitmap(bm);
      // Start printing
      iPrint.prnStart();
      // Cut paper after printing is finished
      int ret = iPrint.prnGetCutMode();
      if (ret >= 0) {
        if (ret == 0) {
        iPrint.prnCutPaper(1);
        } else if (ret == 1) {
          iPrint.prnCutPaper(0);
        } else if (ret == 2) {
          iPrint.prnCutPaper(0);
        }
      }
    } catch (PrintException e) {
      e.printStackTrace();
    }
  }

  @ReactMethod
  public void getEncodedString(String uri, Callback callback) {
    Bitmap bm = null;
    String encoded = null;
    try {
      encoded = "";
      // InputStream in = new java.net.URL(uri).openStream();
      // ByteArrayOutputStream baos = new ByteArrayOutputStream();  
      // bm = BitmapFactory.decodeStream(in);
      // bm.compress(Bitmap.CompressFormat.PNG, 100, baos); //bm is the bitmap object   
      // byte[] byteArrayImage = baos.toByteArray(); 
      // encoded = Base64.encodeToString(byteArrayImage, Base64.DEFAULT);
    } catch (Exception e) {
      e.printStackTrace();
    }
    callback.invoke(encoded);
  }

  @ReactMethod
  public void raiseTestNativeError() {
    throw new IndexOutOfBoundsException("This is demo error from android");
  }

  @ReactMethod
  public void print(String base64string, Callback errorCallback) {
    try {
      byte[] decodedString = Base64.decode(base64string, Base64.DEFAULT); // String -> Byte array
      Bitmap bm = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length); // Byte array -> Bitmap      
      this.printBitmap(bm);
    } catch (Exception e) {
      errorCallback.invoke(e.getMessage());
      errorCallback.invoke("asdasdsad");
      e.printStackTrace();
    }
  }

  // Experimental --> Prints QM logo
  @ReactMethod
  public void printNew() {

    // Get the printer manager from main activity
    iPrint  = MainActivity.getPrintManager();
    // Get the QM bitmap from resources
    Resources resources = reactContext.getResources();
    // Make the bitmap from resource
    Bitmap bmp = BitmapFactory.decodeResource(resources, R.drawable.logo);
    // Try to print the bitmap
    try {

        // Printer init
        iPrint.prnInit();

        // Printer print bitmap func
        iPrint.prnBitmap(bmp);

        // Start printing
        iPrint.prnStart();

        // Printer paper cut after print is finished
        int ret = iPrint.prnGetCutMode();
        if (ret >= 0) {
          if (ret == 0) {
          iPrint.prnCutPaper(1);
          } else if (ret == 1) {
            iPrint.prnCutPaper(0);
          } else if (ret == 2) {
            iPrint.prnCutPaper(0);
          }
        }

      } catch (PrintException e) {
        // Catch any error here..!
      }
    
  }

}
