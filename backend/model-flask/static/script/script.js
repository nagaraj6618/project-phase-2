const add_text = document.getElementById("add_text");
const add_q = document.getElementById("add_q");
const startAudio = document.getElementById("audioBtn");



function displayAudioBtn(){
    let content_holder =document.getElementById("content_holder");
    let audioBtn = document.createElement("div");
    audioBtn.innerHTML = `
        <div>
            <button class="audioBtn"  id="audioBtn" ><img src="static/images/voice_assistant.png"
             alt="audio" class="audioBtnImg"></button>
             <input type= "text" id="textInput">
             <button id = "sendBtn" class= "buttons">Send</button>
            
        </div>
    `
    content_holder.appendChild(audioBtn);
    audioBtn.querySelector("#audioBtn").addEventListener("click", getAudio);
}
// async function getAudio(){
//     try{
//         const response= await fetch("http://127.0.0.1:5000/getAudio");
//         if(!response){
//             throw new Error('Network response was not ok!');
//         }
//         const data = await response.json();
//         let content_holder= document.getElementById("content_holder");
//         let new_element = document.createElement("div")
//         new_element.innerHTML= `
//         <div class="inside_content_holder">
//             <p>Your sentence: ${data.text} </p>
//         </div>
//         `
//         content_holder.appendChild(new_element)
//         // Getting the score
//         const scoreResponse = await fetch("http://127.0.0.1:5000/calculate_score", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({ text: data.text })
//         });

//         const scoreData = await scoreResponse.json();

//         // Display score and suggestions safely
//         let scoreElement = document.createElement("div");
//         let suggestions = scoreData.suggestions || []; // Ensure suggestions is an array
        
//         scoreElement.innerHTML = `
//             <div class="score-card">
//                 <h3>Score Card</h3>
//                 <p>Score: ${scoreData.score}</p>
//             </div>
//             <div class="suggestions">
//                 <h3>Suggestions:</h3>
//                 <p>${suggestions.length > 0 ? suggestions.join('<br>') : 'No suggestions'}</p>
//             </div>
//         `;
        
//         content_holder.appendChild(scoreElement);

//     }
//     catch(error){
//         console.log("Error: ",error);
//     }

// };
async function getAudio() {
    try {
        const response = await fetch("http://127.0.0.1:5000/getAudio");
        const data = await response.json();
        const text = data.text;
        let content_holder= document.getElementById("content_holder");
        let new_element = document.createElement("div")
        new_element.innerHTML= `
        <div class="inside_content_holder">
            <p>Your sentence: ${data.text} </p>
        </div>
        `
        content_holder.appendChild(new_element)

        // POST request to calculate score based on recognized text
        const scoreResponse = await fetch("http://127.0.0.1:5000/calculate_score", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: text })
        });

        if (!scoreResponse.ok) {
            throw new Error('Score calculation failed!');
        }

        const scoreData = await scoreResponse.json();
        // Display score and suggestions in the HTML
        document.querySelector(".score-card p").innerText = `Score: ${scoreData.score}`;
        // const suggestionData = await fetch("http://127.0.0.1:5000/suggestion", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({ text: text })
        // });
        // if(!suggestionData){
        //     throw new Error('Suggestions is not found');
        // }
        document.querySelector(".suggest p").innerText = `Suggestion: ${scoreData.suggest}`;
    } catch (error) {
        console.error("Error:", error);
    }
};

async function displayQuestion(){
    try{
        const response = await fetch('/static/data.json');
        const questions = await response.json();
        const randomId= Math.floor(Math.random() * questions.length);
        const randomQuestion = questions[randomId].question;
        let content_holder= document.getElementById("content_holder");
        let new_element = document.createElement("div");
        new_element.innerHTML = `
        <div class="inside_content_holder">
            <p> ${randomQuestion} </p>
        </div>
        <br>
        <div>
            <button class="audioBtn"  id="audioBtn" ><img src="static/images/voice_assistant.png" 
            alt="audio" class="audioBtnImg"></button>
        </div>
        ` 
        content_holder.appendChild(new_element);
        new_element.querySelector("#audioBtn").addEventListener("click", getAudio);
    }
    catch(error){
        console.log("Error: ",error);
    }
};

add_text.addEventListener("click",displayAudioBtn);
add_q.addEventListener("click",displayQuestion);
