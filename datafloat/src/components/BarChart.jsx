// import { useTheme } from "@mui/material";
// import { ResponsiveBar } from "@nivo/bar";
// import { tokens } from "../theme";
// import { mockBarData } from "../data/mockData";
// import { useEffect, useState } from "react";

// const Barchart = ({ isDashboard = false }) => {
//   const theme = useTheme();
//   const [error, setError] = useState("");
//   const [data, setData] = useState([]);
//   const colors = tokens(theme.palette.mode);
//   useEffect(() => {
//     fetch("/records")
//       .then((res) => res.json())
//       .then((data) => {
//         setData(data);
//         console.log("Fetched data:", data);
//       })
//       .catch((err) => {
//         console.error("Error fetching users:", err);
//         setError("Unable to fetch users from server");
//       });
//   }, []);

//   return (
//     <ResponsiveBar
//       data={data}
//       theme={{
//         // added
//         axis: {
//           domain: {
//             line: {
//               stroke: colors.grey[100],
//             },
//           },
//           legend: {
//             text: {
//               fill: colors.grey[100],
//             },
//           },
//           ticks: {
//             line: {
//               stroke: colors.grey[100],
//               strokeWidth: 1,
//             },
//             text: {
//               fill: colors.grey[100],
//             },
//           },
//         },
//         legends: {
//           text: {
//             fill: colors.grey[100],
//           },
//         },
//       }}
//       keys={[
//         "boredom",
//         "anger",
//         "empty",
//         "enthusiasm",
//         "fun",
//         "happiness",
//         "hate",
//         "love",
//         // "neutral",
//         "relief",
//         "sadness",
//         "surprise",
//         "worry",
//       ]}
//       indexBy="emotion"
//       margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
//       padding={0.3}
//       valueScale={{ type: "linear" }}
//       indexScale={{ type: "band", round: true }}
//       colors={{ scheme: "nivo" }}
//       defs={[
//         {
//           id: "dots",
//           type: "patternDots",
//           background: "inherit",
//           color: "#38bcb2",
//           size: 4,
//           padding: 1,
//           stagger: true,
//         },
//         {
//           id: "lines",
//           type: "patternLines",
//           background: "inherit",
//           color: "#eed312",
//           rotation: -45,
//           lineWidth: 6,
//           spacing: 10,
//         },
//       ]}
//       borderColor={{
//         from: "color",
//         modifiers: [["darker", "1.6"]],
//       }}
//       axisBottom={{
//   tickSize: 5,
//   tickPadding: 5,
//   tickRotation: 0,
//   legend: isDashboard ? undefined : "Emotion", // Changed from "country"
//   legendPosition: "middle",
//   legendOffset: 32,
// }}

// axisLeft={{
//   tickSize: 5,
//   tickPadding: 5,
//   tickRotation: 0,
//   legend: isDashboard ? undefined : "Count", // Changed from "food"
//   legendPosition: "middle",
//   legendOffset: -40,
// }}

//       enableLabel={false}
//       labelSkipWidth={12}
//       labelSkipHeight={12}
//       labelTextColor={{
//         from: "color",
//         modifiers: [["darker", 1.6]],
//       }}
//       legends={[
//         {
//           dataFrom: "keys",
//           anchor: "bottom-right",
//           direction: "column",
//           justify: false,
//           translateX: 120,
//           translateY: 0,
//           itemsSpacing: 2,
//           itemWidth: 100,
//           itemHeight: 20,
//           itemDirection: "left-to-right",
//           itemOpacity: 0.85,
//           symbolSize: 20,
//           effects: [
//             {
//               on: "hover",
//               style: {
//                 itemOpacity: 1,
//               },
//             },
//           ],
//         },
//       ]}
//       role="application"
//       barAriaLabel={function (e) {
//         return e.id + ": " + e.formattedValue + " in country: " + e.indexValue;
//       }}
//     />
//   );
// };

// export default Barchart;

// import { Box, Typography, useTheme } from "@mui/material";
// import { tokens } from "../theme";
// import { useEffect, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
//    Cell
// } from "recharts";

