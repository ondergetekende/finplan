<template>
  <div class="birth-date-input">
    <h3>Your Birth Date</h3>
    <div class="input-group">
      <div class="form-field">
        <label for="birth-date">Date of Birth:</label>
        <input
          id="birth-date"
          type="date"
          :value="modelValue"
          @input="handleInput"
          :max="maxDate"
        />
      </div>
      <div v-if="currentAge !== null" class="age-display">
        <span class="age-label">Current Age:</span>
        <span class="age-value">{{ currentAge }} years old</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string
  currentAge: number | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const maxDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped>
.birth-date-input {
  margin-bottom: 2rem;
}

h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.input-group {
  display: flex;
  gap: 2rem;
  align-items: center;
  flex-wrap: wrap;
}

.form-field {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #2c3e50;
  font-size: 0.9rem;
}

input[type='date'] {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-width: 200px;
}

input[type='date']:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.age-display {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-size: 1rem;
}

.age-label {
  font-weight: 600;
  color: #2c3e50;
}

.age-value {
  color: #42b983;
  font-weight: 700;
}
</style>
