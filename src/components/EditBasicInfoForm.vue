<template>
  <div class="edit-basic-info">
    <div class="form-header">
      <h3>Edit Basic Information</h3>
    </div>

    <div class="edit-form">
      <div class="form-section">
        <h4 class="section-title">Personal Information</h4>

        <div class="form-field">
          <MonthEdit
            :modelValue="birthDate"
            @update:modelValue="handleBirthDateUpdate"
            label="Birth Month and Year"
            :maxMonth="maxMonth"
            :nullable="false"
          />
          <div v-if="currentAge !== null" class="age-display">
            Current age: {{ currentAge }} years old
          </div>
        </div>

        <div class="form-field">
          <label class="form-label">Tax Country</label>
          <select v-model="taxCountry" class="tax-country-select">
            <option :value="undefined">No country - skip tax calculations</option>
            <option
              v-for="country in availableCountries"
              :key="country.countryCode"
              :value="country.countryCode"
            >
              {{ country.countryName }}
            </option>
          </select>
        </div>
      </div>

      <div class="form-section">
        <h4 class="section-title">Financial Assumptions</h4>

        <div class="form-field">
          <label class="form-label">Expected Returns on Liquid Assets (%)</label>
          <input
            v-model.number="liquidAssetsInterestRate"
            type="number"
            step="0.1"
            min="0"
            max="100"
            class="number-input"
          />
          <p class="field-hint">Annual return rate for cash and investments (e.g., 7.0)</p>
        </div>

        <div class="form-field">
          <label class="form-label">Expected Inflation Rate (%)</label>
          <input
            v-model.number="inflationRate"
            type="number"
            step="0.1"
            min="0"
            max="20"
            class="number-input"
          />
          <p class="field-hint">Annual inflation rate (e.g., 2.5)</p>
        </div>
      </div>

      <div class="form-actions">
        <button @click="handleCancel" class="action-button secondary">Cancel</button>
        <button @click="handleSave" class="action-button primary" :disabled="!canSave">
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MonthEdit from './MonthEdit.vue'
import type { Month } from '@/types/month'
import { getCurrentMonth, getAgeInYears } from '@/types/month'
import { TAX_CONFIGS } from '@/config/taxConfig'

const props = defineProps<{
  birthDate: Month
  taxCountry?: string
  liquidAssetsInterestRate: number
  inflationRate: number
}>()

const emit = defineEmits<{
  save: [
    {
      birthDate: Month
      taxCountry?: string
      liquidAssetsInterestRate: number
      inflationRate: number
    },
  ]
  cancel: []
}>()

const birthDate = ref<Month | undefined>(props.birthDate)
const taxCountry = ref<string | undefined>(props.taxCountry)
const liquidAssetsInterestRate = ref<number>(props.liquidAssetsInterestRate)
const inflationRate = ref<number>(props.inflationRate)

const maxMonth = computed(() => getCurrentMonth())

const currentAge = computed(() => {
  return birthDate.value ? getAgeInYears(birthDate.value) : null
})

const availableCountries = computed(() => {
  return Object.values(TAX_CONFIGS).sort((a, b) => a.countryName.localeCompare(b.countryName))
})

const canSave = computed(() => {
  return (
    birthDate.value !== undefined &&
    birthDate.value !== null &&
    liquidAssetsInterestRate.value >= 0 &&
    liquidAssetsInterestRate.value <= 100 &&
    inflationRate.value >= 0 &&
    inflationRate.value <= 20
  )
})

function handleBirthDateUpdate(value: Month | undefined) {
  birthDate.value = value
}

function handleSave() {
  if (canSave.value && birthDate.value) {
    emit('save', {
      birthDate: birthDate.value,
      taxCountry: taxCountry.value,
      liquidAssetsInterestRate: liquidAssetsInterestRate.value,
      inflationRate: inflationRate.value,
    })
  }
}

function handleCancel() {
  emit('cancel')
}
</script>

<style scoped>
.edit-basic-info {
  background: transparent;
  border-left: 3px solid #42b983;
  padding: 1.5rem;
}

.form-header {
  margin-bottom: 1.5rem;
}

.form-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #374151;
}

.age-display {
  font-size: 0.9rem;
  color: #42b983;
  font-weight: 600;
  padding: 0.5rem 0;
}

.tax-country-select,
.number-input {
  padding: 0.75rem;
  font-size: 0.95rem;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  background-color: white;
  color: #1f2937;
  transition: border-color 0.2s;
}

.tax-country-select {
  cursor: pointer;
}

.tax-country-select:hover,
.number-input:hover {
  border-color: #9ca3af;
}

.tax-country-select:focus,
.number-input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.field-hint {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.action-button {
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button.primary {
  color: white;
  background-color: #42b983;
}

.action-button.primary:hover:not(:disabled) {
  background-color: #359268;
}

.action-button.primary:disabled {
  background-color: #cbd5e0;
  cursor: not-allowed;
  opacity: 0.6;
}

.action-button.secondary {
  color: #374151;
  background-color: #e5e7eb;
}

.action-button.secondary:hover {
  background-color: #d1d5db;
}

/* Tablet and below */
@media (max-width: 768px) {
  .edit-basic-info {
    padding: 1rem;
  }

  .form-header h3 {
    font-size: 1.125rem;
  }

  .edit-form {
    gap: 1.5rem;
  }

  .form-section {
    gap: 1.25rem;
  }

  .section-title {
    font-size: 0.9375rem;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .action-button {
    width: 100%;
  }
}

/* Small mobile */
@media (max-width: 480px) {
  .edit-basic-info {
    padding: 0.75rem;
  }

  .form-header h3 {
    font-size: 1rem;
  }

  .edit-form {
    gap: 1.25rem;
  }

  .form-section {
    gap: 1rem;
  }

  .section-title {
    font-size: 0.875rem;
  }

  .form-label {
    font-size: 0.875rem;
  }

  .tax-country-select,
  .number-input {
    padding: 0.625rem;
    font-size: 0.875rem;
  }

  .field-hint {
    font-size: 0.8125rem;
  }

  .age-display {
    font-size: 0.8125rem;
  }

  .action-button {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
  }
}
</style>
