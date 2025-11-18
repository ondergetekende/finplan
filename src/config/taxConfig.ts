/**
 * Tax Configuration System
 *
 * Defines tax structures for income tax, wealth tax, and capital gains tax
 * across multiple countries. Supports both flat rates and progressive bracket systems.
 */

/**
 * Represents a single tax bracket in a progressive tax system
 */
export interface TaxBracket {
  /** Amount (in currency) where this bracket starts */
  threshold: number
  /** Tax rate as a percentage (e.g., 25 for 25%) */
  rate: number
}

/**
 * Tax type enum
 */
export type TaxType = 'income' | 'wealth' | 'capital_gains'

/**
 * Represents a single tax option within a country's tax system
 */
export interface TaxOption {
  /** Unique identifier (e.g., 'nl-box1', 'us-federal-single') */
  id: string

  /** Display name for UI */
  name: string

  /** Type of tax */
  type: TaxType

  /** Whether this is the default tax option for this type in this country */
  isDefault: boolean

  /** Flat tax rate (percentage). Use this OR brackets, not both. */
  rate?: number

  /** Progressive tax brackets. Use this OR rate, not both. */
  brackets?: TaxBracket[]

  /** Exemption threshold - no tax below this amount */
  exemptionThreshold?: number

  /** Additional notes or context */
  notes?: string
}

/**
 * Complete tax configuration for a country
 */
export interface CountryTaxConfig {
  /** ISO country code (e.g., 'NL', 'US', 'GB') */
  countryCode: string

  /** Display name for the country */
  countryName: string

  /** Income tax options */
  incomeTaxes: TaxOption[]

  /** Wealth tax options (empty array if country has no wealth tax) */
  wealthTaxes: TaxOption[]

  /** Capital gains tax options */
  capitalGainsTaxes: TaxOption[]

  /** Data sources or references */
  sources?: string[]
}

// =============================================================================
// COUNTRY CONFIGURATIONS
// =============================================================================

/**
 * Netherlands Tax System (2024)
 *
 * The Dutch tax system uses a "box" system where different types of income
 * are taxed separately.
 *
 * Income Tax:
 * https://en.wikipedia.org/wiki/Income_tax_in_the_Netherlands
 *
 * Box 3 (Wealth Tax):
 * https://en.wikipedia.org/wiki/Taxation_in_the_Netherlands#Box_3
 *
 * Capital Gains:
 * The Netherlands does not have a separate capital gains tax for individuals.
 * Investment income is covered by the Box 3 wealth tax system, which uses
 * a deemed return method.
 */
export const NL_TAX_CONFIG: CountryTaxConfig = {
  countryCode: 'NL',
  countryName: 'Netherlands',

  incomeTaxes: [
    {
      id: 'nl-box1',
      name: 'Box 1 - Employment & Business Income',
      type: 'income',
      isDefault: true,
      brackets: [
        { threshold: 0, rate: 36.93 },
        { threshold: 73031, rate: 49.5 }
      ],
      notes: '2024 rates for income from employment, business, and home ownership'
    },
    {
      id: 'nl-box2',
      name: 'Box 2 - Substantial Interest',
      type: 'income',
      isDefault: false,
      rate: 26.9,
      notes: 'For income from substantial shareholdings (5% or more)'
    }
  ],

  wealthTaxes: [
    {
      id: 'nl-box3-wealth',
      name: 'Box 3 - Savings & Investments Tax',
      type: 'wealth',
      isDefault: true,
      exemptionThreshold: 57000,
      rate: 36,
      notes: 'Tax on deemed return from savings and investments. Exemption is per person (€57,000 in 2024). The deemed return is approximately 6%, taxed at 36%.'
    }
  ],

  capitalGainsTaxes: [
    {
      id: 'nl-no-cgt',
      name: 'No Separate Capital Gains Tax',
      type: 'capital_gains',
      isDefault: true,
      rate: 0,
      notes: 'Capital gains are covered by Box 3 wealth tax'
    }
  ]
}

