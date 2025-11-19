<template>
  <div class="inline-onboarding">
    <div class="onboarding-header">
      <h3>Get started by entering your birth date</h3>
      <p class="onboarding-hint">We'll use this to project your financial future.</p>
    </div>

    <div class="onboarding-form">
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
        <label class="form-label">Tax Country (optional)</label>
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
        <p class="field-hint">Select your tax jurisdiction for accurate tax projections.</p>
      </div>

      <button @click="handleContinue" class="continue-button" :disabled="!canContinue">
        Continue
      </button>
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
  initialBirthDate?: Month
  initialTaxCountry?: string
}>()

const emit = defineEmits<{
  complete: [
    {
      birthDate: Month
      taxCountry?: string
    },
  ]
}>()

const birthDate = ref<Month | undefined>(props.initialBirthDate)
const taxCountry = ref<string | undefined>(props.initialTaxCountry)

const maxMonth = computed(() => getCurrentMonth())

const currentAge = computed(() => {
  return birthDate.value ? getAgeInYears(birthDate.value) : null
})

const availableCountries = computed(() => {
  return Object.values(TAX_CONFIGS).sort((a, b) => a.countryName.localeCompare(b.countryName))
})

const canContinue = computed(() => {
  return birthDate.value !== undefined && birthDate.value !== null
})

function handleBirthDateUpdate(value: Month | undefined) {
  birthDate.value = value
}

function handleContinue() {
  if (canContinue.value && birthDate.value) {
    emit('complete', {
      birthDate: birthDate.value,
      taxCountry: taxCountry.value,
    })
  }
}
</script>

<style scoped>
.inline-onboarding {
  background: transparent;
  border-left: 3px solid #42b983;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.onboarding-header {
  margin-bottom: 1.5rem;
}

.onboarding-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.onboarding-hint {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
}

.onboarding-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

.tax-country-select {
  padding: 0.75rem;
  font-size: 0.95rem;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  background-color: white;
  color: #1f2937;
  cursor: pointer;
  transition: border-color 0.2s;
}

.tax-country-select:hover {
  border-color: #9ca3af;
}

.tax-country-select:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.field-hint {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
}

.continue-button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background-color: #42b983;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  align-self: flex-start;
}

.continue-button:hover:not(:disabled) {
  background-color: #359268;
}

.continue-button:disabled {
  background-color: #cbd5e0;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Tablet and below */
@media (max-width: 768px) {
  .inline-onboarding {
    padding: 1rem;
  }

  .onboarding-header h3 {
    font-size: 1.125rem;
  }

  .onboarding-hint {
    font-size: 0.875rem;
  }

  .onboarding-form {
    gap: 1.25rem;
  }

  .continue-button {
    width: 100%;
  }
}

/* Small mobile */
@media (max-width: 480px) {
  .inline-onboarding {
    padding: 0.75rem;
  }

  .onboarding-header {
    margin-bottom: 1rem;
  }

  .onboarding-header h3 {
    font-size: 1rem;
  }

  .onboarding-hint {
    font-size: 0.8125rem;
  }

  .onboarding-form {
    gap: 1rem;
  }

  .form-label {
    font-size: 0.875rem;
  }

  .tax-country-select {
    padding: 0.625rem;
    font-size: 0.875rem;
  }

  .field-hint {
    font-size: 0.8125rem;
  }

  .age-display {
    font-size: 0.8125rem;
  }

  .continue-button {
    padding: 0.625rem 1.25rem;
    font-size: 0.9375rem;
  }
}
</style>
