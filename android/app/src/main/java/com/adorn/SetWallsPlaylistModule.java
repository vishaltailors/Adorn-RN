package com.adorn;

import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;

import java.io.Serializable;


public class SetWallsPlaylistModule extends ReactContextBaseJavaModule {
    @NonNull
    @Override
    public String getName() {
        return "SetWallsPlaylistAndroid";
    }

    private static  ReactApplicationContext reactContext;

    SetWallsPlaylistModule(ReactApplicationContext context) {
        super(context);
        reactContext= context;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @ReactMethod
    public void setWallsPlaylist(ReadableArray images, int duration){
        Intent serviceIntent = new Intent(reactContext, WallpaperService.class);
        serviceIntent.setAction("START_SERVICE");
        serviceIntent.putExtra("images", images.toArrayList());
        serviceIntent.putExtra("duration", duration);
        reactContext.startForegroundService(serviceIntent);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @ReactMethod
    public void stopWallsPlaylistService(){
        Intent serviceIntent = new Intent(reactContext, WallpaperService.class);
        serviceIntent.setAction("STOP_SERVICE");
        reactContext.startForegroundService(serviceIntent);
    }

    public boolean isWallpaperServiceRunning(){
        ActivityManager activityManager = (ActivityManager) reactContext.getSystemService(Context.ACTIVITY_SERVICE);
        for(ActivityManager.RunningServiceInfo serviceInfo: activityManager.getRunningServices(Integer.MAX_VALUE)){
            if(WallpaperService.class.getName().equals(serviceInfo.service.getClassName())){
                return true;
            }
        }
        return false;
    }

    @ReactMethod
    public void isWallpaperServiceRunning(Callback isRunning){
        isRunning.invoke(isWallpaperServiceRunning());
    }
}
