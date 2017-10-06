void setup() {
	size( 700, 300 );
	noStroke();

	int colourOne = color(random(255), random(255), random(255));
	int colourTwo = color(random(255), random(255), random(255));

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
