<template>
  <div class="basic-info-summary">
    <div class="summary-header">
      <h3>Basic Information</h3>
      <button @click="$emit('edit')" class="edit-button">Edit</button>
    </div>
    <div class="summary-content">
      <div class="summary-item">
        <span class="summary-label">Age:</span>
        <span class="summary-value">{{ currentAge !== null ? `${currentAge} years old` : 'Not set' }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Tax Country:</span>
        <span class="summary-value">{{ taxCountryDisplay }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Expected Returns:</span>
        <span class="summary-value">{{ liquidAssetsInterestRate.toFixed(1) }}%</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Inflation:</span>
        <span class="summary-value">{{ inflationRate.toFixed(1) }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TAX_CONFIGS } from '@/config/taxConfig'

const props = defineProps<{
  currentAge: number | null
  taxCountry?: string
  liquidAssetsInterestRate: number
  inflationRate: number
}>()

defineEmits<{
  edit: []
}>()

const taxCountryDisplay = computed(() => {
  if (!props.taxCountry) {
    return 'None (no taxes)'
  }
  const config = TAX_CONFIGS[props.taxCountry]
  return config ? config.countryName : props.taxCountry
})
</script>

<style scoped>
.basic-info-summary {
  margin-bottom: 2rem;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1.25rem;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.edit-button {
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: 600;
}

.edit-button:hover {
  background-color: #359268;
}

.edit-button:active {
  background-color: #2d7a57;
}

.summary-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.summary-label {
  font-size: 0.85rem;
  color: #6c757d;
  font-weight: 600;
}

.summary-value {
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 700;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .basic-info-summary {
    padding: 1rem;
  }

  h3 {
    font-size: 1.1rem;
  }

  .edit-button {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }

  .summary-content {
    grid-template-columns: 1fr 1fr;
    gap: 0.6rem;
  }

  .summary-label {
    font-size: 0.8rem;
  }

  .summary-value {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .basic-info-summary {
    padding: 0.8rem;
  }

  h3 {
    font-size: 1rem;
  }

  .edit-button {
    padding: 0.35rem 0.7rem;
    font-size: 0.8rem;
  }

  .summary-content {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .summary-label {
    font-size: 0.75rem;
  }

  .summary-value {
    font-size: 0.85rem;
  }
}
</style>
