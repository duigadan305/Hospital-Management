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
const AppointmentChart = ({ data }) => {
    const chartData = {
        labels: data.map((item) => item.label),
        datasets: [
            {
                label: "Số lượng lịch hẹn",
                data: data.map((item) => item.count),
                borderColor: "#42a5f5",
                backgroundColor: "rgba(66, 165, 245, 0.3)",
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
                    label: (context) => `${context.raw} lịch hẹn`,
                },
            },
        },
    };

    return <Line data={chartData} options={chartOptions} />;
};
export default AppointmentChart;