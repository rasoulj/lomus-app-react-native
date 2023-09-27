package com.indigoapp;

import com.facebook.react.ReactActivity;
//TODO (Ras): import com.facebook.react.modules.i18nmanager;


import android.app.Activity;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;
import android.view.View;
import android.os.Bundle;

import com.pax.api.PrintManager;
import com.pax.api.PrintException;
import com.tosantechno.pos.pax.e500.TrnManager;

import android.util.Log;
import android.graphics.Color;

import java.util.HashMap;
import java.util.Iterator;

import com.tosantechno.pax.easylink.DeviceBasic;


//import com.posprinter.printdemo.R;
//import com.posprinter.printdemo.utils.Conts;
//import com.posprinter.printdemo.utils.DeviceReceiver;

/*
import net.posprinter.posprinterface.IMyBinder;
import net.posprinter.posprinterface.UiExecute;
import net.posprinter.service.PosprinterService;
import net.posprinter.utils.DataForSendToPrinterPos80;
import net.posprinter.utils.PosPrinterDev;
import android.content.ServiceConnection;
import android.content.ComponentName;
import android.os.IBinder;
//*/

public class MainActivity extends ReactActivity {

  /*
  public static IMyBinder binder;
  ServiceConnection conn = new ServiceConnection() {
    @Override
    public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
      //Bind successfully
      binder = (IMyBinder) iBinder;
      Log.e("binder","connected");
    }

    @Override
    public void onServiceDisconnected(ComponentName componentName) {
      Log.e("disbinder","disconnected");
    }
  };
  //*/


  private static DeviceBasic _deviceBasic;
	public static DeviceBasic getDeviceBasic() { return _deviceBasic; }
	private static com.tosantechno.pax.easylink.TrnManager _trnManager;
  public static com.tosantechno.pax.easylink.TrnManager getTrnManager() { return _trnManager; }
  public static com.indigoapp.q20ras.RestClient _restClient;
  public static com.indigoapp.q20ras.RestClient getRestClient() { return _restClient; }


	private static final String TAG = "Indigo";

	private static PrintManager printManager;
	private static TrnManager transactionManager;

	private static final String ACTION_USB_PERMISSION =
			"com.indigoapp.USB_PERMISSION";

	private UsbManager mUsbManager;
	private PendingIntent mPermissionIntent;

	private final BroadcastReceiver mUsbReceiver = new BroadcastReceiver() {

		public void onReceive(Context context, Intent intent) {

			String action = intent.getAction();
			Log.i(TAG, String.format("Receive USB intent: ", action));

			if (ACTION_USB_PERMISSION.equals(action)) {
				synchronized (this) {
					UsbDevice device = (UsbDevice)intent.getParcelableExtra(UsbManager.EXTRA_DEVICE);

					if (intent.getBooleanExtra(UsbManager.EXTRA_PERMISSION_GRANTED, false)) {
						if(device != null){
							//call method to set up device communication
							String model = device.getDeviceName();
							int deviceId = device.getDeviceId();
							int vendorId = device.getVendorId();
							int productId = device.getProductId();
							int classId = device.getDeviceClass();
							int subclassId = device.getDeviceSubclass();

							Log.d(TAG, String.format("USB Device found: %s deviceId: %04X, product %04X:%04X, class: %04X:%04X",
									model, deviceId, vendorId, productId, classId, subclassId));
						}
					}
					else {
						Log.d(TAG, "USB permission denied for device " + device);
					}
				}
			}
		}
	};


    @Override
	protected void onCreate(Bundle savedInstanceState) {
	    super.onCreate(savedInstanceState);

	   	// ************---  COMMENT OUT THIS SECTION FOR EMULATOR TESTING  ---************ //

      try {
        /*
        Intent intent=new Intent(this,PosprinterService.class);
        bindService(intent, conn, BIND_AUTO_CREATE);
        Log.e(TAG, "Salaam");
        //*/

        _deviceBasic = DeviceBasic.getInstance(this); //.getApplicationContext()
        _trnManager = com.tosantechno.pax.easylink.TrnManager.getInstance(this); //.getApplicationContext()
        _restClient = new com.indigoapp.q20ras.RestClient(this);

      } catch(Exception e) {
        Log.e(TAG, "DeviceBasic Error: " + e.getMessage());
      }

	   	try {
	    	//This only works on the real machine
    		printManager = PrintManager.getInstance(this.getApplicationContext());

    		//TODO (Ras): I18nUtil sharedI18nUtilInstance = I18nUtil.getInstance();
        //TODO (Ras): sharedI18nUtilInstance.allowRTL(context, true);
	   	} catch (PrintException e) {
	   		Log.e(TAG, "Print Manager Error: " + e.getMessage());
	   	} catch (java.lang.UnsatisfiedLinkError e) {
	   		Log.e(TAG, "Starting on an Emulator: Printing will not function " + e.getMessage());
		}

		try {
			//This only works on the real machine
			transactionManager = TrnManager.getInstance(this.getApplicationContext());
		} catch (java.lang.UnsatisfiedLinkError e) {
			Log.e(TAG, "Starting on an Emulator: Printing will not function " + e.getMessage());
		} catch (Exception e) {
			Log.e(TAG, "Transaction Manager Error: " + e.getMessage());
		}

		try{
			registerIntent();
		} catch (Exception e) {
			Log.e(TAG, "Unable to register USB device " + e.getMessage());
		}

		// ************-------------------------------------------------------************ //



	    // Set Status Bar Color
	    int statusBarColor = Color.parseColor("#1E0034");
	    getWindow().setStatusBarColor(statusBarColor);

	    // Set System Ui
	    getWindow().getDecorView().setSystemUiVisibility(
	    	View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY |
	    	View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
	    );

	}

	public static PrintManager getPrintManager() {
        return printManager;
    }

    public static TrnManager getTransactionManager() {
		return transactionManager;
	}

	@Override
  	protected void onResume() {
	    super.onResume();

	    // Set System Ui
	    getWindow().getDecorView().setSystemUiVisibility(
	        View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY |
	        View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
	    );

	}

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "IndigoApp";
    }

    private void registerIntent() {
		Log.i(TAG, "Registering USB device intent.");
		mUsbManager = (UsbManager) getSystemService(Context.USB_SERVICE);
		mPermissionIntent = PendingIntent.getBroadcast(this, 0, new Intent(ACTION_USB_PERMISSION), 0);
		IntentFilter filter = new IntentFilter(ACTION_USB_PERMISSION);
		registerReceiver(mUsbReceiver, filter);
	}
}
