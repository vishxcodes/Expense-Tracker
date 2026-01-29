import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryPie = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d._id),
    datasets: [
      {
        data: data.map((d) => d.totalSpent),
      },
    ],
  };

  return (
    <div style={{ width: "350px" }}>
      <h3>Category Breakdown</h3>
      <Pie data={chartData} />
    </div>
  );
};

export default CategoryPie;
