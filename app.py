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
    body_data = {
        'list_turbine_ids': request.form.get('list_turbine_ids').split(','),
        'from_wave_h': request.form.get('from_wave_h'),
        'from_e_wind': request.form.get('from_e_wind'), 
        'from_n_wind': request.form.get('from_n_wind'), 
        'from_e_current': request.form.get('from_e_current'), 
        'from_n_current': request.form.get('from_n_current'), 
        'from_time': request.form.get('from_time')
    }
    shortest_path_result, min_distance_result = get_n_predict(body_data)
    return {'predicted_fuel': min_distance_result, 'shortest_path_result': shortest_path_result}

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080)   #run development configs -> remove this when releasing
    #serve(app, host="0.0.0.0", port=8080)
    #http_server = WSGIServer(('', 5000), app)
    #http_server.serve_forever()

   #run the server: python .\app.py