/**
 * United States Federal Tax System (2024)
 *
 * These are federal tax rates only. State and local taxes are not included.
 * Rates shown are for single filers.
 *
 * Income Tax:
 * https://en.wikipedia.org/wiki/Income_tax_in_the_United_States
 *
 * Capital Gains Tax:
 * https://en.wikipedia.org/wiki/Capital_gains_tax_in_the_United_States
 *
 * Wealth Tax:
 * The United States does not have a federal wealth tax.
 * https://en.wikipedia.org/wiki/Wealth_tax#United_States
 */
export const US_TAX_CONFIG: CountryTaxConfig = {
  countryCode: 'US',
  countryName: 'United States',

  incomeTaxes: [
    {
      id: 'us-federal-single',
      name: 'Federal Income Tax (Single Filer)',
      type: 'income',
      isDefault: true,
      brackets: [
        { threshold: 0, rate: 10 },
        { threshold: 11000, rate: 12 },
        { threshold: 44725, rate: 22 },
        { threshold: 95375, rate: 24 },
        { threshold: 182100, rate: 32 },
        { threshold: 231250, rate: 35 },
        { threshold: 578125, rate: 37 }
      ],
      notes: '2024 federal tax brackets for single filers. Does not include state taxes.'
    }
  ],

  wealthTaxes: [
    {
      id: 'us-no-wealth',
      name: 'No Wealth Tax',
      type: 'wealth',
      isDefault: true,
      rate: 0,
      notes: 'The United States does not have a federal wealth tax'
    }
  ],

  capitalGainsTaxes: [
    {
      id: 'us-ltcg-single',
      name: 'Long-Term Capital Gains (Single Filer)',
      type: 'capital_gains',
      isDefault: true,
      brackets: [
        { threshold: 0, rate: 0 },
        { threshold: 44625, rate: 15 },
        { threshold: 492300, rate: 20 }
      ],
      notes: '2024 rates for assets held more than one year'
    },
    {
      id: 'us-stcg-single',
      name: 'Short-Term Capital Gains (Single Filer)',
      type: 'capital_gains',
      isDefault: false,
      brackets: [
        { threshold: 0, rate: 10 },
        { threshold: 11000, rate: 12 },
        { threshold: 44725, rate: 22 },
        { threshold: 95375, rate: 24 },
        { threshold: 182100, rate: 32 },
        { threshold: 231250, rate: 35 },
        { threshold: 578125, rate: 37 }
      ],
      notes: 'Short-term gains (held less than one year) taxed as ordinary income'
    }
  ]
}

/**
 * United Kingdom Tax System (2024/2025)
 *
 * Tax year runs from 6 April to 5 April.
 *
 * Income Tax:
 * https://en.wikipedia.org/wiki/Taxation_in_the_United_Kingdom#Income_tax
 *
 * Capital Gains Tax:
 * https://en.wikipedia.org/wiki/Capital_gains_tax_in_the_United_Kingdom
 *
 * Wealth Tax:
 * The UK does not have a wealth tax, though it has various taxes on property
 * and inheritance.
 */
