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
 * - users: [{ _id, name }]
 * - tasks: [{ status, timeToComplete, owners:[{_id, name}] }]
 * - creditMode: 'equal' | 'full'  (default: 'equal')
 * - showZeros: boolean (default: true)
 * - sort: 'none' | 'desc' | 'asc' (default: 'none')
 */
const PendingWorkByOwnerBar = ({
  users = [],
  tasks = [],
  creditMode = "equal",
  showZeros = true,
  sort = "none",
}) => {
  const { labels, values } = useMemo(() => {
    const byOwner = new Map();
    users.forEach((u) => byOwner.set(u._id, 0));

    tasks.forEach((t) => {
      if (!t || t.status === "Completed") return;
      const owners = Array.isArray(t.owners) ? t.owners : [];
      const n = owners.length || 1;
      const days = Number(t.timeToComplete) || 0;

      if (creditMode === "equal") {
        const share = days / n;
        owners.forEach((o) => {
          if (!o?._id) return;
          byOwner.set(o._id, (byOwner.get(o._id) || 0) + share);
        });
      } else {
        // 'full' credit: each owner gets the full days (inflates totals if many shared tasks)
        owners.forEach((o) => {
          if (!o?._id) return;
          byOwner.set(o._id, (byOwner.get(o._id) || 0) + days);
        });
      }
    });

    let rows = users.map((u) => ({
      label: u.name,
      value: byOwner.get(u._id) || 0,
    }));

    if (!showZeros) rows = rows.filter((r) => r.value > 0);

    if (sort === "desc") rows.sort((a, b) => b.value - a.value);
    else if (sort === "asc") rows.sort((a, b) => a.value - b.value);

    return {
      labels: rows.map((r) => r.label),
      values: rows.map((r) => Number(r.value.toFixed(1))), // keep 1 decimal for shared credits
    };
  }, [users, tasks, creditMode, showZeros, sort]);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Pending Days",
          data: values,
          backgroundColor: "#f59e0b", // amber for pending
          borderColor: "#d97706",
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
        title: { display: true, text: "Total Days of Work Pending (by Owner)" },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y} days`,
          },
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { autoSkip: false } },
        y: {
          beginAtZero: true,
          grid: { color: "rgba(0,0,0,0.06)" },
          title: { display: true, text: "Days" },
        },
      },
    }),
    [],
  );

  return (
    <div className="d-flex justify-content-center">
      <div style={{ width: "100%", maxWidth: 760, height: 360 }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default PendingWorkByOwnerBar;
