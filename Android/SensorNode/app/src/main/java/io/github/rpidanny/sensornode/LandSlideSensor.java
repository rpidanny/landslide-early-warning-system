package io.github.rpidanny.sensornode;

/**
 * Created by abhishek on 4/23/16.
 */
public class LandSlideSensor {
    private double x,y,z,tilt,pan,yaw;
    private String location;
    private int humidity;

    LandSlideSensor(double x, double y, double z,double tilt,double pan, double yaw,String location,int humidity){
        this.x=x;
        this.y=y;
        this.z=z;
        this.tilt=tilt;
        this.pan=pan;
        this.yaw=yaw;
        this.location = location;
        this.humidity = humidity;
    }

    public double getX(){
        return this.x;
    }

    public double getY(){
        return this.y;
    }
    public double getZ(){
        return this.z;
    }
    public double getTilt(){
        return this.tilt;
    }
    public double getPan(){
        return this.pan;
    }
    public double getYaw(){
        return this.yaw;
    }
    public String getLocation(){
        return this.location;
    }
    public int getHumidity(){
        return this.humidity;
    }
}
