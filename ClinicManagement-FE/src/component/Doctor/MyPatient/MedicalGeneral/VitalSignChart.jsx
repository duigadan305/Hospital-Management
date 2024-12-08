import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Đăng ký các thành phần cần thiết
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const VitalSignChart = ({ treatDetailData }) => {
  const vitalSigns = treatDetailData.map(detail => ({
    time: detail.appointment.appointmentTime,
    pulse: detail.vitalSign.pulse,
    bloodPressure: detail.vitalSign.bloodPressure,
    temperature: detail.vitalSign.temperature,
    oxygen: detail.vitalSign.oxygen,
    respiratoryRate: detail.vitalSign.respiratoryRate,
    weight: detail.vitalSign.weight,
    height: detail.vitalSign.height,
  }));

  const chartData = {
    labels: vitalSigns.map(vs => vs.time),
    datasets: [
      {
        label: 'Nhịp tim (Pulse)',
        data: vitalSigns.map(vs => vs.pulse),
        borderColor: '#ff6384',
        fill: false,
      },
      {
        label: 'Huyết áp (Blood Pressure)',
        data: vitalSigns.map(vs => parseInt(vs.bloodPressure.split('/')[0])),
        borderColor: '#36a2eb',
        fill: false,
      },
      {
        label: 'Chỉ số Oxy (Oxygen level)',
        data: vitalSigns.map(vs => parseInt(vs.oxygen)),
        borderColor: '#4bc0c0',
        fill: false,
      },
      {
        label: 'Cân nặng (Weight)',
        data: vitalSigns.map(vs => parseInt(vs.weight)),
        borderColor: '#ff9f40',
        fill: false,
      },
      {
        label: 'Nhiệt độ cơ thể (Temperature)',
        data: vitalSigns.map(vs => parseInt(vs.temperature)),
        borderColor: '#9966ff',
        fill: false,
      },
      {
        label: 'Nhịp thở (Respiratory rate) ',
        data: vitalSigns.map(vs => parseInt(vs.respiratoryRate)),
        borderColor: '#ffcd56',
        fill: false,
      },
    ],
  };

  return <Line key={JSON.stringify(chartData)} data={chartData} />;
};

export default VitalSignChart;
