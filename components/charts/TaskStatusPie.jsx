import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const TaskStatusPie = ({ tasks }) => {
  console.log(tasks);

  // Aggregate counts by status
  const { labels, values, colors } = useMemo(() => {
    const order = ["Completed", "In Progress", "To Do"]; // fixed order
    const counts =
      tasks?.reduce((acc, t) => {
        const key = t.status || "Unknown";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {}) || {};

    return {
      labels: order,
      values: order.map((lbl) => counts[lbl] || 0),
      // Colors: green, blue, amber
      colors: ["#22c55e", "#3b82f6", "#f59e0b"],
    };
  }, [tasks]);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderColor: "#ffffff",
          borderWidth: 2,
        },
      ],
    }),
    [labels, values, colors],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
        title: { display: true, text: "Task Status Distribution" },
        tooltip: {
          callbacks: {
            label: (context) => {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const val = context.parsed;
              const pct = total ? ((val / total) * 100).toFixed(1) : 0;
              return ` ${context.label}: ${val} (${pct}%)`;
            },
          },
        },
      },
    }),
    [],
  );

  return (
    <div className="d-flex justify-content-center">
      <div style={{ maxWidth: 480, width: "100%" }}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default TaskStatusPie;
