from flask import Flask, request, jsonify
import joblib
import openai
import pandas as pd

# Initialize Flask app
app = Flask(__name__)

# Load the trained ML model
model = joblib.load("loan_underwriting_model.pkl")  # Make sure this file is in the same directory

# Set OpenAI API key
openai.api_key = "your_openai_api_key"

# Function to process unstructured data with OpenAI LLM
def process_with_llm(text):
    """
    Analyze borrower description with an LLM and return a risk score (1-5).
    """
    try:
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=f"Analyze this borrower description: '{text}'. Provide a risk score (1-5):",
            max_tokens=10
        )
        risk_score = int(response.choices[0].text.strip())
    except Exception as e:
        print(f"Error processing text: {e}")
        risk_score = 3  # Default risk score in case of error
    return risk_score

# API endpoint for predictions
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Parse JSON data
        data = request.json
        income = data['income']
        credit_score = data['credit_score']
        loan_amount = data['loan_amount']
        borrower_description = data['borrower_description']
        
        # Process borrower description with LLM
        risk_score = process_with_llm(borrower_description)

        # Prepare input for ML model
        input_data = pd.DataFrame([[income, credit_score, loan_amount, risk_score]],
                                  columns=['income', 'credit_score', 'loan_amount', 'risk_score'])

        # Predict loan risk
        prediction = model.predict(input_data)[0]
        result = "Default Risk" if prediction == 1 else "Low Risk"

        return jsonify({
            "prediction": result,
            "risk_score": risk_score
        })
    except Exception as e:
        return jsonify({"error": str(e)})

# Run Flask app
if __name__ == '__main__':
    app.run(debug=True)
