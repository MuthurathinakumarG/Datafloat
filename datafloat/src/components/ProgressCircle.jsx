import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme"; // Theme-based colors
import { useEffect, useState } from "react";

// Colors to differentiate chart segments
const COLORS = [
  "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
  "#FF9F40", "#8B0000", "#008000", "#FFD700", "#00CED1",
  "#DC143C", "#1E90FF", "#FF1493"
];

const ProgressCircles = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [emotionCounts, setEmotionCounts] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch emotion-related records
  useEffect(() => {
    fetch("/records") // Update if your endpoint differs
      .then((res) => res.json())
      .then((data) => {
        const fieldCounts = {};

        // Count occurrences of all field-value combinations
        data.forEach((record) => {
          Object.entries(record).forEach(([key, value]) => {
            const val = String(value).toLowerCase();
            const fieldKey = `${key}:${val}`;
            fieldCounts[fieldKey] = (fieldCounts[fieldKey] || 0) + 1;
          });
        });

        setEmotionCounts(fieldCounts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  // Total count of all field-value pairs
  const total = Object.values(emotionCounts).reduce((a, b) => a + b, 0);

  if (loading) {
    return <Typography>Loading emotion stats...</Typography>;
  }

  return (
    <Box display="flex" flexWrap="wrap" gap="20px" mt={2} width={"1000px"}>
      {Object.entries(emotionCounts).map(([fieldKey, count], idx) => {
        const progress = total > 0 ? count / total : 0;
        const angle =  360;

        return (
          <Box key={fieldKey} textAlign="center">
            <Box
              sx={{
                background: `radial-gradient(${colors.primary[400]} 55%, transparent 56%),
                  conic-gradient(${COLORS[idx % COLORS.length]} ${angle}deg, #e0e0e0 ${angle}deg 360deg),
                  ${colors.primary[500]}`,
                borderRadius: "50%",
                width: "80px",
                height: "80px",
                margin: "0 auto",
              }}
            />
            <Typography variant="body2" sx={{ mt: 1, color: colors.grey[100] }}>
              {fieldKey}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default ProgressCircles;
