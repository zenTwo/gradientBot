import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class assets extends PApplet {

public void setup() {
  
  noStroke();

  int colourOne = color(random(255), random(255), random(255));
  int colourTwo = color(random(255), random(255), random(255));

  int gradientSteps = 250;
  int gradientStripWidth = width / gradientSteps;

  for(int i = 0; i < gradientSteps; i++){

  float transition = map(i, 0, gradientSteps, 0.0f, 1.0f);

  int interpolatedColour = lerpColor(colourOne, colourTwo, transition);

  fill(interpolatedColour);
  rect(i * gradientStripWidth, 0, width, height);
  }

  noStroke();
  fill(colourTwo);
  ellipse(50, 50, 50, 50);

  noStroke();
  fill(colourOne);
  ellipse(width-50, height-50, 50, 50);
  save("output.jpeg");
  exit();
}
  public void settings() {  size( 700, 300 ); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "assets" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
