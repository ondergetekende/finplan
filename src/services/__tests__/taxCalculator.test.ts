import { describe, it, expect } from 'vitest'
import {
  calculateTax,
  calculateProgressiveTax,
  resolveTaxOption,
  calculateMonthlyTax,
  calculateMonthlyIncomeTax
} from '../taxCalculator'
import type { TaxOption, TaxBracket, InflationAdjustment } from '../../config/taxConfig'

describe('taxCalculator', () => {
  describe('calculateTax', () => {
    it('should calculate flat rate tax correctly', () => {
      const taxOption: TaxOption = {
        id: 'test-flat',
        name: 'Test Flat Tax',
        type: 'income',
        isDefault: true,
        rate: 25
      }

      expect(calculateTax(1000, taxOption)).toBe(250)
      expect(calculateTax(5000, taxOption)).toBe(1250)
    })

    it('should handle zero and negative amounts', () => {
      const taxOption: TaxOption = {
        id: 'test-flat',
        name: 'Test Flat Tax',
        type: 'income',
        isDefault: true,
        rate: 25
      }

      expect(calculateTax(0, taxOption)).toBe(0)
      expect(calculateTax(-1000, taxOption)).toBe(0)
    })

    it('should apply exemption threshold correctly', () => {
      const taxOption: TaxOption = {
        id: 'test-exemption',
        name: 'Test With Exemption',
        type: 'wealth',
        isDefault: true,
        rate: 10,
        exemptionThreshold: 50000
      }

      // Below threshold: no tax
      expect(calculateTax(30000, taxOption)).toBe(0)
      expect(calculateTax(50000, taxOption)).toBe(0)

      // Above threshold: tax on amount above threshold
      expect(calculateTax(60000, taxOption)).toBe(1000) // (60000 - 50000) * 0.1
      expect(calculateTax(100000, taxOption)).toBe(5000) // (100000 - 50000) * 0.1
    })

    it('should calculate progressive tax with brackets', () => {
      const taxOption: TaxOption = {
        id: 'test-progressive',
        name: 'Test Progressive Tax',
        type: 'income',
        isDefault: true,
        brackets: [
          { threshold: 0, rate: 10 },
          { threshold: 10000, rate: 20 },
          { threshold: 50000, rate: 30 }
        ]
      }

      // In first bracket
      expect(calculateTax(5000, taxOption)).toBe(500) // 5000 * 0.1

      // In second bracket
      // First 10000 at 10% = 1000
      // Next 5000 at 20% = 1000
      // Total = 2000
      expect(calculateTax(15000, taxOption)).toBe(2000)

      // In third bracket
      // First 10000 at 10% = 1000
      // Next 40000 at 20% = 8000
      // Next 10000 at 30% = 3000
      // Total = 12000
      expect(calculateTax(60000, taxOption)).toBe(12000)
    })

    it('should return 0 when no rate or brackets defined', () => {
      const taxOption: TaxOption = {
        id: 'test-no-tax',
        name: 'Test No Tax',
        type: 'capital_gains',
        isDefault: true
      }

      expect(calculateTax(10000, taxOption)).toBe(0)
    })
  })

  describe('calculateProgressiveTax', () => {
    const brackets: TaxBracket[] = [
      { threshold: 0, rate: 10 },
      { threshold: 10000, rate: 20 },
      { threshold: 50000, rate: 30 }
    ]

    it('should calculate tax in first bracket', () => {
      expect(calculateProgressiveTax(5000, brackets)).toBe(500)
      expect(calculateProgressiveTax(10000, brackets)).toBe(1000)
    })

    it('should calculate tax spanning multiple brackets', () => {
      // 10000 at 10% = 1000
      // 5000 at 20% = 1000
      expect(calculateProgressiveTax(15000, brackets)).toBe(2000)

      // 10000 at 10% = 1000
      // 40000 at 20% = 8000
      expect(calculateProgressiveTax(50000, brackets)).toBe(9000)

      // 10000 at 10% = 1000
      // 40000 at 20% = 8000
      // 50000 at 30% = 15000
      expect(calculateProgressiveTax(100000, brackets)).toBe(24000)
    })

    it('should handle zero and negative amounts', () => {
      expect(calculateProgressiveTax(0, brackets)).toBe(0)
      expect(calculateProgressiveTax(-1000, brackets)).toBe(0)
    })

    it('should handle empty brackets', () => {
      expect(calculateProgressiveTax(10000, [])).toBe(0)
    })

    it('should handle unsorted brackets', () => {
      const unsortedBrackets: TaxBracket[] = [
        { threshold: 50000, rate: 30 },
        { threshold: 0, rate: 10 },
        { threshold: 10000, rate: 20 }
      ]

      // Should still calculate correctly after sorting
      // 10000 at 10% = 1000
      // 5000 at 20% = 1000
      expect(calculateProgressiveTax(15000, unsortedBrackets)).toBe(2000)
    })

    it('should handle single bracket', () => {
      const singleBracket: TaxBracket[] = [{ threshold: 0, rate: 15 }]

      expect(calculateProgressiveTax(10000, singleBracket)).toBe(1500)
      expect(calculateProgressiveTax(50000, singleBracket)).toBe(7500)
    })

    it('should calculate US federal income tax correctly (2024)', () => {
      // 2024 US federal tax brackets (single filer)
      const usBrackets: TaxBracket[] = [
        { threshold: 0, rate: 10 },
        { threshold: 11000, rate: 12 },
        { threshold: 44725, rate: 22 },
        { threshold: 95375, rate: 24 },
        { threshold: 182100, rate: 32 },
        { threshold: 231250, rate: 35 },
        { threshold: 578125, rate: 37 }
      ]

      // Test $50,000 income
      // 0-11000: 11000 * 0.10 = 1100
      // 11000-44725: 33725 * 0.12 = 4047
      // 44725-50000: 5275 * 0.22 = 1160.5
      // Total: 6307.5
      expect(calculateProgressiveTax(50000, usBrackets)).toBeCloseTo(6307.5, 1)

      // Test $100,000 income
      // 0-11000: 11000 * 0.10 = 1100
      // 11000-44725: 33725 * 0.12 = 4047
      // 44725-95375: 50650 * 0.22 = 11143
      // 95375-100000: 4625 * 0.24 = 1110
      // Total: 17400
      expect(calculateProgressiveTax(100000, usBrackets)).toBeCloseTo(17400, 0)
    })
  })

  describe('resolveTaxOption', () => {
    it('should return null for undefined taxId', () => {
      expect(resolveTaxOption(undefined, 'NL', 'income')).toBeNull()
    })

    it('should return null for "none" taxId', () => {
      expect(resolveTaxOption('none', 'NL', 'wealth')).toBeNull()
    })

    it('should return null for "after-tax" taxId', () => {
      expect(resolveTaxOption('after-tax', 'NL', 'income')).toBeNull()
    })

    it('should resolve "default" to default tax option for country', () => {
      const option = resolveTaxOption('default', 'NL', 'income')

      expect(option).not.toBeNull()
      expect(option?.id).toBe('nl-box1')
      expect(option?.isDefault).toBe(true)
      expect(option?.type).toBe('income')
    })

    it('should return null when resolving default without country code', () => {
      const option = resolveTaxOption('default', undefined, 'income')

      expect(option).toBeNull()
    })

    it('should resolve specific tax option by ID', () => {
      const option = resolveTaxOption('nl-box2', 'NL', 'income')

      expect(option).not.toBeNull()
      expect(option?.id).toBe('nl-box2')
      expect(option?.name).toBe('Box 2 - Substantial Interest')
      expect(option?.type).toBe('income')
    })

    it('should resolve tax option for US', () => {
      const option = resolveTaxOption('default', 'US', 'income')

      expect(option).not.toBeNull()
      expect(option?.id).toBe('us-federal-single')
      expect(option?.isDefault).toBe(true)
    })

    it('should resolve tax option for GB', () => {
      const option = resolveTaxOption('default', 'GB', 'income')

      expect(option).not.toBeNull()
      expect(option?.id).toBe('gb-income')
      expect(option?.isDefault).toBe(true)
    })

    it('should return null for invalid tax ID', () => {
      const option = resolveTaxOption('invalid-tax-id', 'NL', 'income')

      expect(option).toBeNull()
    })

    it('should return null when tax option type does not match', () => {
      // Try to resolve an income tax as a wealth tax
      const option = resolveTaxOption('nl-box1', 'NL', 'wealth')

      expect(option).toBeNull()
    })
  })

  describe('calculateMonthlyTax', () => {
    it('should calculate monthly tax from annual amount', () => {
      const taxOption: TaxOption = {
        id: 'test-flat',
        name: 'Test Tax',
        type: 'wealth',
        isDefault: true,
        rate: 12 // 12% annual = 1% monthly
      }

      const annualAmount = 100000
      const monthlyTax = calculateMonthlyTax(annualAmount, taxOption)

      // 100000 * 0.12 / 12 = 1000
      expect(monthlyTax).toBe(1000)
    })

    it('should work with progressive brackets', () => {
      const taxOption: TaxOption = {
        id: 'test-progressive',
        name: 'Test Progressive',
        type: 'wealth',
        isDefault: true,
        brackets: [
          { threshold: 0, rate: 10 },
          { threshold: 50000, rate: 20 }
        ]
      }

      const annualAmount = 100000
      const monthlyTax = calculateMonthlyTax(annualAmount, taxOption)

      // First 50000 at 10% = 5000
      // Next 50000 at 20% = 10000
      // Total annual tax = 15000
      // Monthly = 1250
      expect(monthlyTax).toBe(1250)
    })
  })

  describe('calculateMonthlyIncomeTax', () => {
    it('should annualize monthly income before calculating tax', () => {
      const taxOption: TaxOption = {
        id: 'test-flat',
        name: 'Test Income Tax',
        type: 'income',
        isDefault: true,
        rate: 25
      }

      const monthlyIncome = 5000
      const monthlyTax = calculateMonthlyIncomeTax(monthlyIncome, taxOption)

      // Annual income = 5000 * 12 = 60000
      // Annual tax = 60000 * 0.25 = 15000
      // Monthly tax = 15000 / 12 = 1250
      expect(monthlyTax).toBe(1250)
    })

    it('should work correctly with progressive brackets', () => {
      const taxOption: TaxOption = {
        id: 'test-progressive',
        name: 'Test Progressive Income Tax',
        type: 'income',
        isDefault: true,
        brackets: [
          { threshold: 0, rate: 10 },
          { threshold: 10000, rate: 20 },
          { threshold: 50000, rate: 30 }
        ]
      }

      const monthlyIncome = 5000 // Annual: 60000
      const monthlyTax = calculateMonthlyIncomeTax(monthlyIncome, taxOption)

      // Annual income = 60000
      // First 10000 at 10% = 1000
      // Next 40000 at 20% = 8000
      // Next 10000 at 30% = 3000
      // Total annual tax = 12000
      // Monthly tax = 1000
      expect(monthlyTax).toBe(1000)
    })

    it('should handle exemption thresholds', () => {
      const taxOption: TaxOption = {
        id: 'test-exemption',
        name: 'Test With Exemption',
        type: 'income',
        isDefault: true,
        rate: 20,
        exemptionThreshold: 12000
      }

      const monthlyIncome = 1000 // Annual: 12000 (exactly at threshold)
      const monthlyTax = calculateMonthlyIncomeTax(monthlyIncome, taxOption)

      // Annual income = 12000
      // Exemption threshold = 12000
      // No tax
      expect(monthlyTax).toBe(0)

      const higherMonthlyIncome = 2000 // Annual: 24000
      const higherMonthlyTax = calculateMonthlyIncomeTax(
        higherMonthlyIncome,
        taxOption
      )

      // Annual income = 24000
      // Taxable = 24000 - 12000 = 12000
      // Tax = 12000 * 0.20 = 2400
      // Monthly = 200
      expect(higherMonthlyTax).toBe(200)
    })
  })

  describe('Inflation-adjusted tax calculations', () => {
    it('should adjust exemption threshold for inflation', () => {
      const taxOption: TaxOption = {
        id: 'test-exemption',
        name: 'Test With Exemption',
        type: 'wealth',
        isDefault: true,
        rate: 10,
        exemptionThreshold: 50000
      }

      // After 1 year at 3% inflation
      const inflationAdjustment: InflationAdjustment = {
        inflationRate: 3,
        monthsSinceReference: 12
      }

      // Adjusted threshold: 50000 * 1.03 = 51500
      // Amount of 52000 is now just above adjusted threshold
      // Tax = (52000 - 51500) * 0.1 = 50
      const tax = calculateTax(52000, taxOption, inflationAdjustment)
      expect(tax).toBeCloseTo(50, 0)

      // Without inflation adjustment, same amount would have higher tax
      const taxNoInflation = calculateTax(52000, taxOption)
      expect(taxNoInflation).toBe(200) // (52000 - 50000) * 0.1
    })

    it('should adjust progressive tax brackets for inflation', () => {
      const taxOption: TaxOption = {
        id: 'test-progressive',
        name: 'Test Progressive Tax',
        type: 'income',
        isDefault: true,
        brackets: [
          { threshold: 0, rate: 10 },
          { threshold: 50000, rate: 20 },
          { threshold: 100000, rate: 30 }
        ]
      }

      // After 2 years at 2.5% inflation
      const inflationAdjustment: InflationAdjustment = {
        inflationRate: 2.5,
        monthsSinceReference: 24
      }

      // Adjusted brackets:
      // 0 * 1.025^2 = 0
      // 50000 * 1.025^2 = 51,562.50
      // 100000 * 1.025^2 = 103,125

      // Income of 75,000 falls in second bracket
      // Without inflation: 50000*0.1 + 25000*0.2 = 5000 + 5000 = 10000
      const taxNoInflation = calculateTax(75000, taxOption)
      expect(taxNoInflation).toBe(10000)

      // With inflation adjustment:
      // Threshold becomes 50000 * 1.025^2 = 51,562.50
      // Tax = 51562.50 * 0.1 + (75000 - 51562.50) * 0.2
      const taxWithInflation = calculateTax(75000, taxOption, inflationAdjustment)
      // Just check it's less than without inflation and approximately correct
      expect(taxWithInflation).toBeCloseTo(9747, 0)

      // Tax is lower with inflation adjustment because brackets moved up
      expect(taxWithInflation).toBeLessThan(taxNoInflation)
    })

    it('should handle Netherlands Box 1 with inflation', () => {
      const nlBox1: TaxOption = {
        id: 'nl-box1',
        name: 'Box 1',
        type: 'income',
        isDefault: true,
        brackets: [
          { threshold: 0, rate: 36.93 },
          { threshold: 73031, rate: 49.5 }
        ]
      }

      // After 10 years at 2% inflation
      const inflationAdjustment: InflationAdjustment = {
        inflationRate: 2,
        monthsSinceReference: 120
      }

      // Annual income of €60,000
      const income = 60000

      // Without inflation
      const taxNoInflation = calculateTax(income, nlBox1)
      expect(taxNoInflation).toBeCloseTo(22158, 0) // 60000 * 0.3693

      // With inflation: threshold adjusted to 73031 * 1.02^10 = 89,002.57
      // Since income (60000) is still below adjusted threshold,
      // all taxed at lower rate: 60000 * 0.3693 = 22158
      const taxWithInflation = calculateTax(income, nlBox1, inflationAdjustment)
      expect(taxWithInflation).toBeCloseTo(22158, 0)

      // For higher income that crosses the bracket
      const higherIncome = 90000
      const higherTaxNoInflation = calculateTax(higherIncome, nlBox1)
      // 73031 * 0.3693 + 16969 * 0.495 = 26,972.35 + 8,399.66 = 35,371.98
      expect(higherTaxNoInflation).toBeCloseTo(35370, 0)

      const higherTaxWithInflation = calculateTax(
        higherIncome,
        nlBox1,
        inflationAdjustment
      )
      // With inflation-adjusted threshold
      expect(higherTaxWithInflation).toBeCloseTo(33360, 0)
      expect(higherTaxWithInflation).toBeLessThan(higherTaxNoInflation)
    })

    it('should adjust exemption threshold for wealth tax with inflation', () => {
      const nlBox3: TaxOption = {
        id: 'nl-box3',
        name: 'Box 3',
        type: 'wealth',
        isDefault: true,
        exemptionThreshold: 57000,
        rate: 36
      }

      // After 5 years at 2.5% inflation
      const inflationAdjustment: InflationAdjustment = {
        inflationRate: 2.5,
        monthsSinceReference: 60
      }

      // Wealth of €100,000
      const wealth = 100000

      // Without inflation: (100000 - 57000) * 0.36 = 15480
      const taxNoInflation = calculateTax(wealth, nlBox3)
      expect(taxNoInflation).toBe(15480)

      // With inflation: threshold = 57000 * 1.025^5 = 64,425.99
      // Tax = (100000 - 64425.99) * 0.36 = 12,806.64
      const taxWithInflation = calculateTax(wealth, nlBox3, inflationAdjustment)
      expect(taxWithInflation).toBeCloseTo(12784, 0)
      expect(taxWithInflation).toBeLessThan(taxNoInflation)
    })

    it('should work with calculateMonthlyIncomeTax', () => {
      const taxOption: TaxOption = {
        id: 'test-progressive',
        name: 'Test Progressive Income Tax',
        type: 'income',
        isDefault: true,
        brackets: [
          { threshold: 0, rate: 10 },
          { threshold: 50000, rate: 20 }
        ]
      }

      const monthlyIncome = 5000 // Annual: 60000

      // After 1 year at 3% inflation
      const inflationAdjustment: InflationAdjustment = {
        inflationRate: 3,
        monthsSinceReference: 12
      }

      // Without inflation: 50000*0.1 + 10000*0.2 = 5000 + 2000 = 7000
      // Monthly: 7000 / 12 = 583.33
      const monthlyTaxNoInflation = calculateMonthlyIncomeTax(monthlyIncome, taxOption)
      expect(monthlyTaxNoInflation).toBeCloseTo(583.33, 1)

      // With inflation: threshold = 50000 * 1.03 = 51500
      // 51500*0.1 + 8500*0.2 = 5150 + 1700 = 6850
      // Monthly: 6850 / 12 = 570.83
      const monthlyTaxWithInflation = calculateMonthlyIncomeTax(
        monthlyIncome,
        taxOption,
        inflationAdjustment
      )
      expect(monthlyTaxWithInflation).toBeCloseTo(570.83, 1)
      expect(monthlyTaxWithInflation).toBeLessThan(monthlyTaxNoInflation)
    })

    it('should handle zero inflation rate', () => {
      const taxOption: TaxOption = {
        id: 'test-brackets',
        name: 'Test Brackets',
        type: 'income',
        isDefault: true,
        brackets: [
          { threshold: 0, rate: 10 },
          { threshold: 50000, rate: 20 }
        ]
      }

      const inflationAdjustment: InflationAdjustment = {
        inflationRate: 0,
        monthsSinceReference: 60
      }

      // With 0% inflation, should be same as no inflation adjustment
      const taxWithZeroInflation = calculateTax(75000, taxOption, inflationAdjustment)
      const taxNoInflation = calculateTax(75000, taxOption)

      expect(taxWithZeroInflation).toBe(taxNoInflation)
      expect(taxWithZeroInflation).toBe(10000) // 50000*0.1 + 25000*0.2
    })

    it('should handle zero months since reference', () => {
      const taxOption: TaxOption = {
        id: 'test-brackets',
        name: 'Test Brackets',
        type: 'income',
        isDefault: true,
        brackets: [
          { threshold: 0, rate: 10 },
          { threshold: 50000, rate: 20 }
        ]
      }

      const inflationAdjustment: InflationAdjustment = {
        inflationRate: 5,
        monthsSinceReference: 0
      }

      // With 0 months, should be same as no inflation adjustment
      const taxAtReferenceTime = calculateTax(75000, taxOption, inflationAdjustment)
      const taxNoInflation = calculateTax(75000, taxOption)

      expect(taxAtReferenceTime).toBe(taxNoInflation)
      expect(taxAtReferenceTime).toBe(10000)
    })
  })

  describe('Real-world tax scenarios', () => {
    it('should calculate Netherlands Box 1 income tax correctly', () => {
      const nlBox1: TaxOption = {
        id: 'nl-box1',
        name: 'Box 1',
        type: 'income',
        isDefault: true,
        brackets: [
          { threshold: 0, rate: 36.93 },
          { threshold: 73031, rate: 49.5 }
        ]
      }

      // Monthly income of €5000 (annual €60000)
      const monthlyTax = calculateMonthlyIncomeTax(5000, nlBox1)

      // Annual: 60000
      // First 73031 at 36.93% = but only 60000, so 60000 * 0.3693 = 22158
      // Monthly: 22158 / 12 = 1846.5
      expect(monthlyTax).toBeCloseTo(1846.5, 1)
    })

    it('should calculate Netherlands Box 3 wealth tax correctly', () => {
      const nlBox3: TaxOption = {
        id: 'nl-box3',
        name: 'Box 3',
        type: 'wealth',
        isDefault: true,
        exemptionThreshold: 57000,
        rate: 36,
        notes: 'Simplified - should use deemed return'
      }

      // €100,000 in assets
      const monthlyTax = calculateMonthlyTax(100000, nlBox3)

      // Taxable = 100000 - 57000 = 43000
      // Annual tax = 43000 * 0.36 = 15480
      // Monthly = 15480 / 12 = 1290
      expect(monthlyTax).toBe(1290)
    })

    it('should calculate UK capital gains tax with exemption', () => {
      const ukCGT: TaxOption = {
        id: 'gb-cgt-basic',
        name: 'UK CGT Basic Rate',
        type: 'capital_gains',
        isDefault: true,
        exemptionThreshold: 3000,
        rate: 10
      }

      // £10,000 in gains
      const tax = calculateTax(10000, ukCGT)

      // Taxable = 10000 - 3000 = 7000
      // Tax = 7000 * 0.10 = 700
      expect(tax).toBe(700)

      // £2,000 in gains (below exemption)
      const lowTax = calculateTax(2000, ukCGT)
      expect(lowTax).toBe(0)
    })

    it('should calculate US federal income tax correctly', () => {
      const usFederal: TaxOption = {
        id: 'us-federal-single',
        name: 'US Federal Income Tax',
        type: 'income',
        isDefault: true,
        brackets: [
          { threshold: 0, rate: 10 },
          { threshold: 11000, rate: 12 },
          { threshold: 44725, rate: 22 },
          { threshold: 95375, rate: 24 }
        ]
      }

      // Monthly income of $5000 (annual $60000)
      const monthlyTax = calculateMonthlyIncomeTax(5000, usFederal)

      // Annual: 60000
      // 0-11000: 1100
      // 11000-44725: 4047
      // 44725-60000: 3360.5
      // Total: 8507.5
      // Monthly: 708.958...
      expect(monthlyTax).toBeCloseTo(708.96, 1)
    })
  })
})
