const axios = require('axios');

// Replace with your Gemini AI API key
const API_KEY = "AIzaSyCk911b262Z87eptMb8zUFwxgcwMoa3nHo";
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

async function getGeminiResponse(prompt) {
    try {
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }]
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error fetching response from Gemini AI:', error);
    }
}

// Example usage
const prompt = "Give Addtion program in python";
// getGeminiResponse(prompt).then(response => console.log(response));

async function optimizePrompt(prompt) {
   try {
       const response = await axios.post(
           `${GEMINI_API_URL}?key=${API_KEY}`,
           {
               contents: [{ parts: [{ text: `Optimize this prompt for better AI response: ${prompt}` }] }]
           },
           {
               headers: {
                   'Content-Type': 'application/json'
               }
           }
       );
       console.log(response.data.candidates[0].content.parts[0].text)
       return response.data.candidates[0].content.parts[0].text;
   } catch (error) {
       console.error('Error optimizing prompt:', error);
       return prompt;
   }
}
// optimizePrompt("Explain how quantum computing works in simple terms.")

async function checkGrammar(text) {
    try {
        const prompt = `Analyze the following text for grammar mistakes, word errors, and provide corrections. 
        Also, give a reason for each error and assign a score from 0 to 100 based on grammatical correctness:
        
        Text: "${text}"
        
        Response Format:
        - Error: [Detected error]
        - Suggestion: [Correction with reason]
        - Corrected Sentence: [Full corrected version]
        - Score: [A score out of 100]
        `;

        const response = await axios.post(`${GEMINI_API_URL}?key=${API_KEY}`, {
            // prompt: prompt,
            contents: [{ parts: [{ text: {prompt} }] }],
            // temperature: 0.5,
            // maxTokens: 500
        },{
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data && response.data.candidates) {
            console.log("Grammar Check Result:");
            console.log(response.data.candidates[0].output);
        } else {
            console.log("Error: No response from Gemini API");
        }
    } catch (error) {
        console.error("Error checking grammar:", error);
    }
}

const userInput = "She go to the market every day and buy fresh vegetables.";
checkGrammar(userInput);
// console.log(data);