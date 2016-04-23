package challenge.app.warningreceiver;

/**
 * Created by abhishek on 4/23/16.
 */

import android.content.Intent;

import com.google.android.gms.iid.InstanceIDListenerService;

public class GCMInstanceIDListenerService extends InstanceIDListenerService {

    private static final String TAG = "InstanceIDLS";

    @Override
    public void onTokenRefresh(){
        Intent intent = new Intent(this,GCMRegistrationService.class);
        startService(intent);
    }
}
