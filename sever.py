from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

# 簡単なデータベース代わり
RESERVATIONS_FILE = 'reservations.json'

@app.route('/api/reservations', methods=['POST'])
def create_reservation():
    data = request.json
    
    # ファイルに保存
    if os.path.exists(RESERVATIONS_FILE):
        with open(RESERVATIONS_FILE, 'r') as f:
            reservations = json.load(f)
    else:
        reservations = []
    
    reservations.append(data)
    
    with open(RESERVATIONS_FILE, 'w') as f:
        json.dump(reservations, f, indent=2)
    
    return jsonify({"status": "success", "id": data['id']})

@app.route('/api/reservations', methods=['GET'])
def get_reservations():
    if os.path.exists(RESERVATIONS_FILE):
        with open(RESERVATIONS_FILE, 'r') as f:
            return jsonify(json.load(f))
    return jsonify([])

if __name__ == '__main__':
    app.run(debug=True)