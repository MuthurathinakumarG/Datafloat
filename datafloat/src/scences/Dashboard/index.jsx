// MUI components and theming
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

// Custom components
import Header from "../../components/Header";
import ProgressCircle from "../../components/ProgressCircle";
import Barchart from "../../components/BarChart";

import { useEffect, useState } from "react";

const Dashboard = () => {
  // Access MUI theme and color tokens for styling
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State to store emotion counts from API
  const [emotionCounts, setEmotionCounts] = useState({});
  const [loading, setLoading] = useState(true); // for future loading states

  // Fetch data from /records on component mount
  useEffect(() => {
    fetch("/records") // your backend API endpoint
      .then((res) => res.json()) // convert response to JSON
      .then((data) => {
        const fieldCounts = {}; // to count values

        data.forEach((record) => {
          // Loop through each field in the record (e.g., name, emotion)
          Object.entries(record).forEach(([key, value]) => {
            const val = String(value).toLowerCase(); // normalize
            const fieldKey = `${key}:${val}`; // format like emotion:happy
            fieldCounts[fieldKey] = (fieldCounts[fieldKey] || 0) + 1; // count occurrences
          });
        });

        // Save field counts to state
        setEmotionCounts(fieldCounts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err); // handle API errors
        setLoading(false);
      });
  }, []);

  // Calculate total number of counted items
  const total = Object.values(emotionCounts).reduce((sum, count) => sum + count, 0);

  return (
    <Box m="20px">
      {/* Page header */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>

      {/* Dashboard layout grid */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(3, 1fr)" // 3 columns
        gap="20px"
        mt="20px"
      >
        {/* Emotion summary box */}
        <Box
          backgroundColor={colors.primary[400]} // styled background
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p="20px"
        >
          <Typography variant="h5" fontWeight="600">
            EMOTION
          </Typography>

          {/* Centered progress circle and text */}
          <Box mt="25px" display="flex" flexDirection="column" alignItems="center">
            <ProgressCircle size="125" /> {/* progress circle visual */}
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              TOTAL COUNT : {total} {/* total number of records */}
            </Typography>
            <Typography>ALL EMOTIONS</Typography> {/* static label */}
          </Box>
        </Box>

       
      </Box>
    </Box>
  );
};

export default Dashboard;