// const EMOTIONS = [
//   "boredom", "anger", "empty", "enthusiasm", "fun",
//   "happiness", "hate", "love", "relief", "sadness",
//   "surprise", "worry", "neutral"
// ];

// const COLORS = [
//   "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
//   "#FF9F40", "#8B0000", "#008000", "#FFD700", "#00CED1",
//   "#DC143C", "#1E90FF", "#FF1493"
// ];

// const Barchart = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const [emotionCounts, setEmotionCounts] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("/records")
//       .then((res) => res.json())
//       .then((data) => {
//         const counts = {};
//         data.forEach((record) => {
//           const emotion = String(record.emotion || "").toLowerCase();
//           if (emotion) {
//             counts[emotion] = (counts[emotion] || 0) + 1;
//           }
//         });
//         setEmotionCounts(counts);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching data:", err);
//         setLoading(false);
//       });
//   }, []);

//   const chartData = EMOTIONS.map((emotion, idx) => ({
//     name: emotion,
//     count: emotionCounts[emotion] || 0,
//     fill: COLORS[idx % COLORS.length],
//   }));

//   if (loading) {
//     return <Typography>Loading emotion stats...</Typography>;
//   }

//   return (
//     <Box mt={3} width="100%" height={400}>
//       <Typography variant="h5" color={colors.grey[100]} mb={2}>
//         Emotion Count Bar Chart
//       </Typography>
//       <ResponsiveContainer width="100%" height="100%">
//         <BarChart data={chartData} margin={{ top: 20, right: 30, bottom: 50, left: 10 }}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} height={60} />
//           <YAxis allowDecimals={false} />
//           <Tooltip />
//           <Bar dataKey="count" isAnimationActive fill="#8884d8">
//             {chartData.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={entry.fill} />
//             ))}
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>
//     </Box>
//   );
// };

// export default Barchart;

// import { Box, Typography, useTheme } from "@mui/material";
// import { ResponsiveBar } from "@nivo/bar";
// import { tokens } from "../theme";
// import { useEffect, useState } from "react";
// import { BarChart } from "recharts";

// const EMOTIONS = [
//   "boredom", "anger", "empty", "enthusiasm", "fun",
//   "happiness", "hate", "love", "relief", "sadness",
//   "surprise", "worry", "neutral"
// ];

// // Chart color palette
// const COLORS = [
//   "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
//   "#FF9F40", "#8B0000", "#008000", "#FFD700", "#00CED1",
//   "#DC143C", "#1E90FF", "#FF1493"
// ];

// const Barchart = ({ isDashboard = false }) => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const [emotionCounts, setEmotionCounts] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");


//   useEffect(() => {
//     fetch("/records") // Update with your actual API if needed
//       .then((res) => res.json())
//       .then((data) => {
//         const fieldCounts = {};
  
//         data.forEach((record) => {
//           Object.entries(record).forEach(([key, value]) => {
//             const val = String(value).toLowerCase();
//             const fieldKey = `${key}:${val}`;
//             fieldCounts[fieldKey] = (fieldCounts[fieldKey] || 0) + 1;
//           });
//         });
  
//         setEmotionCounts(fieldCounts); // Now stores counts for all fields
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching data:", err);
//         setLoading(false);
//       });
//   }, []);
  
  
//     const total = Object.values(emotionCounts).reduce((a, b) => a + b, 0);
  
//     if (loading) {
//       return <Typography>Loading emotion stats...</Typography>;
//     }
  

//   return (
  

//       <Box display="flex" flexWrap="wrap" gap="20px" mt={2}>
//         {Object.entries(emotionCounts).map(([fieldKey, count], idx) => {
//           const progress = total > 0 ? count / total : 0;
//           const angle = progress ;
//            return (
//                   <Box key={fieldKey} textAlign="center">
//                    <BarChart/>
//                     <Typography variant="body2" sx={{ mt: 1, color: colors.grey[100] }}>
//                       {fieldKey} 
//                     </Typography>
//                   </Box>
//                 );
//               })}
//             </Box>
//           );
          
//           };
 
// export default Barchart;


import { Box } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";

