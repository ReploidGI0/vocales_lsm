const URL = "https://teachablemachine.withgoogle.com/models/j-ZyZLEBp/";
let model, webcam, progressContainer, maxPredictions;
// Define el índice de la clase que deseas evaluar
const targetClassIndex = 0;

// Carga el modelo y configura la camara web
async function init() {    
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Configuracion de camara
    const flip = true; // Mueve la orientacion de la camara
    webcam = new tmImage.Webcam(350, 350, flip); // Anchura, altura y flip
    await webcam.setup(); // Solicita acceso a la webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    progressContainer = document.getElementById("progress-container");

    //En este apartado se pueden controlar el numero de progress bars que se crean
    progressContainer.appendChild(createProgressElement());
}
    
function createProgressElement() {
    document.getElementById('mensaje').style.display = 'none';
    const progressElement = document.createElement("div");
    progressElement.classList.add("progress");
    progressElement.style.width = "0%";
    return progressElement;
}

async function loop() {
    webcam.update(); // Actualiza el frame de la webcam
    await predict();
    window.requestAnimationFrame(loop);
}

// Ejecuta el modelo de imagen con lo que se vea en la webcam
async function predict() {
    const prediction = await model.predict(webcam.canvas);
    //Para Evaluar UNA SOLA LETRA
    // obtener la predicción de la clase específica usando el índice
    const targetClassPrediction = prediction[targetClassIndex];
    const classPrediction =
    targetClassPrediction.className + ": " + ((targetClassPrediction.probability.toFixed(2))*100)+"%";
    
    progressContainer.childNodes[targetClassIndex].innerHTML = classPrediction;
    updateProgress(targetClassIndex, targetClassPrediction.probability);
}

function updateProgress(index, probability) {
    const progressElement = progressContainer.childNodes[index];
    progressElement.style.width = `${probability * 100}%`;
}