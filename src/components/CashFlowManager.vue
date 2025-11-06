<template>
  <div class="cashflow-manager">
    <div class="income-section">
      <h3>Income</h3>

      <div v-if="incomeItems.length > 0" class="cashflow-list">
        <div class="cashflow-header">
          <div class="header-name">Name</div>
          <div class="header-amount">Monthly Amount</div>
          <div class="header-date">Start Date</div>
          <div class="header-date">End Date</div>
          <div class="header-action"></div>
        </div>
        <div v-for="item in incomeItems" :key="item.id" class="cashflow-item income-item">
          <div class="input-wrapper">
            <input
              v-model="item.name"
              type="text"
              placeholder="e.g., Salary, Freelance"
              @blur="updateCashFlow(item)"
              class="cashflow-name"
              aria-label="Income name"
            />
          </div>
          <div class="input-wrapper">
            <input
              v-model.number="item.monthlyAmount"
              type="number"
              placeholder="0"
              step="10"
              @blur="updateCashFlow(item)"
              class="cashflow-amount"
              aria-label="Monthly amount in euros"
            />
          </div>
          <div class="input-wrapper">
            <input
              v-model="item.startDate"
              type="date"
              @blur="updateCashFlow(item)"
              class="cashflow-date"
              aria-label="Date when income starts"
            />
          </div>
          <div class="input-wrapper">
            <input
              v-model="item.endDate"
              type="date"
              @blur="updateCashFlow(item)"
              class="cashflow-date"
              aria-label="Date when income ends"
            />
          </div>
          <button @click="removeCashFlow(item.id)" class="btn-remove" aria-label="Remove income">
            Remove
          </button>
        </div>
      </div>

      <div class="add-form-section">
        <h4>Add New Income</h4>
        <div class="add-form">
          <div class="form-row">
            <div class="form-field">
              <label for="new-income-name">Name:</label>
              <input
                id="new-income-name"
                v-model="newIncome.name"
                type="text"
                placeholder="e.g., Salary, Freelance, Pension"
                class="cashflow-name"
              />
            </div>
            <div class="form-field">
              <label for="new-income-amount">Monthly Amount (€):</label>
              <input
                id="new-income-amount"
                v-model.number="newIncome.monthlyAmount"
                type="number"
                placeholder="0"
                step="10"
                class="cashflow-amount"
              />
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <label for="new-income-start">Start Date:</label>
              <input
                id="new-income-start"
                v-model="newIncome.startDate"
                type="date"
                class="cashflow-date"
              />
            </div>
            <div class="form-field">
              <label for="new-income-end">End Date:</label>
              <input
                id="new-income-end"
                v-model="newIncome.endDate"
                type="date"
                class="cashflow-date"
              />
            </div>
            <button @click="addIncome" class="btn-add btn-income">Add Income</button>
          </div>
        </div>
      </div>
    </div>

    <div class="expense-section">
      <h3>Expenses</h3>

      <div v-if="expenseItems.length > 0" class="cashflow-list">
        <div class="cashflow-header">
          <div class="header-name">Name</div>
          <div class="header-amount">Monthly Amount</div>
          <div class="header-date">Start Date</div>
          <div class="header-date">End Date</div>
          <div class="header-action"></div>
        </div>
        <div v-for="item in expenseItems" :key="item.id" class="cashflow-item expense-item">
          <div class="input-wrapper">
            <input
              v-model="item.name"
              type="text"
              placeholder="e.g., Rent, Food"
              @blur="updateCashFlow(item)"
              class="cashflow-name"
              aria-label="Expense name"
            />
          </div>
          <div class="input-wrapper">
            <input
              v-model.number="item.monthlyAmount"
              type="number"
              placeholder="0"
              step="10"
              @blur="updateCashFlow(item)"
              class="cashflow-amount"
              aria-label="Monthly amount in euros"
            />
          </div>
          <div class="input-wrapper">
            <input
              v-model="item.startDate"
              type="date"
              @blur="updateCashFlow(item)"
              class="cashflow-date"
              aria-label="Date when expense starts"
            />
          </div>
          <div class="input-wrapper">
            <input
              v-model="item.endDate"
              type="date"
              @blur="updateCashFlow(item)"
              class="cashflow-date"
              aria-label="Date when expense ends"
            />
          </div>
          <button @click="removeCashFlow(item.id)" class="btn-remove" aria-label="Remove expense">
            Remove
          </button>
        </div>
      </div>

      <div class="add-form-section">
        <h4>Add New Expense</h4>
        <div class="add-form">
          <div class="form-row">
            <div class="form-field">
              <label for="new-expense-name">Name:</label>
              <input
                id="new-expense-name"
                v-model="newExpense.name"
                type="text"
                placeholder="e.g., Rent, Food, Car payment"
                class="cashflow-name"
              />
            </div>
            <div class="form-field">
              <label for="new-expense-amount">Monthly Amount (€):</label>
              <input
                id="new-expense-amount"
                v-model.number="newExpense.monthlyAmount"
                type="number"
                placeholder="0"
                step="10"
                class="cashflow-amount"
              />
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <label for="new-expense-start">Start Date:</label>
              <input
                id="new-expense-start"
                v-model="newExpense.startDate"
                type="date"
                class="cashflow-date"
              />
            </div>
            <div class="form-field">
              <label for="new-expense-end">End Date:</label>
              <input
                id="new-expense-end"
                v-model="newExpense.endDate"
                type="date"
                class="cashflow-date"
              />
            </div>
            <button @click="addExpense" class="btn-add btn-expense">Add Expense</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CashFlow } from '@/types/models'

