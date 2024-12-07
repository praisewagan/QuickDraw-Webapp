quick_draw_data_set=["aircraft carrier","airplane","alarm clock","ambulance","angel","animal migration","ant","anvil","apple","arm","asparagus","axe","backpack","banana","bandage","barn","baseball","baseball bat","basket","basketball","bat","bathtub","beach","bear","beard","bed","bee","belt","bench","bicycle","binoculars","bird","birthday cake","blackberry","blueberry","book","boomerang","bottlecap","bowtie","bracelet","brain","bread","bridge","broccoli","broom","bucket","bulldozer","bus","bush","butterfly","cactus","cake","calculator","calendar","camel","camera","camouflage","campfire","candle","cannon","canoe","car","carrot","castle","cat","ceiling fan","cello","cell phone","chair","chandelier","church","circle","clarinet","clock","cloud","coffee cup","compass","computer","cookie","cooler","couch","cow","crab","crayon","crocodile","crown","cruise ship","cup","diamond","dishwasher","diving board","dog","dolphin","donut","door","dragon","dresser","drill","drums","duck","dumbbell","ear", "elbow","elephant","envelope","eraser","eye","eyeglasses","face","fan","feather","fence","finger","fire hydrant","fireplace","firetruck","fish","flamingo","flashlight","flip flops","floor lamp","flower","flying saucer","foot","fork","frog","frying pan","garden","garden hose","giraffe","goatee","golf club","grapes","grass","guitar","hamburger","hammer","hand","harp","hat","headphones","hedgehog","helicopter","helmet","hexagon","hockey puck","hockey stick","horse","hospital","hot air balloon","hot dog","hot tub","hourglass","house","house plant","hurricane","ice cream","jacket","jail","kangaroo","key","keyboard","knee","knife","ladder","lantern","laptop","leaf","leg","light bulb","lighter","lighthouse","lightning","line","lion","lipstick","lobster","lollipop","mailbox","map","marker","matches","megaphone","mermaid","microphone","microwave","monkey","moon","mosquito","motorbike","mountain","mouse","moustache","mouth","mug","mushroom","nail","necklace","nose","ocean","octagon","octopus","onion","oven","owl","paintbrush","paint can","palm tree","panda","pants","paper clip","parachute","parrot","passport","peanut","pear","peas","pencil","penguin","piano","pickup truck","picture frame","pig","pillow","pineapple","pizza","pliers","police car","pond","pool","popsicle","postcard","potato","power outlet","purse","rabbit","raccoon","radio","rain","rainbow","rake","remote control","rhinoceros","rifle","river","roller coaster","rollerskates","sailboat","sandwich","saw","saxophone","school bus","scissors","scorpion","screwdriver","sea turtle","see saw","shark","sheep","shoe","shorts","shovel","sink","skateboard","skull","skyscraper","sleeping bag","smiley face","snail","snake","snorkel","snowflake","snowman","soccer ball","sock","speedboat","spider","spoon","spreadsheet","square","squiggle","squirrel","stairs","star","steak","stereo","stethoscope","stitches","stop sign","stove","strawberry","streetlight","string bean","submarine","suitcase","sun","swan","sweater","swingset","sword","syringe","table","teapot","teddy-bear","telephone","television","tennis racquet","tent","The Eiffel Tower","The Great Wall of China","The Mona Lisa","tiger","toaster","toe","toilet","tooth","toothbrush","toothpaste","tornado","tractor","traffic light","train","tree","triangle","trombone","truck","trumpet","tshirt","umbrella","underwear","van","vase","violin","washing machine","watermelon","waterslide","whale","wheel","windmill","wine bottle","wine glass","wristwatch","yoga","zebra","zigzag"]


let random_number;
let sketch;
let canvas;
let timer_counter = 0;
let timer_check = "";
let drawn_sketch = "";
let answer_holder = "";
let score = 0;

let classifier;  // This will hold the model

// Preload function to load the DoodleNet model
function preload() {
    classifier = ml5.imageClassifier('DoodleNet', modelLoaded);  // Load the DoodleNet model
}

// Callback function when the model is loaded
function modelLoaded() {
    console.log('Model Loaded!');
}

// Function to update the canvas with a new sketch
function updateCanvas() {
    random_number = Math.floor(Math.random() * quick_draw_data_set.length);
    sketch = quick_draw_data_set[random_number];
    console.log(sketch);
    document.getElementById('sketch-to-be-drawn').innerHTML = "Sketch to be Drawn: " + sketch;
    background(255); // Set the canvas background to white
}

// Function to set up the canvas
function setup() {
    canvas = createCanvas(280, 280);
    canvas.center(); // Center the canvas on the page
    background(255); // Set the background of the canvas to white

    // Call classifyCanvas() when the mouse is released
    canvas.mouseReleased(classifyCanvas);
}

// Function to draw on the canvas and check the sketch
function draw() {
    strokeWeight(5);  // Set stroke weight for drawing
    stroke(0);  // Set stroke color to black

    // If the mouse is pressed, draw on the canvas
    if (mouseIsPressed) {
        line(pmouseX, pmouseY, mouseX, mouseY);  // Draw a line based on mouse position
    }

    check_sketch(); // Call check_sketch to verify the drawn sketch
}

// Function to classify the drawing on the canvas
function classifyCanvas() {
    classifier.classify(canvas.elt, gotResult); // Classify the canvas
}

// Callback function when classification results are returned
// Callback function when classification results are returned
function gotResult(error, results) {
    if (error) {
        console.error(error);  // If there's an error, log it
    } else {
        console.log(results);  // Log the results

        // Get the first result (label) and confidence
        let label = results[0].label;
        let confidence = results[0].confidence;

        // Update the "Your Sketch" text with the predicted label
        document.getElementById('your-sketch').innerHTML = "Your Sketch: " + label;

        // Update the confidence value
        document.getElementById('confidence').innerHTML = "Confidence: " + (confidence * 100).toFixed(2) + "%";

        // Update the drawn sketch variable
        drawn_sketch = label;

        // Check if the confidence is greater than or equal to 50% (0.5)
        if (confidence >= 0.5) {
            score++; // Increment the score if the confidence is 50% or more
            document.getElementById('score').innerHTML = "Score: " + score; // Update the score on the screen
        }
    }
}


// Function to check the drawn sketch
function check_sketch() {
    timer_counter++;
    document.getElementById('timer').innerHTML = "Timer: " + timer_counter;
    console.log(timer_counter);

    if (timer_counter > 400) { // Time limit for drawing the sketch (in milliseconds)
        timer_counter = 0;
        timer_check = "completed";
    }

    if (timer_check === "completed" || answer_holder === "set") {
        timer_check = "";
        answer_holder = "";
        updateCanvas(); // Update canvas with a new sketch after time is up
    }

    // Check if the drawn sketch is equal to the sketch to be drawn
    if (drawn_sketch === sketch) {
        answer_holder = "set"; // Mark answer as correct
        score++; // Increment the score
        document.getElementById('score').innerHTML = "Score: " + score;
    }
}

function clearCanvas() {
    background("white");
}