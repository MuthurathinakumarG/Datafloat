import { ResponsiveBar } from "@nivo/bar";

// Component to display a bar chart of emotions
const EmotionChart = ({ data }) => {
  // Transform the input data to match Nivo's required format
  const chartData = data.map((item) => ({
    emotion: item.emotion,
    count: item.count,
  }));

  return (
    <div style={{ height: 400, width: "1000px" }}>
      <ResponsiveBar
        data={chartData}
        keys={["count"]} // The data key to visualize
        indexBy="emotion" // Field used for x-axis categories
        margin={{ top: 10, right: 10, bottom: 50, left: 60 }}
        padding={0.3} // Space between bars
        layout="vertical" // Vertical bars (emotion on x-axis)
        colors={{ scheme: "pink_yellowGreen" }} // Nivo color scheme
        axisBottom={{
          tickRotation: -45, // Rotate x-axis labels for readability
          legend: "Emotion",
          legendPosition: "middle",
          legendOffset: 40,
        }}
        axisLeft={{
          legend: "Count",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        enableLabel={false} // Disable labels on bars
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </div>
  );
};

export default EmotionChart;
