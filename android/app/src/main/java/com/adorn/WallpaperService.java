package com.adorn;

import static com.adorn.Utilities.scaleCenterCrop;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.app.WallpaperManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.os.IBinder;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Display;
import android.view.WindowManager;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;


import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class WallpaperService extends Service {

    Context context = this;

    public static final int START_ID = 1551;

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        SharedPreferences sharedPreferences = getApplicationContext().getSharedPreferences("@wallsPlaylistService", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putInt("wallpaperIndex", 0);
        editor.apply();
        if(intent.getAction().equals("START_SERVICE")){
            ArrayList<String> images = intent.getStringArrayListExtra("images");
            int duration = intent.getIntExtra("duration", 3);

            WallpaperManager wallpaperManager = WallpaperManager.getInstance(context);
            DisplayMetrics displayMetrics = new DisplayMetrics();
            WindowManager windowManager = (WindowManager) context.getSystemService(WINDOW_SERVICE);
            Display display = windowManager.getDefaultDisplay();
            display.getMetrics(displayMetrics);
            wallpaperManager.suggestDesiredDimensions(displayMetrics.widthPixels, displayMetrics.heightPixels);

            final int width = wallpaperManager.getDesiredMinimumWidth();
            final int height = wallpaperManager.getDesiredMinimumHeight();

            ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
            scheduler.scheduleAtFixedRate(() -> {
                try{
                    int index = sharedPreferences.getInt("wallpaperIndex",0);
                    assert images != null;
                    if(index == images.size()){
                        index = 0;
                    }
                    URL urlObj = new URL(images.get(index));
                    Bitmap resource = BitmapFactory.decodeStream(urlObj.openConnection().getInputStream());

                    Bitmap wallpaper = scaleCenterCrop(resource,height,width);
                    wallpaperManager.setBitmap(wallpaper);
                    index += 1;
                    editor.putInt("wallpaperIndex", index);
                    editor.apply();
                }catch(IOException e){
                    Log.i("SERVICE-ERROR", e.toString());
                }
            },0,duration,TimeUnit.HOURS);

            final String CHANNEL_ID = "WallpaperPlaylistServiceId";
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "Wallpaper playlist service", NotificationManager.IMPORTANCE_LOW);
            getSystemService(NotificationManager.class).createNotificationChannel(channel);
            Notification.Builder notification = new Notification.Builder(this, CHANNEL_ID).setContentText("you can hide this notification by long pressing on it").setContentTitle("Wall's playlist service is running");
            startForeground(START_ID, notification.build());
        }else if(intent.getAction().equals("STOP_SERVICE")){
            stopForeground(true);
        }
        return super.onStartCommand(intent, flags, startId);
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
