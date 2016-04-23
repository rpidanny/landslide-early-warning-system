package challenge.app.warningreceiver;

/**
 * Created by abhishek on 4/23/16.
 */

import android.app.ActivityManager;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.google.android.gms.gcm.GcmListenerService;

import java.util.List;

public class GCMListenerService extends GcmListenerService {

    private static final String TAG = "GCMListenerService";
    @Override
    public void onMessageReceived(String from,Bundle bundle){

        Log.w(TAG, "From: " + bundle.getString("from"));
        Log.w(TAG, "Title: " + bundle.getString("title"));
        Log.w(TAG, "Message: " + bundle.getString("message"));
        Log.w(TAG, "Text: " + bundle.getString("text"));

        //sending intent if application is open rather than sending notification
        if(isApplicationRunning()){
            Intent intent = new Intent("PushNotificationReceived");
            bundle.putBoolean("foreground",true);
            intent.putExtra("notification",bundle);
            sendBroadcast(intent);
            return;
        }

        //else send notification
        new NotificationHelper(this).sendNotification(bundle);
    }


    //check if application is open
    private boolean isApplicationRunning() {
        ActivityManager activityManager = (ActivityManager) this.getSystemService(ACTIVITY_SERVICE);
        List<ActivityManager.RunningAppProcessInfo> processInfos = activityManager.getRunningAppProcesses();
        for (ActivityManager.RunningAppProcessInfo processInfo : processInfos) {
            if (processInfo.processName.equals(getApplication().getPackageName())) {
                if (processInfo.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND) {
                    for (String d: processInfo.pkgList) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
