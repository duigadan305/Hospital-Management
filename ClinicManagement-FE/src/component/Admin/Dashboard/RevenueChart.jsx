import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    Tooltip,
    CategoryScale,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale);

const RevenueChart = ({ data }) => {
    const chartData = {
        labels: data.map((item) => item.label),
        datasets: [
            {
                label: "Doanh thu",
                data: data.map((item) => item.revenue),
                borderColor: "#4caf50",
                backgroundColor: "rgba(76, 175, 80, 0.3)",
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.raw.toLocaleString()} VND`,
                },
            },
        },
    };

    return <Line data={chartData} options={chartOptions} />;
};

export default RevenueChart;
