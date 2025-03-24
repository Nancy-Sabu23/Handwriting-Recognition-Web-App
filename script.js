// ✅ Step 1: Load TensorFlow.js Model
let model;
async function loadModel() {
    model = await tf.loadLayersModel("https://storage.googleapis.com/tfjs-models/tfjs/mnist_transfer_cnn_v1/model.json");
    console.log("✅ Model Loaded Successfully");
}
loadModel();

// ✅ Step 2: Setup Canvas
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Canvas Properties
canvas.width = 200;
canvas.height = 200;
ctx.fillStyle = "black"; // Set background to black
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = "white"; // Draw in white
ctx.lineWidth = 15;
ctx.lineJoin = "round";
ctx.lineCap = "round";

let drawing = false;

// Mouse Events
canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
});

canvas.addEventListener("mouseup", () => {
    drawing = false;
});

// Touch Events (for touchscreen devices like Chromebook)
canvas.addEventListener("touchstart", (e) => {
    let touch = e.touches[0];
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(touch.clientX - canvas.offsetLeft, touch.clientY - canvas.offsetTop);
});

canvas.addEventListener("touchmove", (e) => {
    if (!drawing) return;
    let touch = e.touches[0];
    ctx.lineTo(touch.clientX - canvas.offsetLeft, touch.clientY - canvas.offsetTop);
    ctx.stroke();
});

canvas.addEventListener("touchend", () => {
    drawing = false;
});

// ✅ Step 3: Clear Canvas Function
function clearCanvas() {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ✅ Step 4: Preprocess Canvas for Model Input
function preprocessCanvas() {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Convert to grayscale
    let grayScaled = new Float32Array(28 * 28);
    for (let i = 0; i < imageData.data.length; i += 4) {
        let avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
        grayScaled[i / 4] = avg / 255.0; // Normalize to 0-1
    }

    return tf.tensor4d(grayScaled, [1, 28, 28, 1]); // Shape (1, 28, 28, 1)
}

// ✅ Step 5: Predict Function
async function predictDigit() {
    if (!model) {
        console.error("❌ Model Not Loaded Yet");
        return;
    }

    let inputTensor = preprocessCanvas();
    let predictions = model.predict(inputTensor);
    let probabilities = await predictions.data();

    console.log("Confidence Scores:", probabilities);

    let predictedNumber = probabilities.indexOf(Math.max(...probabilities));
    console.log("Predicted Digit:", predictedNumber);

    // Display the result
    document.getElementById("prediction").innerText = "Predicted Digit: " + predictedNumber;
}
