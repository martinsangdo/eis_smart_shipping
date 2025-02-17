from flask import Flask

app = Flask(__name__)

@app.route('/')

def hello_world():
    return 'hello'

if __name__ == '__main__':
   app.run()

   #run the server: python .\app.py