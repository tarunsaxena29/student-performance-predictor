from flask import Flask, render_template, request, jsonify
import joblib
import pandas as pd
import os

app = Flask(__name__)

MODEL_PATH = os.path.join(
    "model",
    "student_performance_model.pkl"
)

model = joblib.load(MODEL_PATH)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():

    try:
        data = request.get_json()

        student_name = data.get("student_name", "Student")
        student_id = data.get("student_id", "N/A")

        student = pd.DataFrame([{
            "age": float(data["age"]),
            "gender": data["gender"],
            "department": data["department"],
            "semester": int(data["semester"]),
            "attendance": float(data["attendance"]),
            "study_hours": float(data["study_hours"]),
            "assignment_score": float(data["assignment_score"]),
            "midterm_score": float(data["midterm_score"]),
            "previous_cgpa": float(data["previous_cgpa"]),
            "backlogs": int(data["backlogs"]),
            "sleep_hours": float(data["sleep_hours"]),
            "screen_time": float(data["screen_time"]),
            "extracurricular": data["extracurricular"],
            "internet_access": data["internet_access"],
            "parent_support": data["parent_support"]
        }])

        prediction = model.predict(student)[0]

        prediction = max(0, min(100, prediction))
        prediction = round(float(prediction), 2)

        if prediction >= 85:
            category = "Excellent"
        elif prediction >= 70:
            category = "Good"
        elif prediction >= 50:
            category = "Average"
        else:
            category = "Needs Improvement"

        return jsonify({
            "student_name": student_name,
            "student_id": student_id,
            "prediction": prediction,
            "category": category
        })

    except Exception as e:

        print("ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 400


if __name__ == "__main__":
    app.run(debug=True)