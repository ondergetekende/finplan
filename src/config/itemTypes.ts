import type { LiquidAsset, FixedAsset, CashFlow } from '@/types/models'

export interface ItemTypeDefinition {
  id: string
  category: 'asset' | 'cashflow'
  icon?: string
  color: string
  template: Omit<LiquidAsset, 'id'> | Omit<FixedAsset, 'id'> | Omit<CashFlow, 'id'>
}

// Get the button label from template name
export function getItemTypeButtonLabel(itemType: ItemTypeDefinition): string {
  return (itemType.template as any).name || ''
}

export const ITEM_TYPES: ItemTypeDefinition[] = [
  {
    id: 'liquid',
    category: 'asset',
    color: '#3b82f6', // blue
    template: {
      name: 'Savings',
      amount: 25000, // Typical savings buffer (3-6 months expenses)
      assetType: 'liquid'
    }
  },
  {
    id: 'house',
    category: 'asset',
    color: '#8b5cf6', // purple
    template: {
      name: 'House',
      amount: 350000, // Average home value in Western Europe
      annualInterestRate: 3.5, // Typical property appreciation rate
      assetType: 'fixed'
    }
  },
  {
    id: 'car',
    category: 'asset',
    color: '#8b5cf6', // purple
    template: {
      name: 'Car',
      amount: 35000, // Average car value in Western Europe
      annualInterestRate: -3.5, // Typical car depreciation rate
      assetType: 'fixed'
    }
  },
  {
    id: 'income',
    category: 'cashflow',
    color: '#22c55e', // green
    template: {
      name: 'Income',
      monthlyAmount: 3500, // Median gross salary in Western Europe
      type: 'income'
    }
  },
  {
    id: 'expense',
    category: 'cashflow',
    color: '#ef4444', // red
    template: {
      name: 'Expense',
      monthlyAmount: 2500, // Typical monthly living expenses
      type: 'expense'
    }
  }
]

export function getItemTypeById(id: string): ItemTypeDefinition | undefined {
  return ITEM_TYPES.find(type => type.id === id)
}

export function getAssetTypes(): ItemTypeDefinition[] {
  return ITEM_TYPES.filter(type => type.category === 'asset')
}

export function getCashFlowTypes(): ItemTypeDefinition[] {
  return ITEM_TYPES.filter(type => type.category === 'cashflow')
}
