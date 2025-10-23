from flask import Flask, render_template, jsonify
import json

app = Flask(__name__)

with open('sample_properties.json') as f:
    listings = json.load(f)['results']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/listings')
def get_listings():
    return jsonify(listings)

if __name__ == '__main__':
    app.run(debug=True)