package com.indigoapp.rasXPrinter;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.Socket;
import android.content.Context;
import com.facebook.react.bridge.Promise;
import java.util.List;

public class SocketManager {
  private static final String RasTag = "Ras-ERROR:";

  public static final  boolean MESSAGE_CONNECTED=true;
	public static final  boolean MESSAGE_CONNECTED_ERROR=false;
	public static final  boolean MESSAGE_WRITE_SUCCESS=true;
	public static final  boolean MESSAGE_WRITE_ERROR=false;
	private  Socket mMyWifiSocket=null;
	private BufferedReader BufReader= null;
	private OutputStream PriOut = null;
	private boolean iState=false;

	//public  String mstrIp="192.168.43.100";
	//public  int mPort=9100;

	int TimeOut=1300;
	public boolean getIstate () {
	  return iState;
	}

	public void threadConnect(String mstrIp, int mPort) {
	  new ConnectThread(mstrIp, mPort);
	}

	public void threadConnectWrite(String mstrIp, int mPort, List<byte[]> str, Promise promise) {
		new WriteThread(mstrIp, mPort, str, promise);
	}

	public boolean connect(String mstrIp, int mPort) {
		close();
		try
		{
			mMyWifiSocket = new Socket();
			mMyWifiSocket.connect(new InetSocketAddress(mstrIp, mPort), TimeOut);
			PriOut= mMyWifiSocket.getOutputStream();
			return true;
		} catch (IOException e)
		{
			e.printStackTrace();
			SetState(MESSAGE_CONNECTED_ERROR);
			return false;
		}
	}


	public boolean write(List<byte[]> out) {
		if(PriOut!=null)
		{
			try
			{
			  for(byte[] data : out) {
          PriOut.write(data);
          PriOut.flush();
          Thread.sleep(300);
        }
				return true;
			} catch (Exception e)
			{
				e.printStackTrace();
				return false;
			}
		}
		else
		{
				return false;
		}
	}

	public void close() {
		if(mMyWifiSocket!=null)
		{
			try
			{
				mMyWifiSocket.close();
				mMyWifiSocket=null;
			}
			catch (IOException e1)
			{
				e1.printStackTrace();
			}
		}
		if(BufReader!=null)
		{
			try
			{
				BufReader.close();
				BufReader=null;
			} catch (IOException e2) {
				e2.printStackTrace();
			}
		}
		if(PriOut!=null)
		{
			try
			{
				PriOut.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
			PriOut=null;
		}
	}

	public boolean ConnectAndWrite(String mstrIp, int mPort, List<byte[]> out) {
		if(connect(mstrIp, mPort))
		{
			write(out);
			close();
			SetState(MESSAGE_WRITE_SUCCESS);
			return true;
		}
		else
		{
			SetState(MESSAGE_CONNECTED_ERROR);
			return false;
		}
	}

	public SocketManager() {}

	public void SetState(Boolean state)
	{
        iState=state;
	}

	private class ConnectThread extends Thread {
    String _mstrIp;
    int _mPort;
		public ConnectThread(String mstrIp, int mPort)
		{
      _mstrIp = mstrIp;
      _mPort = mPort;
		  start();
		}
		public void run()
		{
			if(connect(_mstrIp, _mPort))
			{
				SetState(MESSAGE_CONNECTED);
			}
			close();
		}
	}

	private class WriteThread extends Thread {
		List<byte[]> out;
    String _mstrIp;
    int _mPort;

    Promise _promise;

		public WriteThread(String mstrIp, int mPort, List<byte[]> str, Promise promise)
		{
      _mstrIp = mstrIp;
      _mPort = mPort;
      _promise = promise;

			out=str;
			start();
		}
		public void run()
		{
			if(ConnectAndWrite(_mstrIp, _mPort, out))
			{
				SetState(MESSAGE_WRITE_SUCCESS);
				_promise.resolve("OK");
			} else _promise.reject("deviceBasic == null", RasTag);
		}
	}
}
