from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

DATA_FILE = "students.json"

# Load existing data
if os.path.exists(DATA_FILE):
    with open(DATA_FILE, "r") as f:
        students = json.load(f)
else:
    students = []

def save_data():
    with open(DATA_FILE, "w") as f:
        json.dump(students, f)


@app.route("/")
def home():
    return jsonify({"message": "Student Performance API Running 🚀"})


@app.route("/add-student", methods=["POST"])
def add_student():
    data = request.json

    student_id = str(data["student_id"])
    student_name = data["student_name"]
    scores = data["scores"]

    # Check duplicate
    for student in students:
        if student["student_id"] == student_id:
            return jsonify({"error": "Student already exists"}), 400

    students.append({
        "student_id": student_id,
        "student_name": student_name,
        "scores": scores
    })

    save_data()

    return jsonify({"message": "Student added successfully"}), 201


@app.route("/predict/<student_id>", methods=["GET"])
def predict(student_id):
    for student in students:
        if student["student_id"] == str(student_id):

            scores = student["scores"]

            if len(scores) == 0:
                return jsonify({"error": "No scores found"}), 400

            avg = sum(scores) / len(scores)
            trend = "Improving 📈" if scores[-1] > scores[0] else "Declining 📉"

            return jsonify({
                "student_name": student["student_name"],
                "average_score": round(avg, 2),
                "trend": trend,
                "predicted_next_score": round(avg + 5),
                "previous_scores": scores
            })

    return jsonify({"error": "Student not found"}), 404


if __name__ == "__main__":
    app.run(host = '0.0.0.0', port = 10000)