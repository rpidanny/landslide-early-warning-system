#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>

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
  //dht.begin();
}

void loop()
{
  temp = analogRead(tempPin);          
  //String tempC = String((5.0 * temp * 100.0)/1024.0);  
  String final = "hello";
  //Serial.println(analogRead(0));
  char bufferC[bufferSize];
  Serial.println(final);
  final.toCharArray(bufferC,bufferSize);
  radio.write(&bufferC, sizeof(bufferC));
  
  delay(300);
}
