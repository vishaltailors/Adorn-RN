package com.adorn;

import android.app.WallpaperManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.RectF;
import android.os.Build;
import android.os.Handler;
import android.util.DisplayMetrics;
import android.view.Display;
import android.view.WindowManager;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.IOException;
import java.net.URL;

public class SetWallpaperModule extends ReactContextBaseJavaModule {
    private static  ReactApplicationContext reactContext;

    SetWallpaperModule(ReactApplicationContext context) {
        super(context);
        reactContext= context;
    }

    @NonNull
    @Override
    public String getName(){
        return "SetWallpaperAndroid";
    }

    @RequiresApi(api = Build.VERSION_CODES.N)
    @ReactMethod
    public void setWallpaper(String url, Integer flag, Callback isWallpaperSet) {
        Handler handler = new Handler();
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                try {
                    WallpaperManager wallpaperManager = WallpaperManager.getInstance(reactContext);
                    DisplayMetrics displayMetrics = new DisplayMetrics();
                    WindowManager windowManager = (WindowManager) reactContext.getSystemService(reactContext.WINDOW_SERVICE);
                    Display display = windowManager.getDefaultDisplay();
                    display.getMetrics(displayMetrics);
                    wallpaperManager.suggestDesiredDimensions(displayMetrics.widthPixels, displayMetrics.heightPixels);

                    final int width = wallpaperManager.getDesiredMinimumWidth();
                    final int height = wallpaperManager.getDesiredMinimumHeight();

                    URL urlObj = new URL(url);
                    Bitmap resource = BitmapFactory.decodeStream(urlObj.openConnection().getInputStream());

                    Bitmap wallpaper = scaleCenterCrop(resource,height,width);

                    switch (flag) {
                        case 1:
                            wallpaperManager.setBitmap(wallpaper,null, false, flag);
                            handler.post(new Runnable() {
                                @Override
                                public void run() {
                                    Toast.makeText(reactContext,"Wallpaper has been set on home screen",Toast.LENGTH_SHORT).show();
                                }
                            });
                            break;
                        case 2:
                            wallpaperManager.setBitmap(wallpaper, null, false, flag);
                            handler.post(new Runnable() {
                                @Override
                                public void run() {
                                    Toast.makeText(reactContext,"Wallpaper has been set on lock screen",Toast.LENGTH_SHORT).show();
                                }
                            });
                            break;
                        default:
                            wallpaperManager.setBitmap(wallpaper);
                            handler.post(new Runnable() {
                                @Override
                                public void run() {
                                    Toast.makeText(reactContext,"Wallpaper has been set on both screen",Toast.LENGTH_SHORT).show();
                                }
                            });
                            break;
                    }
                    isWallpaperSet.invoke(true);
                }
                catch (IOException e){
                    Toast.makeText(reactContext,"Oops! There is some error",Toast.LENGTH_SHORT).show();
                    isWallpaperSet.invoke(false);
                }
            }
        };
        Thread thread = new Thread(runnable);
        thread.start();
    }

    public static Bitmap scaleCenterCrop(Bitmap source, int newHeight, int newWidth) {
        int sourceWidth = source.getWidth();
        int sourceHeight = source.getHeight();

        float xScale = (float) newWidth / sourceWidth;
        float yScale = (float) newHeight / sourceHeight;
        float scale = Math.max(xScale, yScale);

        float scaledWidth = scale * sourceWidth;
        float scaledHeight = scale * sourceHeight;

        float left = (newWidth - scaledWidth) / 2;
        float top = (newHeight - scaledHeight) / 2;

        RectF targetRect = new RectF(left, top, left + scaledWidth, top + scaledHeight);

        Bitmap dest = Bitmap.createBitmap(newWidth, newHeight, source.getConfig());
        Canvas canvas = new Canvas(dest);
        canvas.drawBitmap(source, null, targetRect, null);

        return dest;
    }
}