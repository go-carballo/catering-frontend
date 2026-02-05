import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { BudgetCard } from '@/components/dashboard/budget-card'
import type { BudgetMetrics } from '@/types/finance-metrics'

const mockBudget: BudgetMetrics = {
  consumed: 450000,
  estimated: 600000,
  projectedEndOfMonth: 550000,
  previousMonth: 400000,
}

describe('BudgetCard', () => {
  it('should render budget card with title', () => {
    render(
      <BudgetCard
        budget={mockBudget}
        budgetPercentage={75}
        projectedPercentage={91.67}
        savingsVsPrevious={-50000}
        savingsPercentage={-12.5}
        isOverBudget={false}
      />
    )

    expect(screen.getByText('Estado del Presupuesto Mensual')).toBeInTheDocument()
  })

  it('should display consumed and estimated amounts', () => {
    render(
      <BudgetCard
        budget={mockBudget}
        budgetPercentage={75}
        projectedPercentage={91.67}
        savingsVsPrevious={-50000}
        savingsPercentage={-12.5}
        isOverBudget={false}
      />
    )

    // Use regex to handle locale variations
    expect(screen.getByText(/450/)).toBeInTheDocument()
    expect(screen.getByText(/600/)).toBeInTheDocument()
  })

  it('should show budget percentage', () => {
    render(
      <BudgetCard
        budget={mockBudget}
        budgetPercentage={75}
        projectedPercentage={91.67}
        savingsVsPrevious={-50000}
        savingsPercentage={-12.5}
        isOverBudget={false}
      />
    )

    expect(screen.getByText('75.0%')).toBeInTheDocument()
  })

  it('should show projected end of month amount', () => {
    render(
      <BudgetCard
        budget={mockBudget}
        budgetPercentage={75}
        projectedPercentage={91.67}
        savingsVsPrevious={-50000}
        savingsPercentage={-12.5}
        isOverBudget={false}
      />
    )

    expect(screen.getByText('Proyección fin de mes')).toBeInTheDocument()
    expect(screen.getByText(/550/)).toBeInTheDocument()
  })

  it('should show "Dentro del estimado" badge when not over budget', () => {
    render(
      <BudgetCard
        budget={mockBudget}
        budgetPercentage={75}
        projectedPercentage={91.67}
        savingsVsPrevious={-50000}
        savingsPercentage={-12.5}
        isOverBudget={false}
      />
    )

    expect(screen.getByText('✓ Dentro del estimado')).toBeInTheDocument()
  })

  it('should show "Sobre estimado" badge when over budget', () => {
    const overBudgetData: BudgetMetrics = {
      ...mockBudget,
      projectedEndOfMonth: 700000,
    }

    render(
      <BudgetCard
        budget={overBudgetData}
        budgetPercentage={75}
        projectedPercentage={116.67}
        savingsVsPrevious={-50000}
        savingsPercentage={-12.5}
        isOverBudget={true}
      />
    )

    expect(screen.getByText('⚠️ Sobre estimado')).toBeInTheDocument()
  })

  it('should show comparison with previous month', () => {
    render(
      <BudgetCard
        budget={mockBudget}
        budgetPercentage={75}
        projectedPercentage={91.67}
        savingsVsPrevious={-50000}
        savingsPercentage={-12.5}
        isOverBudget={false}
      />
    )

    expect(screen.getByText(/Incremento vs\. mes anterior/)).toBeInTheDocument()
  })

  it('should not show previous month comparison if previousMonth is 0', () => {
    const noPreviousMonth: BudgetMetrics = {
      ...mockBudget,
      previousMonth: 0,
    }

    render(
      <BudgetCard
        budget={noPreviousMonth}
        budgetPercentage={75}
        projectedPercentage={91.67}
        savingsVsPrevious={0}
        savingsPercentage={0}
        isOverBudget={false}
      />
    )

    expect(
      screen.queryByText(/Incremento vs\. mes anterior/)
    ).not.toBeInTheDocument()
  })
})
