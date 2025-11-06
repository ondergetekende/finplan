<template>
  <div class="expenses-manager">
    <h3>Expenses</h3>

    <div v-if="expenses.length > 0" class="expenses-list">
      <div class="expense-header">
        <div class="header-name">Name</div>
        <div class="header-amount">Monthly Amount</div>
        <div class="header-date">Start Date</div>
        <div class="header-date">End Date</div>
        <div class="header-action"></div>
      </div>
      <div v-for="expense in expenses" :key="expense.id" class="expense-item">
        <div class="input-wrapper">
          <input
            v-model="expense.name"
            type="text"
            placeholder="e.g., Rent, Food"
            @blur="updateExpense(expense)"
            class="expense-name"
            aria-label="Expense name"
          />
        </div>
        <div class="input-wrapper">
          <input
            v-model.number="expense.monthlyAmount"
            type="number"
            placeholder="0"
            step="10"
            @blur="updateExpense(expense)"
            class="expense-amount"
            aria-label="Monthly amount in euros"
          />
        </div>
        <div class="input-wrapper">
          <input
            v-model="expense.startDate"
            type="date"
            @blur="updateExpense(expense)"
            class="expense-date"
            aria-label="Date when expense starts"
          />
        </div>
        <div class="input-wrapper">
          <input
            v-model="expense.endDate"
            type="date"
            @blur="updateExpense(expense)"
            class="expense-date"
            aria-label="Date when expense ends"
          />
        </div>
        <button @click="removeExpense(expense.id)" class="btn-remove" aria-label="Remove expense">
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
              class="expense-name"
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
              class="expense-amount"
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
              class="expense-date"
            />
          </div>
          <div class="form-field">
            <label for="new-expense-end">End Date:</label>
            <input
              id="new-expense-end"
              v-model="newExpense.endDate"
              type="date"
              class="expense-date"
            />
          </div>
          <button @click="addExpense" class="btn-add">Add Expense</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Expense } from '@/types/models'

const props = defineProps<{
  expenses: Expense[]
}>()

const emit = defineEmits<{
  add: [expense: Omit<Expense, 'id'>]
  update: [id: string, updates: Partial<Expense>]
  remove: [id: string]
}>()

const newExpense = ref({
  name: '',
  monthlyAmount: 0,
  startDate: '',
  endDate: '',
})

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

function updateExpense(expense: Expense) {
  emit('update', expense.id, {
    name: expense.name,
    monthlyAmount: expense.monthlyAmount,
    startDate: expense.startDate,
    endDate: expense.endDate,
  })
}

function removeExpense(id: string) {
  emit('remove', id)
}
</script>

<style scoped>
.expenses-manager {
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

.expenses-list {
  margin-bottom: 2rem;
}

.expense-header {
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

.expense-item {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  align-items: center;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
}

.expense-name {
  flex: 2;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 150px;
  font-size: 1rem;
}

.expense-amount {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 140px;
  font-size: 1rem;
}

.expense-date {
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
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;
  height: 42px;
  align-self: flex-end;
}

.btn-add:hover {
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
