const form = document.getElementById("predictionForm");
const resultCard = document.getElementById("resultCard");

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const data = {

        student_name: document.getElementById("student_name").value,
        student_id: document.getElementById("student_id").value,

        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,
        department: document.getElementById("department").value,
        semester: document.getElementById("semester").value,

        attendance: document.getElementById("attendance").value,
        study_hours: document.getElementById("study_hours").value,

        assignment_score:
            document.getElementById("assignment_score").value,

        midterm_score:
            document.getElementById("midterm_score").value,

        previous_cgpa:
            document.getElementById("previous_cgpa").value,

        backlogs:
            document.getElementById("backlogs").value,

        sleep_hours:
            document.getElementById("sleep_hours").value,

        screen_time:
            document.getElementById("screen_time").value,

        extracurricular:
            document.getElementById("extracurricular").value,

        internet_access:
            document.getElementById("internet_access").value,

        parent_support:
            document.getElementById("parent_support").value
    };

    resultCard.innerHTML = `
        <div class="loading">
            <div class="robot">AI</div>
            <h2>Analyzing Student</h2>
            <p>Machine Learning model is generating prediction...</p>
        </div>
    `;

    try {

        const response = await fetch("/predict", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Prediction failed");
        }

        const score = Number(result.prediction);

        resultCard.innerHTML = `

            <div>

                <div class="robot">
                    AI
                </div>

                <p class="score-label">
                    STUDENT
                </p>

                <h2>
                    ${result.student_name}
                </h2>

                <p>
                    Student ID:
                    <strong>${result.student_id}</strong>
                </p>

                <p class="score-label">
                    PREDICTED FINAL SCORE
                </p>

                <div class="score">
                    ${score.toFixed(2)}
                    <span>/ 100</span>
                </div>

                <div class="category">
                    ${result.category}
                </div>

                <div class="score-bar">
                    <div
                        class="score-fill"
                        id="scoreFill">
                    </div>
                </div>

                <p class="result-message">
                    ${score >= 85
                ? "Excellent academic performance."
                : score >= 70
                    ? "Good performance. Keep improving consistently."
                    : score >= 50
                        ? "Average performance. More consistency can help."
                        : "Needs improvement. Focus on academic consistency."
            }
                </p>

            </div>
        `;

        setTimeout(() => {

            const fill = document.getElementById("scoreFill");

            if (fill) {
                fill.style.width =
                    Math.min(100, Math.max(0, score)) + "%";
            }

        }, 100);

    } catch (error) {

        resultCard.innerHTML = `

            <div>

                <div class="robot">!</div>

                <h2>Prediction Failed</h2>

                <p>
                    ${error.message}
                </p>

            </div>
        `;
    }
});