<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ITEM_TYPES, getItemTypeButtonLabel, type ItemTypeDefinition } from '@/config/itemTypes'

const router = useRouter()

function handleAddItem(typeId: string, category: ItemTypeDefinition['category']) {
  if (category === 'asset') {
    router.push({ name: 'new-asset', params: { typeId } })
  } else if (category === 'cashflow') {
    router.push({ name: 'new-cashflow', params: { typeId } })
  } else if (category === 'debt') {
    router.push({ name: 'new-debt', params: { typeId } })
  }
}
</script>

<template>
  <div class="action-buttons">
    <button
      v-for="itemType in ITEM_TYPES"
      :key="itemType.id"
      class="action-button"
      :style="{ borderColor: itemType.color, color: itemType.color }"
      @click="handleAddItem(itemType.id, itemType.category)"
    >
      <span class="button-label">+ {{ getItemTypeButtonLabel(itemType) }}</span>
    </button>
  </div>
</template>

<style scoped>
.action-buttons {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 0;
  flex-wrap: wrap;
}

.action-button {
  flex: 1;
  min-width: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  background: white;
  border: 2px solid;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.button-label {
  white-space: nowrap;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .action-buttons {
    gap: 0.5rem;
    padding: 0.75rem 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  .action-button {
    min-width: 0;
    padding: 0.875rem 0.75rem;
    min-height: 44px; /* Touch target */
  }
}

@media (max-width: 480px) {
  .action-buttons {
    gap: 0.5rem;
    padding: 0.5rem 0;
  }

  .action-button {
    padding: 0.875rem 0.625rem;
    font-size: 0.875rem;
  }

  .button-label {
    font-size: 0.8125rem;
  }
}
</style>
