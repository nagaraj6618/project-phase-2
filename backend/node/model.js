const axios = require('axios');

const GEMINI_API_KEY = 'AIzaSyCk911b262Z87eptMb8zUFwxgcwMoa3nHo'; // Replace with your actual Gemini API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

async function checkGrammar(text) {
   try {
       const requestBody = {
           contents: [
               {
                   role: "user",
                   parts: [{ text: `Analyze the following text for grammar mistakes and word errors, but do not check punctuation errors. 
                    Also, give a reason for each error and assign a score from 0 to 100 based on grammatical correctness:

                   Text: "${text}"

                   Response Format (JSON):
                   {
                       score: [A score out of 100],
                       suggestion: ["List all suggestions as an array"],
                       correctedSentence: "[Full corrected version]"
                   }
                   ` }]
               }
           ]
       };

       const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, requestBody, {
           headers: { 'Content-Type': 'application/json' }
       });

       if (response.data && response.data.candidates) {
           console.log("Grammar Check Result:");
           console.log((response.data.candidates[0].content.parts[0].text));
           extractJson(response.data.candidates[0].content.parts[0].text)
       } else {
           console.log("Error: No response from Gemini API");
       }
   } catch (error) {
       console.error("Error checking grammar:", error.response?.data || error.message);
   }
}

// Example usage


function extractJson(formattedJsonString) {
   try {
       // Remove the enclosing triple backticks and "json" keyword
       const cleanedJsonString = formattedJsonString.replace(/```json\n|\n```/g, '');

       // Parse the cleaned JSON string
       const jsonData = JSON.parse(cleanedJsonString);

       // Display extracted JSON data
       console.log("Extracted JSON:", jsonData);

       return jsonData;
   } catch (error) {
       console.error("Error parsing JSON:", error);
       return null;
   }
}

// Example JSON input
// const inputJson = {
//    "formattedJson": "```json\n{\n  \"score\": 0,\n  \"suggestion\": [\n    \"The input \\\"Hedsdsdsds\\\" appears to be a random string of characters and not a grammatically correct sentence or phrase.\",\n    \"It contains no recognizable words or meaningful structure.\",\n    \"It is likely a typographical error or a nonsensical input.\"\n  ],\n  \"correctedSentence\": \"The input is ungrammatical and requires complete rewriting to convey meaning.\"\n}\n```"
// };

// Extract JSON data
const userInput = "I did not went there";
const inputJson = checkGrammar(userInput);

// const extractedData = extractJson(inputJson);

// console.log("Final Parsed JSON Object:", extractedData);
