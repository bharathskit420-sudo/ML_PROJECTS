import { useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

function App() {
  const [studentId, setStudentId] = useState("");
  const [data, setData] = useState(null);

  const [formData, setFormData] = useState({
    student_id: "",
    student_name: "",
    scores: ""
  });

  // 🔹 Fetch Prediction
  const fetchPrediction = async () => {
    try {
      const response = await axios.get(
        `https://ml-projects-sxuh.onrender.com/predict/${studentId}`
      );
      setData(response.data);
    } catch (error) {
      alert("Student not found");
    }
  };

  // 🔹 Add Student
  const handleAddStudent = async () => {
    try {
      await axios.post("https://ml-projects-sxuh.onrender.com/add-student", {
        student_id: formData.student_id,
        student_name: formData.student_name,
        scores: formData.scores.split(",").map(Number)
      });

      alert("Student added successfully!");

      setFormData({
        student_id: "",
        student_name: "",
        scores: ""
      });

    } catch (error) {
      alert("Error adding student");
    }
  };

 // 🔹 Chart Data
const chartData = data
  ? {
      labels: data.previous_scores.map((_, i) => `Test ${i + 1}`),
      datasets: [
        {
          label: "Scores",
          data: data.previous_scores,
          borderWidth: 3,

          // ✅ ADD THESE LINES
          borderColor: "blue",
          backgroundColor: "rgba(0, 0, 255, 0.2)",
          tension: 0.4,
          fill: true
        }
      ]
    }
  : null;

  const trendColor =
    data?.trend === "Improving"
      ? "#16a34a"
      : data?.trend === "Declining"
      ? "#dc2626"
      : "#2563eb";

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>📊 Student Performance Dashboard</h1>

      {/* 🔹 ADD STUDENT FORM */}
      <div style={styles.formCard}>
        <h2>Add Student</h2>

        <input
          type="text"
          placeholder="Student ID"
          value={formData.student_id}
          onChange={(e) =>
            setFormData({ ...formData, student_id: e.target.value })
          }
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Student Name"
          value={formData.student_name}
          onChange={(e) =>
            setFormData({ ...formData, student_name: e.target.value })
          }
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Scores (e.g. 70,75,80)"
          value={formData.scores}
          onChange={(e) =>
            setFormData({ ...formData, scores: e.target.value })
          }
          style={styles.input}
        />

        <button onClick={handleAddStudent} style={styles.button}>
          Add Student
        </button>
      </div>

      {/* 🔹 SEARCH BOX */}
      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          style={styles.input}
        />
        <button onClick={fetchPrediction} style={styles.button}>
          Get Prediction
        </button>
      </div>

      {/* 🔹 RESULT CARD */}
      {data && (
        <div style={styles.card}>
          <h2>{data.student_name}</h2>

          <div style={styles.statsContainer}>
            <div style={styles.statBox}>
              <h4>Average Score</h4>
              <p>{data.average_score}</p>
            </div>

            <div style={styles.statBox}>
              <h4>Trend</h4>
              <p style={{ color: trendColor }}>{data.trend}</p>
            </div>

            <div style={styles.statBox}>
              <h4>Predicted Next Score</h4>
              <p>{data.predicted_next_score}</p>
            </div>
          </div>

          <div style={{ marginTop: "30px" }}>
            {chartData && <Line data={chartData} />}
          </div>
        </div>
      )}
    </div>
  );
}

// 🔹 Styles
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f4f6",
    padding: "40px",
    fontFamily: "Arial"
  },
  title: {
    textAlign: "center",
    marginBottom: "30px"
  },
  formCard: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    maxWidth: "500px",
    margin: "0 auto 40px auto",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  searchBox: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "30px"
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px 20px",
    borderRadius: "6px",
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer"
  },
  card: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    maxWidth: "800px",
    margin: "0 auto",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)"
  },
  statsContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px"
  },
  statBox: {
    background: "#f9fafb",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    width: "30%"
  }
};

export default App;