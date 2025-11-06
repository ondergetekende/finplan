<template>
  <div class="table-container">
    <h3>Annual Breakdown</h3>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Age</th>
            <th>Starting Balance</th>
            <th>Total Income</th>
            <th>Total Expenses</th>
            <th>Net Change</th>
            <th>Ending Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="summary in annualSummaries"
            :key="summary.year"
            :class="{ negative: summary.endingBalance < 0 }"
          >
            <td>{{ summary.year }}</td>
            <td>{{ summary.age }}</td>
            <td>{{ formatCurrency(summary.startingBalance) }}</td>
            <td class="income">{{ formatCurrency(summary.totalIncome) }}</td>
            <td class="expenses">{{ formatCurrency(summary.totalExpenses) }}</td>
            <td
              :class="{
                'net-positive': netChange(summary) > 0,
                'net-negative': netChange(summary) < 0,
              }"
            >
              {{ formatCurrency(netChange(summary)) }}
            </td>
            <td :class="{ 'balance-negative': summary.endingBalance < 0 }">
              {{ formatCurrency(summary.endingBalance) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AnnualSummary } from '@/types/models'

defineProps<{
  annualSummaries: AnnualSummary[]
}>()

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function netChange(summary: AnnualSummary): number {
  return summary.totalIncome - summary.totalExpenses
}
</script>

<style scoped>
.table-container {
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

.table-wrapper {
  overflow-x: auto;
  max-height: 500px;
  overflow-y: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

thead {
  position: sticky;
  top: 0;
  background-color: #f8f9fa;
  z-index: 1;
}

th {
  padding: 0.75rem;
  text-align: right;
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
  color: #2c3e50;
}

th:first-child,
th:nth-child(2) {
  text-align: left;
}

td {
  padding: 0.75rem;
  text-align: right;
  border-bottom: 1px solid #dee2e6;
}

td:first-child,
td:nth-child(2) {
  text-align: left;
  font-weight: 500;
}

tbody tr:hover {
  background-color: #f8f9fa;
}

tbody tr.negative {
  background-color: #fff5f5;
}

.income {
  color: #22c55e;
  font-weight: 500;
}

.expenses {
  color: #ef4444;
  font-weight: 500;
}

.net-positive {
  color: #22c55e;
  font-weight: 600;
}

.net-negative {
  color: #ef4444;
  font-weight: 600;
}

.balance-negative {
  color: #ef4444;
  font-weight: 600;
}
</style>