export const GB_TAX_CONFIG: CountryTaxConfig = {
  countryCode: 'GB',
  countryName: 'United Kingdom',

  incomeTaxes: [
    {
      id: 'gb-income',
      name: 'Income Tax (England, Wales & NI)',
      type: 'income',
      isDefault: true,
      exemptionThreshold: 12570,
      brackets: [
        { threshold: 12570, rate: 20 },
        { threshold: 50270, rate: 40 },
        { threshold: 125140, rate: 45 }
      ],
      notes: '2024/25 tax year. Personal allowance of £12,570. Scotland has different rates.'
    },
    {
      id: 'gb-scotland-income',
      name: 'Income Tax (Scotland)',
      type: 'income',
      isDefault: false,
      exemptionThreshold: 12570,
      brackets: [
        { threshold: 12570, rate: 19 },
        { threshold: 14876, rate: 20 },
        { threshold: 26561, rate: 21 },
        { threshold: 43662, rate: 42 },
        { threshold: 125140, rate: 47 }
      ],
      notes: '2024/25 tax year. Scottish income tax rates differ from rest of UK.'
    }
  ],

  wealthTaxes: [
    {
      id: 'gb-no-wealth',
      name: 'No Wealth Tax',
      type: 'wealth',
      isDefault: true,
      rate: 0,
      notes: 'The UK does not have a general wealth tax'
    }
  ],

  capitalGainsTaxes: [
    {
      id: 'gb-cgt-basic',
      name: 'Capital Gains Tax (Basic Rate)',
      type: 'capital_gains',
      isDefault: true,
      exemptionThreshold: 3000,
      rate: 10,
      notes: '2024/25 annual exempt amount is £3,000. 10% rate for basic rate taxpayers on most assets.'
    },
    {
      id: 'gb-cgt-higher',
      name: 'Capital Gains Tax (Higher Rate)',
      type: 'capital_gains',
      isDefault: false,
      exemptionThreshold: 3000,
      rate: 20,
      notes: '20% rate for higher and additional rate taxpayers on most assets'
    },
    {
      id: 'gb-cgt-property-basic',
      name: 'CGT on Residential Property (Basic Rate)',
      type: 'capital_gains',
      isDefault: false,
      exemptionThreshold: 3000,
      rate: 18,
      notes: '18% rate for basic rate taxpayers on residential property gains'
    },
    {
      id: 'gb-cgt-property-higher',
      name: 'CGT on Residential Property (Higher Rate)',
      type: 'capital_gains',
      isDefault: false,
      exemptionThreshold: 3000,
      rate: 24,
      notes: '24% rate for higher rate taxpayers on residential property gains'
    }
  ]
}

// =============================================================================
// EXPORTS
// =============================================================================

/**
 * All available tax configurations indexed by country code
 */
export const TAX_CONFIGS: Record<string, CountryTaxConfig> = {
  NL: NL_TAX_CONFIG,
  US: US_TAX_CONFIG,
  GB: GB_TAX_CONFIG
}

/**
 * List of all supported country codes
 */
export const SUPPORTED_COUNTRIES = Object.keys(TAX_CONFIGS).sort()

/**
 * Get tax configuration for a country
 */
export function getTaxConfig(countryCode: string): CountryTaxConfig | undefined {
  return TAX_CONFIGS[countryCode]
}

/**
 * Get all tax options of a specific type for a country
 */
export function getTaxOptions(
  countryCode: string,
  taxType: TaxType
): TaxOption[] {
  const config = getTaxConfig(countryCode)
  if (!config) return []

  switch (taxType) {
    case 'income':
      return config.incomeTaxes
    case 'wealth':
      return config.wealthTaxes
    case 'capital_gains':
      return config.capitalGainsTaxes
    default:
      return []
  }
}

/**
 * Get the default tax option for a country and tax type
 */
export function getDefaultTaxOption(
  countryCode: string,
  taxType: TaxType
): TaxOption | undefined {
  const options = getTaxOptions(countryCode, taxType)
  return options.find(option => option.isDefault)
}

/**
 * Find a specific tax option by ID
 */
export function findTaxOption(
  taxId: string,
  countryCode?: string
): TaxOption | undefined {
  if (countryCode) {
    // Search in specific country
    const config = getTaxConfig(countryCode)
    if (!config) return undefined

    const allOptions = [
      ...config.incomeTaxes,
      ...config.wealthTaxes,
      ...config.capitalGainsTaxes
    ]
    return allOptions.find(option => option.id === taxId)
  } else {
    // Search across all countries
    for (const config of Object.values(TAX_CONFIGS)) {
      const allOptions = [
        ...config.incomeTaxes,
        ...config.wealthTaxes,
        ...config.capitalGainsTaxes
      ]
      const found = allOptions.find(option => option.id === taxId)
      if (found) return found
    }
  }

  return undefined
}
