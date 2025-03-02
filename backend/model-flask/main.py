from flask import Flask, redirect, url_for, render_template, request,jsonify
# from werkzeug.exceptions import BadRequest 
from grammar_model import calculate_weighted_score
# import speech_recognition as sr
from flask_cors import CORS
app = Flask(__name__)
text=""

CORS(app)

@app.route('/')
def welcome():
    response = {
        "message":"Server Running.."
    }
    return response

@app.route('/calculate_score', methods=['POST'])
def calculate_score():
    data = request.get_json()  # Expecting JSON input
    text = data.get('text', '')
    score,suggest = calculate_weighted_score(text)  # Ensure this function exists and is error-free
    print(suggest)
    result = {
        "score": score,
        "suggest": suggest
    }
    return jsonify(result)
# @app.route("/suggestion",methods=['POST'])
# def send_suggestion():

#     data = request.get_json()  # Expecting JSON input
#     text = data.get('text', '')
#     mistakes, errors = identify_errors(text)  # Ensure this function exists and is error-free
#     print(f"Suggestions: {mistakes}")
#     result = {
#         "suggestions": mistakes
#     }
#     return jsonify(result)



if __name__=='__main__':
    app.run(debug=True)