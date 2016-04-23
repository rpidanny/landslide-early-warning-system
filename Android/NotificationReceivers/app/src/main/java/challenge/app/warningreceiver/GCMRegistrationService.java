package challenge.app.warningreceiver;

/**
 * Created by abhishek on 4/23/16.
 */

import android.app.IntentService;
import android.content.Intent;
import android.util.Log;

import com.google.android.gms.gcm.GcmPubSub;
import com.google.android.gms.gcm.GoogleCloudMessaging;
import com.google.android.gms.iid.InstanceID;

import java.io.IOException;

public class GCMRegistrationService extends IntentService {

    private static final String TAG = "PushNotification";

    public GCMRegistrationService(){
        super(TAG);
    }

    @Override
    protected void onHandleIntent(Intent intent){
        String senderID = intent.getStringExtra("senderID");
        if (senderID == null) {
            Log.i(TAG, "No Sender ID");
            return;
        }
        try{
            InstanceID instanceID = InstanceID.getInstance(getApplicationContext());
            String token = instanceID.getToken(senderID, GoogleCloudMessaging.INSTANCE_ID_SCOPE, null);
            Log.i(TAG, "GCM Registration Token: " + token);
            subscribeTopics(token);
            sendRegistrationToken(token);
        }catch (Exception e){
            Log.i(TAG,"Error Getting Instance ID");
            e.printStackTrace();
        }
    }

    //send intent with obtained token
    private void sendRegistrationToken(String token){
        Intent intent = new Intent("PushNotificationRegisteredToken");
        intent.putExtra("token",token);
        sendBroadcast(intent);
    }


    //subscribe to topics for group messaging
    private void subscribeTopics(String token) throws IOException {
        GcmPubSub pubSub = GcmPubSub.getInstance(this);
        for (String topic : GCMPreferences.TOPICS) {
            pubSub.subscribe(token, "/topics/" + topic, null);
            System.out.println("Subscribed to : "+topic);
        }
    }
}
