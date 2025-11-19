<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { usePlannerStore } from '@/stores/planner'
  import BasicInfoSummary from '@/components/BasicInfoSummary.vue'
  import BasicInfoWizard from '@/components/BasicInfoWizard.vue'
  import FinancialListItem from '@/components/FinancialListItem.vue'
  import ActionButtons from '@/components/ActionButtons.vue'
  import NetWorthChart from '@/components/NetWorthChart.vue'
  import AnnualBreakdownTable from '@/components/AnnualBreakdownTable.vue'
  import type { Month } from '@/types/month'

  const store = usePlannerStore()

  // Toggle for showing inflation-adjusted values
  const showInflationAdjusted = ref(false)

  // Auto-open wizard on first visit
  onMounted(() => {
    // If user hasn't completed the wizard yet, open it automatically
    if (!store.wizardCompleted) {
      store.openWizard()
    }
  })

  function handleEditBasicInfo() {
    store.openWizard()
  }

  function handleWizardSave(data: {
    birthDate: Month
    taxCountry?: string
    liquidAssetsInterestRate: number
    inflationRate: number
  }) {
    store.saveBasicInfo(data)
  }

  function handleWizardClose() {
    store.closeWizard()
  }
</script>

<template>
  <div class="dashboard">
    <section class="birth-date-section">
      <BasicInfoSummary
        :current-age="store.currentAge"
        :tax-country="store.taxCountry"
        :liquid-assets-interest-rate="store.liquidAssetsInterestRate"
        :inflation-rate="store.inflationRate"
        @edit="handleEditBasicInfo"
      />

      <BasicInfoWizard
        :is-open="store.showWizard"
        :birth-date="store.birthDate"
        :tax-country="store.taxCountry"
        :liquid-assets-interest-rate="store.liquidAssetsInterestRate"
        :inflation-rate="store.inflationRate"
        @close="handleWizardClose"
        @save="handleWizardSave"
      />
    </section>

    <section class="items-section">
      <div class="section-header">
        <h2>Your financial situation</h2>
        <div
          v-if="store.allItems.length > 0"
          class="items-count"
        >
          {{ store.allItems.length }} item{{ store.allItems.length !== 1 ? 's' : '' }}
        </div>
      </div>

      <div
        v-if="store.allItems.length === 0"
        class="empty-state"
      >
        <p>No assets or cash flows yet. Add your first item below!</p>
      </div>

      <div
        v-else
        class="items-list"
      >
        <FinancialListItem
          v-for="item in store.allItems"
          :key="item.id"
          :item="item"
        />
      </div>

      <ActionButtons />
    </section>

    <section
      v-if="store.hasData"
      class="projections-section"
    >
      <div class="projections-header">
        <h2>Financial Projections</h2>
        <div class="inflation-toggle">
          <label class="toggle-label">
            <input
              v-model="showInflationAdjusted"
              type="checkbox"
              class="toggle-checkbox"
            />
            <span>Show in today's purchasing power</span>
          </label>
          <p class="toggle-hint">When enabled, future values are adjusted to show their equivalent value in today's money</p>
        </div>
      </div>

      <div
        v-if="store.projectionResult"
        class="projections-content"
      >
        <div class="chart-container">
          <NetWorthChart
            :annual-summaries="store.projectionResult.annualSummaries"
            :calculation-time="store.projectionResult.calculationTimeMs"
            :show-inflation-adjusted="showInflationAdjusted"
            :inflation-rate="store.inflationRate"
          />
        </div>

        <div class="table-container">
          <AnnualBreakdownTable
            :annual-summaries="store.projectionResult.annualSummaries"
            :show-inflation-adjusted="showInflationAdjusted"
            :inflation-rate="store.inflationRate"
          />
        </div>
      </div>

      <div
        v-else
        class="no-projections"
      >
        <p>Add your birth date, assets, and cash flows to see projections.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
  .dashboard {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }

  .dashboard-header {
    margin-bottom: 2rem;
  }

  .dashboard-header h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
    margin: 0;
  }

  .birth-date-section {
    margin-bottom: 1.5rem;
  }

  .items-section {
    margin-bottom: 2rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .section-header h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }

  .items-count {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
  }

  .empty-state {
    text-align: center;
    padding: 2rem 1rem;
    background: transparent;
    border: none;
    border-left: 3px solid #d1d5db;
    border-radius: 0;
    margin-bottom: 1rem;
  }

  .empty-state p {
    color: #6b7280;
    font-size: 1rem;
    margin: 0;
  }

  .items-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .projections-section {
    margin-top: 2rem;
  }

  .projections-header {
    margin-bottom: 1rem;
  }

  .projections-section h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1rem;
  }

  .inflation-toggle {
    padding: 0.75rem;
    background: transparent;
    border-radius: 0;
    border: none;
    border-left: 3px solid #e5e7eb;
  }

  .toggle-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    font-weight: 500;
    color: #111827;
    font-size: 0.9375rem;
  }

  .toggle-checkbox {
    width: 1.125rem;
    height: 1.125rem;
    cursor: pointer;
    margin: 0;
  }

  .toggle-label span {
    user-select: none;
  }

  .toggle-hint {
    margin: 0.5rem 0 0 2rem;
    font-size: 0.8125rem;
    color: #6b7280;
  }

  .projections-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .chart-container,
  .table-container {
    background: transparent;
    border-radius: 0;
    padding: 0;
  }

  .no-projections {
    text-align: center;
    padding: 1.5rem 1rem;
    background: transparent;
    border-left: 3px solid #d1d5db;
    border-radius: 0;
  }

  .no-projections p {
    color: #6b7280;
    margin: 0;
  }

  /* Tablet and below */
  @media (max-width: 768px) {
    .dashboard {
      padding: 0.75rem;
      margin: 0;
    }

    .dashboard-header h1 {
      font-size: 1.5rem;
    }

    .section-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .section-header h2 {
      font-size: 1.25rem;
    }

    .items-list {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 0.5rem;
    }

    .projections-section h2 {
      font-size: 1.25rem;
    }

    .chart-container,
    .table-container {
      padding: 0;
    }
  }

  /* Small mobile */
  @media (max-width: 480px) {
    .dashboard {
      padding: 0.75rem;
    }

    .dashboard-header {
      margin-bottom: 1.5rem;
    }

    .dashboard-header h1 {
      font-size: 1.375rem;
    }

    .section-header h2 {
      font-size: 1.125rem;
    }

    .items-list {
      grid-template-columns: 1fr;
    }

    .projections-section h2 {
      font-size: 1.125rem;
    }

    .empty-state {
      padding: 1.5rem 0.75rem;
    }

    .empty-state p {
      font-size: 0.9375rem;
    }

    .no-projections {
      padding: 1.5rem 0.75rem;
    }
  }
</style>
