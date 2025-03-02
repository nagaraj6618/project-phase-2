# 🚀 Flask Grammar Checker

## 🌟 Overview
This is a Flask-based web application that identifies and corrects grammar mistakes in the given text. The project is designed to be lightweight, modular, and easy to deploy.

## ✨ Features
- ✅ Detects grammatical errors in input text
- ✅ Suggests corrections for mistakes
- ✅ User-friendly web interface for text input and correction

## 📥 Installation

### 🔧 Prerequisites
Ensure you have the following installed:
- 🐍 Python 3.x
- 🔥 Flask
- 📦 Virtualenv (optional but recommended)
- 📝 NLP libraries (such as spaCy, LanguageTool, or Gramformer)

### ⚙️ Setup
1. Clone the repository:
   ```bash
   cd model-flask
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## 🚀 Usage
1. Run the application:
   ```bash
   python app.py
   ```
2. Open your browser and visit:
   ```
   http://127.0.0.1:5000
   ```
3. Enter text in the input field and click "Check Grammar" to see corrections.

## ⚙️ Configuration
Modify the `config.py` file to change application settings.

## 📁 Folder Structure
```
project_root/
│── app.py
│── .ipynb_checkpoints/
│── requirements.txt
│── static/
│── grammar_model.py
│── main.py
│── README.md
```

## 🤝 Contributing
Feel free to fork the repository and submit pull requests. Contributions are always welcome! 🎉