const props = defineProps<{
  cashFlows: CashFlow[]
}>()

const emit = defineEmits<{
  add: [cashFlow: Omit<CashFlow, 'id'>]
  update: [id: string, updates: Partial<CashFlow>]
  remove: [id: string]
}>()

const incomeItems = computed(() => props.cashFlows.filter((cf) => cf.type === 'income'))
const expenseItems = computed(() => props.cashFlows.filter((cf) => cf.type === 'expense'))

const newIncome = ref({
  name: '',
  monthlyAmount: 0,
  startDate: '',
  endDate: '',
})

const newExpense = ref({
  name: '',
  monthlyAmount: 0,
  startDate: '',
  endDate: '',
})

function addIncome() {
  // Validate that if both dates are provided, end date is after start date
  const datesValid =
    !newIncome.value.startDate ||
    !newIncome.value.endDate ||
    newIncome.value.endDate > newIncome.value.startDate

  if (newIncome.value.name.trim() && newIncome.value.monthlyAmount > 0 && datesValid) {
    emit('add', {
      name: newIncome.value.name.trim(),
      monthlyAmount: newIncome.value.monthlyAmount,
      startDate: newIncome.value.startDate || undefined,
      endDate: newIncome.value.endDate || undefined,
      type: 'income',
    })
    newIncome.value = {
      name: '',
      monthlyAmount: 0,
      startDate: '',
      endDate: '',
    }
  }
}

function addExpense() {
  // Validate that if both dates are provided, end date is after start date
  const datesValid =
    !newExpense.value.startDate ||
    !newExpense.value.endDate ||
    newExpense.value.endDate > newExpense.value.startDate

  if (newExpense.value.name.trim() && newExpense.value.monthlyAmount > 0 && datesValid) {
    emit('add', {
      name: newExpense.value.name.trim(),
      monthlyAmount: newExpense.value.monthlyAmount,
      startDate: newExpense.value.startDate || undefined,
      endDate: newExpense.value.endDate || undefined,
      type: 'expense',
    })
    newExpense.value = {
      name: '',
      monthlyAmount: 0,
      startDate: '',
      endDate: '',
    }
  }
}

function updateCashFlow(cashFlow: CashFlow) {
  emit('update', cashFlow.id, {
    name: cashFlow.name,
    monthlyAmount: cashFlow.monthlyAmount,
    startDate: cashFlow.startDate,
    endDate: cashFlow.endDate,
    type: cashFlow.type,
  })
}

function removeCashFlow(id: string) {
  emit('remove', id)
}
</script>

<style scoped>
.cashflow-manager {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.income-section,
.expense-section {
  margin-bottom: 2rem;
}

h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

h4 {
  margin-bottom: 0.75rem;
  color: #2c3e50;
  font-size: 1rem;
  font-weight: 600;
}

.cashflow-list {
  margin-bottom: 2rem;
}

.cashflow-header {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.9rem;
  color: #2c3e50;
}

.header-name {
  flex: 2;
  min-width: 150px;
}

.header-amount {
  flex: 1;
  min-width: 140px;
}

.header-date {
  width: 140px;
}

.header-action {
  width: 90px;
}

.cashflow-item {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  align-items: center;
  padding: 0.5rem;
  border-radius: 4px;
}

.income-item {
  background-color: #f0fdf4;
  border-left: 4px solid #22c55e;
}

.expense-item {
  background-color: #fef2f2;
  border-left: 4px solid #ef4444;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
}

.cashflow-name {
  flex: 2;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 150px;
  font-size: 1rem;
}

.cashflow-amount {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 140px;
  font-size: 1rem;
}

.cashflow-date {
  width: 140px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.add-form-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e9ecef;
}

.add-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.form-field {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.form-field label {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #2c3e50;
  font-size: 0.9rem;
}

.form-field input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.btn-add {
  padding: 0.5rem 1.5rem;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;
  height: 42px;
  align-self: flex-end;
}

.btn-income {
  background-color: #22c55e;
}

.btn-income:hover {
  background-color: #16a34a;
}

.btn-expense {
  background-color: #42b983;
}

.btn-expense:hover {
  background-color: #359268;
}

.btn-add:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-remove {
  padding: 0.5rem 1rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  height: 42px;
}

.btn-remove:hover {
  background-color: #c0392b;
}

input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

input::placeholder {
  color: #999;
  font-style: italic;
}
</style>
