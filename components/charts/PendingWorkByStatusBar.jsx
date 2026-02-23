import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const PendingWorkByStatusBar = ({ tasks = [] }) => {
  const ORDER = ["To Do", "In Progress", "Blocked"];
  const COLORS = {
    "To Do": "#f59e0b", // amber
    "In Progress": "#3b82f6", // blue
    Blocked: "#ef4444", // red
  };

  const { labels, values, bgColors, totalPending } = useMemo(() => {
    const buckets = { "To Do": 0, "In Progress": 0, Blocked: 0 };

    tasks.forEach((t) => {
      const s = t?.status;
      const days = Number(t?.timeToComplete) || 0;
      if (s && s !== "Completed") {
        if (buckets[s] == null) buckets[s] = 0;
        buckets[s] += days;
      }
    });

    const lbls = ORDER;
    const vals = ORDER.map((s) => buckets[s] || 0);
    const colors = ORDER.map((s) => COLORS[s]);
    const total = vals.reduce((a, b) => a + b, 0);

    return {
      labels: lbls,
      values: vals,
      bgColors: colors,
      totalPending: total,
    };
  }, [tasks]);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Total Days Pending",
          data: values,
          backgroundColor: bgColors,
          borderColor: bgColors.map((c) => c),
          borderWidth: 1,
          barThickness: "flex",
          maxBarThickness: 42,
        },
      ],
    }),
    [labels, values, bgColors],
  );

  const options = useMemo(
    () => ({
      indexAxis: "y", // horizontal bars
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: `Total Days of Work Pending (Overall: ${totalPending})`,
        },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.parsed.x} days`,
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: "rgba(0,0,0,0.06)" },
          title: { display: true, text: "Days" },
        },
        y: { grid: { display: false } },
      },
    }),
    [totalPending],
  );

  return (
    <div className="d-flex justify-content-center">
      <div style={{ width: "100%", maxWidth: 720, height: 320 }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default PendingWorkByStatusBar;
