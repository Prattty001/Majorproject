import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import { useGetKpisQuery } from "@/state/api";
import {
  Box,
  Button,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Predictions = () => {
  const { palette } = useTheme();
  const [isPredictions, setIsPredictions] = useState(false);
  const [lstmData, setLstmData] = useState<number[]>([]);
  const { data: kpiData } = useGetKpisQuery();

  useEffect(() => {
    fetch("/lstm_predictions.json")
      .then((res) => res.json())
      .then((data) => setLstmData(data))
      .catch((err) => console.error("Failed to load LSTM predictions:", err));
  }, []);

  const formattedData = useMemo(() => {
    if (!kpiData || lstmData.length === 0) return [];

    const monthData = kpiData[0].monthlyData;
    const actualData = monthData.map(({ month, revenue }) => {
      const date = new Date(`${month}-01`);
      const label = `${date.toLocaleString("default", { month: "short" })} (Present Year)`;
      return {
        name: label,
        "Actual Revenue": revenue,
      };
    });

    const lastDate = new Date(`${monthData[monthData.length - 1].month}-01`);

    const predictedData = lstmData.map((value, i) => {
      const date = new Date(lastDate);
      date.setMonth(lastDate.getMonth() + i + 1);
      const label = `${date.toLocaleString("default", { month: "short" })} (Next Year)`;
      return {
        name: label,
        "Predicted Revenue":  parseFloat((value * 230).toFixed(2)),
      };
    });

    return [...actualData, ...predictedData];
  }, [kpiData, lstmData]);

  return (
    <DashboardBox width="100%" height="100%" p="1rem" overflow="hidden">
      <FlexBetween m="1rem 2.5rem" gap="1rem">
        <Box>
          <Typography variant="h3">Revenue and Predictions</Typography>
          <Typography variant="h6">
            Charted revenue with LSTM-based forecast for the next year
          </Typography>
        </Box>
        <Button
          onClick={() => setIsPredictions((prev) => !prev)}
          sx={{
            color: palette.grey[900],
            backgroundColor: palette.grey[700],
            boxShadow: "0.1rem 0.1rem 0.1rem 0.1rem rgba(0,0,0,.4)",
          }}
        >
          {isPredictions ? "Hide Forecast" : "Show Predicted Revenue"}
        </Button>
      </FlexBetween>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{ top: 20, right: 75, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={palette.grey[800]} />
          <XAxis dataKey="name" tickLine={false} style={{ fontSize: "10px" }}>
            <Label value="Month" offset={-5} position="insideBottom" />
          </XAxis>
          <YAxis
            domain={[12000, "auto"]}
            axisLine={false}
            style={{ fontSize: "10px" }}
            tickFormatter={(v) => `$${v}`}
          >
            <Label
              value="Revenue in USD"
              angle={-90}
              offset={-5}
              position="insideLeft"
            />
          </YAxis>
          <Tooltip />
          <Legend verticalAlign="top" />
          <Line
            type="monotone"
            dataKey="Actual Revenue"
            stroke={palette.primary.main}
            strokeWidth={2}
            dot={true}
          />
          {isPredictions && (
            <Line
              type="monotone"
              dataKey="Predicted Revenue"
              stroke={palette.secondary[500]}
              strokeDasharray="5 5"
              dot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </DashboardBox>
  );
};

export default Predictions;
