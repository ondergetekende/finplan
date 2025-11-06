<template>
  <div class="chart-container">
    <h3>Net Worth Projection</h3>
    <div v-if="calculationTime !== null && calculationTime !== undefined" class="calculation-time">
      Calculation time: {{ calculationTime?.toFixed(2) }}ms
    </div>
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js'
import type { AnnualSummary } from '@/types/models'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const props = defineProps<{
  annualSummaries: AnnualSummary[]
  calculationTime?: number | null
}>()

const chartData = computed(() => {
  const labels = props.annualSummaries.map((summary) => `${summary.year} (age ${summary.age})`)
  const data = props.annualSummaries.map((summary) => summary.endingBalance)

  return {
    labels,
    datasets: [
      {
        label: 'Net Worth',
        data,
        borderColor: '#42b983',
        backgroundColor: 'rgba(66, 185, 131, 0.1)',
        tension: 0.1,
        fill: true,
      },
    ],
  }
})

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
    title: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const value = context.parsed.y ?? 0
          return `Net Worth: ${formatCurrency(value)}`
        },
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Year (Age)',
      },
    },
    y: {
      title: {
        display: true,
        text: 'Net Worth',
      },
      ticks: {
        callback: function (value) {
          return formatCurrency(Number(value))
        },
      },
    },
  },
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}
</script>

<style scoped>
.chart-container {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.calculation-time {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
}
</style>
