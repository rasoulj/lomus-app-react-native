package com.indigoapp.barcodescanner;

import android.content.Context;
import android.hardware.Camera;
import android.util.Log;
import android.view.Surface;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.WindowManager;
import android.view.Display;
import android.os.Handler;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.zxing.BinaryBitmap;
import com.google.zxing.MultiFormatReader;
import com.google.zxing.PlanarYUVLuminanceSource;
import com.google.zxing.ReaderException;
import com.google.zxing.Result;
import com.google.zxing.common.HybridBinarizer;

public class CameraPreview extends SurfaceView implements SurfaceHolder.Callback {
    private CameraManager mCameraManager;
    private Camera mCamera;
    private String mCameraType;
    private Camera.PreviewCallback mPreviewCallback;

    private boolean mSurfaceCreated;
    private boolean mPreviewing = true;

    private static final String TAG = "CameraPreview";

    public CameraPreview(Context context, Camera.PreviewCallback previewCallback) {
        super(context);

        mCameraManager = new CameraManager();
        mPreviewCallback = previewCallback;
    }

    public void startCamera() {
        mCamera = mCameraManager.getCamera(mCameraType);
        startCameraPreview();
    }

    public void stopCamera() {
        stopCameraPreview();
        mCameraManager.releaseCamera();
    }

    public void setCameraType(String cameraType) {
        mCameraType = cameraType;
        stopCamera();
        startCamera();
    }

    public void startCameraPreview() {
        if(mCamera != null) {
            try {
                mPreviewing = true;
                getHolder().addCallback(this);
                mCamera.setPreviewDisplay(getHolder());
                mCamera.setDisplayOrientation(getDisplayOrientation());
                mCamera.setPreviewCallback(mPreviewCallback);
                setAutoFocus(mCamera); // Set auto focus mode..?
                mCamera.startPreview();
            } catch (Exception e) {
                Log.e(TAG, e.toString(), e);
            }
        }
    }

    public void stopCameraPreview() {
        if(mCamera != null) {
            try {
                mPreviewing = false;
                getHolder().removeCallback(this);
                mCamera.cancelAutoFocus();
                mCamera.setPreviewCallback(null);
                mCamera.stopPreview();
            } catch(Exception e) {
                Log.e(TAG, e.toString(), e);
            }
        }
    }

    public void setAutoFocus(Camera cam) {
        Camera.Parameters parameters = cam.getParameters();
        parameters.setFocusMode(Camera.Parameters.FOCUS_MODE_CONTINUOUS_PICTURE);
        cam.setParameters(parameters);
    }

    public int getDisplayOrientation() {
        Camera.CameraInfo info = new Camera.CameraInfo();
        Camera.getCameraInfo(Camera.CameraInfo.CAMERA_FACING_BACK, info);
        WindowManager wm = (WindowManager) getContext().getSystemService(Context.WINDOW_SERVICE);
        Display display = wm.getDefaultDisplay();

        int rotation = display.getRotation();
        int degrees = 0;
        switch (rotation) {
            case Surface.ROTATION_0: degrees = 0; break;
            case Surface.ROTATION_90: degrees = 90; break;
            case Surface.ROTATION_180: degrees = 180; break;
            case Surface.ROTATION_270: degrees = 270; break;
        }

        int result;
        if (info.facing == Camera.CameraInfo.CAMERA_FACING_FRONT) {
            result = (info.orientation + degrees) % 360;
            result = (360 - result) % 360;  // compensate the mirror
        } else {  // back-facing
            result = (info.orientation - degrees + 360) % 360;
        }
        return result;
    }

    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        mSurfaceCreated = true;
        startCamera();
    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        stopCamera();
    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int w, int h) {
        if(holder.getSurface() == null) {
            return;
        }
        if(mCamera != null) {
            try {
                mCamera.setDisplayOrientation(getDisplayOrientation());
            } catch (Exception e) {
                Log.e(TAG, e.toString(), e);
            }
        }
    }

    public void onPause() {
        stopCameraPreview();
    }

    public void onResume() {
        startCameraPreview();
    }

    public void setFlash(boolean flag) {
        if(mCamera != null && mCameraManager.isFlashSupported(mCamera)) {
            Camera.Parameters parameters = mCamera.getParameters();
            if(flag) {
                if(parameters.getFlashMode().equals(Camera.Parameters.FLASH_MODE_TORCH)) {
                    return;
                }
                parameters.setFlashMode(Camera.Parameters.FLASH_MODE_TORCH);
            } else {
                if(parameters.getFlashMode().equals(Camera.Parameters.FLASH_MODE_OFF)) {
                    return;
                }
                parameters.setFlashMode(Camera.Parameters.FLASH_MODE_OFF);
            }
            mCamera.setParameters(parameters);
        }
    }
}
