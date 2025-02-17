from flask import Flask, render_template

app = Flask(__name__)

@app.route('/', methods=['GET'])
#home page
def index():
    return 'Hello'

@app.route('/predict', methods=['GET'])
#main page
def predict_page():
    try:
        return render_template("predict.html")  # Serve the created page
    except Exception as e: # Handle file not found or other errors
        return f"Error loading page: {e}"

@app.route('/post_predict', methods=['POST'])
def process_predict():
    return 'test'

if __name__ == '__main__':
   app.run()

   #run the server: python .\app.py