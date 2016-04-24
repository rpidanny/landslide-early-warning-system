#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>
#include <Wire.h>
#include "Kalman.h"

Kalman kalmanX; 
Kalman kalmanY;
String humidity = "20";
double accX, accY, accZ;
double gyroX, gyroY, gyroZ;
int16_t tempRaw;

double gyroXangle, gyroYangle; 
double compAngleX, compAngleY; 
double kalAngleX, kalAngleY; 

uint32_t timer;
uint8_t i2cData[14]; 


RF24 radio(7, 8);

const byte rxAddr[6] = "00001";
float temp;
int tempPin =0;

int bufferSize = 50;
void setup()
{ 
  Serial.begin(9600);
  radio.begin();
  radio.setRetries(15, 15);
  radio.openWritingPipe(rxAddr);
  radio.setPALevel(RF24_PA_HIGH);
  radio.stopListening();
    Wire.begin();
#if ARDUINO >= 157
  Wire.setClock(400000UL); 
#else
  TWBR = ((F_CPU / 400000UL) - 16) / 2; 
#endif

  i2cData[0] = 7; 
  i2cData[1] = 0x00; 
  i2cData[2] = 0x00;
  i2cData[3] = 0x00; 
  while (i2cWrite(0x19, i2cData, 4, false)); 
  while (i2cWrite(0x6B, 0x01, true)); 

  while (i2cRead(0x75, i2cData, 1));
  if (i2cData[0] != 0x68) { 
    Serial.print(F("Error reading sensor"));
    while (1);
  }

  delay(100); 

  while (i2cRead(0x3B, i2cData, 6));
  accX = (i2cData[0] << 8) | i2cData[1];
  accY = (i2cData[2] << 8) | i2cData[3];
  accZ = (i2cData[4] << 8) | i2cData[5];
#ifdef RESTRICT_PITCH 
  double roll  = atan2(accY, accZ) * RAD_TO_DEG;
  double pitch = atan(-accX / sqrt(accY * accY + accZ * accZ)) * RAD_TO_DEG;
#else 
  double roll  = atan(accY / sqrt(accX * accX + accZ * accZ)) * RAD_TO_DEG;
  double pitch = atan2(-accX, accZ) * RAD_TO_DEG;
#endif

  kalmanX.setAngle(roll); 
  kalmanY.setAngle(pitch);
  gyroXangle = roll;
  gyroYangle = pitch;
  compAngleX = roll;
  compAngleY = pitch;

  timer = micros();
}

void loop()
{
  while (i2cRead(0x3B, i2cData, 14));
  accX = ((i2cData[0] << 8) | i2cData[1]);
  accY = ((i2cData[2] << 8) | i2cData[3]);
  accZ = ((i2cData[4] << 8) | i2cData[5]);
  tempRaw = (i2cData[6] << 8) | i2cData[7];
  gyroX = (i2cData[8] << 8) | i2cData[9];
  gyroY = (i2cData[10] << 8) | i2cData[11];
  gyroZ = (i2cData[12] << 8) | i2cData[13];

  double dt = (double)(micros() - timer) / 1000000; 
  timer = micros();

#ifdef RESTRICT_PITCH 
  double roll  = atan2(accY, accZ) * RAD_TO_DEG;
  double pitch = atan(-accX / sqrt(accY * accY + accZ * accZ)) * RAD_TO_DEG;
#else 
  double roll  = atan(accY / sqrt(accX * accX + accZ * accZ)) * RAD_TO_DEG;
  double pitch = atan2(-accX, accZ) * RAD_TO_DEG;
#endif

  double gyroXrate = gyroX / 131.0; 
  double gyroYrate = gyroY / 131.0; 

#ifdef RESTRICT_PITCH
  if ((roll < -90 && kalAngleX > 90) || (roll > 90 && kalAngleX < -90)) {
    kalmanX.setAngle(roll);
    compAngleX = roll;
    kalAngleX = roll;
    gyroXangle = roll;
  } else
    kalAngleX = kalmanX.getAngle(roll, gyroXrate, dt); 

  if (abs(kalAngleX) > 90)
    gyroYrate = -gyroYrate; 
  kalAngleY = kalmanY.getAngle(pitch, gyroYrate, dt);
#else
  if ((pitch < -90 && kalAngleY > 90) || (pitch > 90 && kalAngleY < -90)) {
    kalmanY.setAngle(pitch);
    compAngleY = pitch;
    kalAngleY = pitch;
    gyroYangle = pitch;
  } else
    kalAngleY = kalmanY.getAngle(pitch, gyroYrate, dt); 

  if (abs(kalAngleY) > 90)
    gyroXrate = -gyroXrate; 
  kalAngleX = kalmanX.getAngle(roll, gyroXrate, dt); 
#endif

  gyroXangle += gyroXrate * dt; 
  gyroYangle += gyroYrate * dt;

  compAngleX = 0.93 * (compAngleX + gyroXrate * dt) + 0.07 * roll; 
  compAngleY = 0.93 * (compAngleY + gyroYrate * dt) + 0.07 * pitch;

  if (gyroXangle < -180 || gyroXangle > 180)
    gyroXangle = kalAngleX;
  if (gyroYangle < -180 || gyroYangle > 180)
    gyroYangle = kalAngleY;

  if(Serial.available()){
    humidity= Serial.readString();
  }
  Serial.print(kalAngleY); Serial.print("\t");
  Serial.print("\r\n");
  String final = "4,2,"+String(kalAngleY)+","+humidity;
  char bufferC[bufferSize];
  Serial.println(final);
  final.toCharArray(bufferC,bufferSize);
  radio.write(&bufferC, sizeof(bufferC));

  delay(1000);
}
