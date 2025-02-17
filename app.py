from wsgiref.simple_server import WSGIServer
from flask import Flask, render_template, request
from my_prediction import *

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
    data_from_js = request.form.get('txt_datetime')
    shortest_path_result, min_distance_result = get_n_predict(data_from_js)
    return {'predicted_fuel': min_distance_result}

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080)   #run development configs -> remove this when releasing
    #serve(app, host="0.0.0.0", port=8080)
    #http_server = WSGIServer(('', 5000), app)
    #http_server.serve_forever()

   #run the server: python .\app.py