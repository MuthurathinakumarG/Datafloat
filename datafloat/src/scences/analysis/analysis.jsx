import React, { useEffect, useState } from "react"; // React hooks
import axios from "axios"; // HTTP client for API calls
import EmotionChart from "../../components/Emotionchart"; // Custom chart component

const AdminDashboard = () => {
  // State to hold feedback entries
  const [feedbacks, setFeedbacks] = useState([]);
  // State to hold emotion statistics (for the chart)
  const [emotionStats, setEmotionStats] = useState([]);

  // Fetch feedback and emotion count when component mounts
  useEffect(() => {
    // Fetch user feedback
    axios
      .get("http://localhost:5000/feedback")
      .then((res) => setFeedbacks(res.data));

    // Fetch combined emotion count data
    axios
      .get("http://localhost:5000/combined-emotion-count")
      .then((res) => setEmotionStats(res.data));
  }, []);

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Section 1: Sentiment Overview Chart */}
      <section className="bg-white p-4 rounded-xl shadow">
        <h1
          className="text-xl font-semibold mb-4"
          style={{ marginLeft: "30%" }} // center heading
        >
          Sentiment Overview
        </h1>
        {/* Bar or Pie chart of emotion stats */}
        <EmotionChart data={emotionStats} />
      </section>

      {/* Section 2: Feedback List */}
      <section
        className="bg-white p-4 rounded-xl shadow"
        style={{ marginLeft: "30%" }}
      >
        <h2 className="text-xl font-semibold mb-4">User Feedback</h2>
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {feedbacks.map((item) => (
            <div key={item.id} className="p-3 border rounded bg-gray-100">
              <div>
                <strong>{item.name}</strong> ({item.email}) {/* user details */}
              </div>
              <div className="text-sm text-gray-600">{item.comment}</div> {/* user comment */}
              <div className="text-sm font-medium text-blue-700">
                Emotion: {item.emotion} {/* predicted emotion */}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
