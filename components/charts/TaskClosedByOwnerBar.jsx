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

/**
 * Props:
 * - users: [{ _id, name, ... }]
 * - tasks: [{ status, owners:[{_id, name}] }]
 * - showZeros?: boolean (default: true) => show owners with 0 closed tasks
 * - sort?: 'none' | 'desc' | 'asc' (default: 'none')
 */
const TaskClosedByOwnerBar = ({
  users = [],
  tasks = [],
  showZeros = true,
  sort = "none",
}) => {
  const { labels, values } = useMemo(() => {
    // Count completed tasks per owner
    const countsByOwnerId = new Map();

    // Initialize with zeros to keep all users visible
    users.forEach((u) => countsByOwnerId.set(u._id, 0));

    tasks.forEach((t) => {
      if (t?.status === "Completed" && Array.isArray(t.owners)) {
        // Credit each listed owner for the completion
        t.owners.forEach((o) => {
          if (!o?._id) return;
          countsByOwnerId.set(o._id, (countsByOwnerId.get(o._id) || 0) + 1);
        });

        // --- Alternative rules (uncomment one if you prefer):
        // 1) Single-credit (first owner only)
        // const first = t.owners[0]?._id;
        // if (first) countsByOwnerId.set(first, (countsByOwnerId.get(first) || 0) + 1);

        // 2) Pro-rate credit across owners
        // const n = t.owners.length || 1;
        // t.owners.forEach((o) => {
        //   if (!o?._id) return;
        //   countsByOwnerId.set(o._id, (countsByOwnerId.get(o._id) || 0) + 1 / n);
        // });
      }
    });

    // Build arrays from users list to preserve display order
    let rows = users.map((u) => ({
      label: u.name,
      value: countsByOwnerId.get(u._id) || 0,
      id: u._id,
    }));

    if (!showZeros) rows = rows.filter((r) => r.value > 0);

    if (sort === "desc") rows.sort((a, b) => b.value - a.value);
    else if (sort === "asc") rows.sort((a, b) => a.value - b.value);

    return {
      labels: rows.map((r) => r.label),
      values: rows.map((r) => r.value),
    };
  }, [users, tasks, showZeros, sort]);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Closed Tasks",
          data: values,
          backgroundColor: "#22c55e", // green for "closed"
          borderColor: "#16a34a",
          borderWidth: 1,
          barThickness: "flex",
          maxBarThickness: 48,
        },
      ],
    }),
    [labels, values],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Tasks Closed by Owner",
        },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { autoSkip: false, maxRotation: 30, minRotation: 0 },
        },
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 }, // integer ticks for counts
          grid: { color: "rgba(0,0,0,0.05)" },
          title: { display: true, text: "Closed Tasks" },
        },
      },
    }),
    [],
  );

  return (
    <div className="d-flex justify-content-center">
      <div style={{ width: "100%", maxWidth: 720, height: 360 }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default TaskClosedByOwnerBar;
