import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Customized,
} from "recharts";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const handleScore = (data, key) => {
  const values = data.map((item) => item[key]);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const stdDev = Math.sqrt(
    values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      values.length
  );

  return data.map((item) => ({
    ...item,
    [`${key}_z`]: (item[key] - mean) / stdDev,
  }));
};

const CustomDot = ({ cx, cy, payload }) => {
  const isOutlier = Math.abs(payload.uv_z) > 1;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={6}
      fill={isOutlier ? "#ff0000" : "#82ca9d"}
      stroke={isOutlier ? "#ff0000" : "#82ca9d"}
    />
  );
};

const CustomLine = ({ height, width, ...props }) => {
  const { data } = props;
  const points = data.map((entry, index) => {
    const x = props.xAxisMap[0].scale(entry.name);
    const y = props.yAxisMap[0].scale(entry.uv);
    return {
      x,
      y,
      payload: entry,
    };
  });

  const segments = [];

  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const isOutlier =
      Math.abs(a.payload.uv_z) > 1 || Math.abs(b.payload.uv_z) > 1;

    segments.push(
      <line
        key={i}
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        stroke={isOutlier ? "#ff0000" : "#82ca9d"}
        strokeWidth={2}
      />
    );
  }

  return <g>{segments}</g>;
};

export default function Chart() {
  const zData = handleScore(data, "uv");

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={zData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          formatter={(value, name, props) =>
            name === "uv"
              ? `${value} (z: ${props.payload.uv_z.toFixed(2)})`
              : value
          }
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="pv"
          stroke="#8884d8"
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="uv"
          stroke="transparent"
          dot={<CustomDot />}
          isAnimationActive={false}
        />
        <Customized component={CustomLine} />
      </LineChart>
    </ResponsiveContainer>
  );
}
//:)
