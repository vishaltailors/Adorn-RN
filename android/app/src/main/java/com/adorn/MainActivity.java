package com.adorn;

import com.facebook.react.ReactActivity;
import com.google.android.play.core.appupdate.AppUpdateInfo;
import com.google.android.play.core.appupdate.AppUpdateManager;
import com.google.android.play.core.appupdate.AppUpdateManagerFactory;
import com.google.android.play.core.install.InstallState;
import com.google.android.play.core.install.InstallStateUpdatedListener;
import com.google.android.play.core.install.model.AppUpdateType;
import com.google.android.play.core.install.model.InstallStatus;
import com.google.android.play.core.install.model.UpdateAvailability;
import com.google.android.play.core.tasks.OnSuccessListener;

import android.content.Intent;
import android.content.IntentSender;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

public class MainActivity extends ReactActivity {
  private AppUpdateManager mAppUpdateManager;
  private static final int RC_APP_UPDATE = 22;

  InstallStateUpdatedListener installStateUpdatedListener = new InstallStateUpdatedListener() {
    @Override
    public void onStateUpdate(InstallState state) {
      if (state.installStatus() == InstallStatus.DOWNLOADED){
        Toast.makeText(getApplicationContext(), "Update has been downloaded successfully", Toast.LENGTH_SHORT).show();
      } else if (state.installStatus() == InstallStatus.INSTALLED){
        if (mAppUpdateManager != null){
          mAppUpdateManager.unregisterListener(installStateUpdatedListener);
        }

      } else {
        Log.i("InAppUpdate", "InstallStateUpdatedListener: state: " + state.installStatus());
      }
    }
  };

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "adorn";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
  }

  @Override
  protected void onStart() {
    super.onStart();

    mAppUpdateManager = AppUpdateManagerFactory.create(this);
    mAppUpdateManager.registerListener(installStateUpdatedListener);
    mAppUpdateManager.getAppUpdateInfo().addOnSuccessListener(new OnSuccessListener<AppUpdateInfo>() {
      @Override
      public void onSuccess(AppUpdateInfo appUpdateInfo) {

        if (appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE
                && appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.FLEXIBLE)) {
          try {
            mAppUpdateManager.startUpdateFlowForResult(
                    appUpdateInfo, AppUpdateType.FLEXIBLE, MainActivity.this, RC_APP_UPDATE);

          } catch (IntentSender.SendIntentException e) {
            e.printStackTrace();
          }

        } else if (appUpdateInfo.installStatus() == InstallStatus.DOWNLOADED) {
          //CHECK THIS if AppUpdateType.FLEXIBLE, otherwise you can skip
          Toast.makeText(getApplicationContext(), "Update has been downloaded successfully", Toast.LENGTH_SHORT).show();
        } else {
          Log.e("InAppUpdate", "checkForAppUpdateAvailability: something else");
        }
      }
    });
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    if (requestCode == RC_APP_UPDATE) {
      if (resultCode != RESULT_OK) {
        Log.e("InAppUpdate", "onActivityResult: app download failed");
      }
    }
  }

  @Override
  protected void onStop() {
    super.onStop();
    if (mAppUpdateManager != null) {
      mAppUpdateManager.unregisterListener(installStateUpdatedListener);
    }
  }
}
