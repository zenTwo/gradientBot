JSONObject json;

void setup() {
	size( 700, 300 );
	noStroke();

	json = loadJSONObject("colourObj.json");
	JSONArray colourArrayOne = json.getJSONArray("colour_0");

	Object red = colourArrayOne.get(0);
	Object blue = colourArrayOne.get(1);
	Object green = colourArrayOne.get(2);

	int r = Integer.parseInt(red.toString());
	int g = Integer.parseInt(blue.toString());
	int b = Integer.parseInt(green.toString());

	json = loadJSONObject("colourObj.json");
	JSONArray colourArrayTwo = json.getJSONArray("colour_1");

	Object redTwo = colourArrayTwo.get(0);
	Object blueTwo = colourArrayTwo.get(1);
	Object greenTwo = colourArrayTwo.get(2);

	int r2 = Integer.parseInt(redTwo.toString());
	int g2 = Integer.parseInt(blueTwo.toString());
	int b2 = Integer.parseInt(greenTwo.toString());

	int colourOne = color(r, g, b);
	int colourTwo = color(r2, g2, b2);

	int gradientSteps = 250;
	int gradientStripWidth = width / gradientSteps;

	for(int i = 0; i < gradientSteps; i++){

		float transition = map(i, 0, gradientSteps, 0.0, 1.0);

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