const data = [
  { emotion: "Anger", modelS: 90 },
  { emotion: "Worry", modelS: 85 },
  { emotion: "Neutral", modelS: 88 },
  { emotion: "Happiness", modelS: 95},
  { emotion: "Love", modelS: 92 },
  { emotion: "Hate", modelS: 70},
  { emotion: "Boredom", modelS: 87},
  { emotion: "Empty", modelS: 87},
  { emotion: "Enthusiasm", modelS: 87},
  { emotion: "Fun", modelS: 87},
  { emotion: "Relief", modelS: 87},
  { emotion: "Sadness", modelS: 87},
  { emotion: "Surprise", modelS: 87},
];

const Barchart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box height="500px "width="500px">
      <ResponsiveBar
        data={data}
        keys={["modelS"]}
        indexBy="emotion"
        margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
        padding={0.3}
        groupMode="grouped"
        colors={[ "#b8f3d5ff"]}
        borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickRotation: -20,
          legend: "Emotions",
          legendPosition: "middle",
          legendOffset: 40,
        }}
        axisLeft={{
          legend: "Accuracy(%)",
          legendPosition: "middle",
          legendOffset: -50,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "top-right",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: -40,
            itemsSpacing: 10,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            symbolSize: 12,
            itemTextColor: colors.grey[100],
          },
        ]}
        tooltip={({ id, value, indexValue }) => (
          <strong>
            {id} - {indexValue}: {value}%
          </strong>
        )}
        theme={{
          axis: {
            ticks: {
              text: { fill: colors.grey[100] },
            },
            legend: {
              text: { fill: colors.grey[100] },
            },
          },
          legends: {
            text: {
              fill: colors.grey[100],
            },
          },
        }}
      />
    </Box>
  );
};

export default Barchart;

// import { Box } from "@mui/material";
// import { ResponsiveBar } from "@nivo/bar";
// import { useTheme } from "@mui/material/styles";
// import { tokens } from "../theme";
// import axios from "axios";
// import { useEffect, useState } from "react";

// const Barchart = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     axios
//       .get("/records") // Update with your actual Flask backend URL
//       .then((response) => {
//         const transformedData = response.data.map((item) => ({
//           emotion: item.Emotion || item.emotion,
//           modelS: item.Count || item.count,
//         }));
//         setData(transformedData);
//       })
//       .catch((error) => {
//         console.error("Error fetching analysis data:", error);
//       });
//   }, []);

//   return (
//     <Box width="100%" height="500px">
//       <ResponsiveBar
//         data={data}
//         keys={["modelS"]}
//         indexBy="emotion"
//         margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
//         padding={0.3}
//         groupMode="grouped"
//         colors={["#b8f3d5ff"]}
//         borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
//         axisTop={null}
//         axisRight={null}
//         axisBottom={{
//           tickRotation: -20,
//           legend: "Emotions",
//           legendPosition: "middle",
//           legendOffset: 40,
//         }}
//         axisLeft={{
//           legend: "Count",
//           legendPosition: "middle",
//           legendOffset: -50,
//         }}
//         labelSkipWidth={12}
//         labelSkipHeight={12}
//         labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
//         legends={[
//           {
//             dataFrom: "keys",
//             anchor: "top-right",
//             direction: "row",
//             justify: false,
//             translateX: 0,
//             translateY: -40,
//             itemsSpacing: 10,
//             itemWidth: 100,
//             itemHeight: 20,
//             itemDirection: "left-to-right",
//             symbolSize: 12,
//             itemTextColor: colors.grey[100],
//           },
//         ]}
//         tooltip={({ id, value, indexValue }) => (
//           <strong>
//             {id} - {indexValue}: {value}
//           </strong>
//         )}
//         theme={{
//           axis: {
//             ticks: {
//               text: { fill: colors.grey[100] },
//             },
//             legend: {
//               text: { fill: colors.grey[100] },
//             },
//           },
//           legends: {
//             text: {
//               fill: colors.grey[100],
//             },
//           },
//         }}
//       />
//     </Box>
//   );
// };

// export default Barchart;

