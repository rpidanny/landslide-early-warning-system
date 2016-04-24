package io.github.rpidanny.sensornode;

import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.AsyncTask;
import android.os.SystemClock;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.SeekBar;
import android.widget.TextView;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Timer;
import java.util.TimerTask;

public class MainActivity extends AppCompatActivity {

    SensorManager sensorManager;
    SensorEventListener mEventListener;
    private Button btnStart;
    private TextView txt1;
    private String SERVER_URL = "http://192.168.1.35:3000/sensor";
    private String TAG = "MainActivity";
    private Boolean sensorFlag = false;
    private SeekBar sb,sb1,sb2;

    private float[] mValuesAccel       = new float[3];
    private float[] mValuesOrientation = new float[3];
    private int humidity,sensorID,location;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        sensorManager = (SensorManager) this.getSystemService(SENSOR_SERVICE);

        /*
        new android.os.Handler().postDelayed(
            new Runnable() {
                public void run() {

                }
            },
        1500); */

        new Timer().scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        if(sensorFlag) {
                            System.out.println("Send POST");
                            txt1.setText(Float.toString(mValuesOrientation[1]));
                            LandSlideSensor s = new LandSlideSensor(mValuesAccel[0],mValuesAccel[1],mValuesAccel[2],mValuesOrientation[0],mValuesOrientation[1],mValuesOrientation[2],location,humidity,sensorID);
                            PostTask myTask = new PostTask();
                            myTask.execute(s);
                        }else{
                            System.out.println("false");
                        }
                    }
                });
            }
        }, 0, 1000);
        sb = (SeekBar) findViewById(R.id.seekBar);
        sb.setProgress(30);
        sb.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                humidity = progress;
            }

            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {

            }

            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {

            }
        });


        sb1 = (SeekBar) findViewById(R.id.seekBar2);
        sb1.setProgress(1);
        sb1.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                location = progress;
            }

            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {

            }

            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {

            }
        });

        sb2 = (SeekBar) findViewById(R.id.seekBar3);
        sb2.setProgress(2);
        sb2.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                sensorID = progress;
            }

            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {

            }

            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {

            }
        });

        btnStart = (Button) findViewById(R.id.btnStart);
        btnStart.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(!sensorFlag) {
                    btnStart.setText("Stop");
                    sensorFlag = true;
                    System.out.print(sensorFlag);
                }else {
                    sensorFlag = false;
                    btnStart.setText("Start");
                    System.out.print(sensorFlag);
                }
            }
        });

        txt1 = (TextView) findViewById(R.id.textView1);

        mEventListener = new SensorEventListener() {
            public void onAccuracyChanged(Sensor sensor, int accuracy) {
            }

            public void onSensorChanged(SensorEvent event) {
                // Handle the events for which we registered
                switch (event.sensor.getType()) {
                    case Sensor.TYPE_ACCELEROMETER:
                        System.arraycopy(event.values, 0, mValuesAccel, 0, 3);
                        //System.out.println(mValuesOrientation[1]);
                        break;
                    case Sensor.TYPE_ORIENTATION:
                        System.arraycopy(event.values, 0, mValuesOrientation, 0, 3);
                        //System.out.println(mValuesOrientation[0]);
                }
            };
        };



        setListners(sensorManager, mEventListener);

    }

    public void setListners(SensorManager sensorManager, SensorEventListener mEventListener)
    {
        sensorManager.registerListener(mEventListener, sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER),
                SensorManager.SENSOR_DELAY_NORMAL);
        sensorManager.registerListener(mEventListener, sensorManager.getDefaultSensor(Sensor.TYPE_ORIENTATION),
                SensorManager.SENSOR_DELAY_NORMAL);
    }

    private static String convertInputStreamToString(InputStream inputStream) throws IOException {
        BufferedReader bufferedReader = new BufferedReader( new InputStreamReader(inputStream));
        String line = "";
        String result = "";
        while((line = bufferedReader.readLine()) != null)
            result += line;

        inputStream.close();
        return result;

    }


    private class PostTask extends AsyncTask<LandSlideSensor, String, Boolean> {
        @Override
        protected Boolean doInBackground(LandSlideSensor... sensor) {
            InputStream inputStream = null;
            String json = "";
            String result = "";

            HttpClient httpclient = new DefaultHttpClient();
            HttpPost httppost = new HttpPost(SERVER_URL);

            try{

                JSONObject jsonObject = new JSONObject();
                jsonObject.accumulate("x_acceleration", sensor[0].getX());
                jsonObject.accumulate("y_acceleration", sensor[0].getY());
                jsonObject.accumulate("z_acceleration", sensor[0].getZ());
                jsonObject.accumulate("tilt", sensor[0].getTilt());
                jsonObject.accumulate("pan", sensor[0].getPan());
                jsonObject.accumulate("yaw", sensor[0].getYaw());
                jsonObject.accumulate("location", sensor[0].getLocation());
                jsonObject.accumulate("humidity", sensor[0].getHumidity());
                jsonObject.accumulate("sensor_id", sensor[0].getSensorID());


                json = jsonObject.toString();
                final String tempdata = json;
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        txt1.setText(tempdata);
                    }
                });
                System.out.println(json);
            }catch (Exception e){
                e.printStackTrace();
                return false;
            }


            try {

                StringEntity se = new StringEntity(json);

                httppost.setEntity(se);

                httppost.setHeader("Content-type", "application/json");
                HttpResponse httpResponse = httpclient.execute(httppost);
                inputStream = httpResponse.getEntity().getContent();

                if(inputStream != null)
                    result = convertInputStreamToString(inputStream);
                else
                    result = "Did not work!";

            } catch (ClientProtocolException e) {
                e.printStackTrace();
                return false;
            } catch (IOException e) {
                e.printStackTrace();
                return false;
            }

            return true;
        }

        protected void onPostExecute(Boolean success){
            if(success){
                Log.i(TAG,"POST Success!!");
            }else{
                Log.i(TAG,"POST Fail!!");
            }
        }
    }
}
