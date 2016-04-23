package challenge.app.warningreceiver;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import java.io.IOException;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.UnknownHostException;

public class MainActivity extends AppCompatActivity {

    private Socket socket;

    public static final int SERVERPORT = 8000;
    public static final String SERVERHOST = "192.168.0.56";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        new Thread( new ClientThread()).start();
    }

    class ClientThread implements Runnable{
        public void run(){
            try {
                InetAddress serverAddress = InetAddress.getByName(SERVERHOST);
                socket = new Socket(serverAddress, SERVERPORT);
            }
            catch(UnknownHostException ex){
                ex.printStackTrace();
            }
            catch (IOException ex){
                ex.printStackTrace();
            }
        }
    }
}
