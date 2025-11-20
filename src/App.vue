<template>
  <div id="app">
    <header>
      <h1>MoneyMap</h1>
      <p class="subtitle">Navigate your financial future</p>
    </header>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { usePlannerStore } from './stores/planner'

const store = usePlannerStore()

onMounted(() => {
  // Load saved data on startup
  store.loadFromStorage()
})

// Auto-save when data changes
watch(
  () => [
    store.capitalAccounts,
    store.cashFlows,
    store.birthDate,
    store.liquidAssetsInterestRate,
    store.inflationRate,
  ],
  () => {
    store.saveToStorage()
  },
  { deep: true },
)
</script>

<style lang="scss">
// Import shared styles globally (buttons, forms, layout)
@use '@/styles/buttons';
@use '@/styles/forms';
@use '@/styles/layout';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: $font-family;
  background-color: $bg-body;
  color: $text-secondary;
  line-height: $line-height-base;
}

#app {
  min-height: 100vh;
}

header {
  background-color: $primary;
  color: white;
  padding: $spacing-3xl 0;
  text-align: center;
  box-shadow: $shadow-sm;
}

h1 {
  font-size: $font-4xl;
  margin-bottom: $spacing-sm;
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
}

main {
  padding: $spacing-3xl $spacing-lg;
}

.container {
  max-width: $container-max-width;
  margin: 0 auto;
}

.input-section {
  background-color: $bg-card;
  padding: $spacing-3xl;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
  margin-bottom: $spacing-3xl;
}

.results-section {
  margin-top: $spacing-3xl;
}

.no-results {
  text-align: center;
  padding: $spacing-4xl;
  background-color: $bg-card;
  border-radius: $radius-lg;
  color: $text-light;
}
</style>
