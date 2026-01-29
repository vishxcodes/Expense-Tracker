import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const MonthBar = ({ current, previous }) => {
  const chartData = {
    labels: ["Previous Month", "Current Month"],
    datasets: [
      {
        label: "Spending",
        data: [previous, current],
      },
    ],
  };

  return (
    <div style={{ width: "350px" }}>
      <h3>Month Comparison</h3>
      <Bar data={chartData} />
    </div>
  );
};

export default MonthBar;
