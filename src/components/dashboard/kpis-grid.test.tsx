import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { KPIsGrid } from '@/components/dashboard/kpis-grid'
import type { KPIs } from '@/types/finance-metrics'

const mockKPIs: KPIs = {
  costPerPerson: {
    current: 1500,
    previousMonth: 1400,
    change: 7.14,
  },
  utilizationRate: {
    current: 85,
    previousMonth: 80,
    change: 6.25,
  },
  contractsWithDeviation: 2,
  upcomingServicesWeek: {
    count: 8,
    estimatedCost: 120000,
  },
}

describe('KPIsGrid', () => {
  it('should render 4 KPI cards', () => {
    render(<KPIsGrid kpis={mockKPIs} />)

    const cards = screen.getAllByText(/Costo por Persona|Tasa de Utilización|Contratos con Desvío|Servicios Próximos/)
    expect(cards.length).toBeGreaterThanOrEqual(4)
  })

  it('should display cost per person KPI', () => {
    render(<KPIsGrid kpis={mockKPIs} />)

    expect(screen.getByText('Costo por Persona / Mes')).toBeInTheDocument()
    expect(screen.getAllByText(/1500|1\.500/).length).toBeGreaterThan(0)
  })

  it('should display utilization rate KPI', () => {
    render(<KPIsGrid kpis={mockKPIs} />)

    expect(screen.getByText('Tasa de Utilización')).toBeInTheDocument()
    expect(screen.getByText('85%')).toBeInTheDocument()
  })

  it('should display contracts with deviation', () => {
    render(<KPIsGrid kpis={mockKPIs} />)

    expect(screen.getByText('Contratos con Desvío')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('should display upcoming services', () => {
    render(<KPIsGrid kpis={mockKPIs} />)

    expect(screen.getByText('Servicios Próximos')).toBeInTheDocument()
    // Looking for the count - should appear somewhere
    const eights = screen.getAllByText(/8/)
    expect(eights.length).toBeGreaterThan(0)
  })

  it('should show positive trend for cost per person when change is positive', () => {
    render(<KPIsGrid kpis={mockKPIs} />)

    // Should show the change percentage somewhere
    expect(screen.getByText(/7\.14/)).toBeInTheDocument()
  })

  it('should show previous month values as secondary info', () => {
    render(<KPIsGrid kpis={mockKPIs} />)

    expect(screen.getByText(/Anterior:.*1.*400/)).toBeInTheDocument()
    expect(screen.getByText(/Anterior:.*80/)).toBeInTheDocument()
  })

  it('should handle zero change gracefully', () => {
    const noChangeKPIs: KPIs = {
      ...mockKPIs,
      costPerPerson: {
        ...mockKPIs.costPerPerson,
        change: 0,
      },
    }

    render(<KPIsGrid kpis={noChangeKPIs} />)

    expect(screen.getByText('Costo por Persona / Mes')).toBeInTheDocument()
  })

  it('should display negative trend correctly', () => {
    const negativeChangeKPIs: KPIs = {
      ...mockKPIs,
      utilizationRate: {
        ...mockKPIs.utilizationRate,
        change: -5,
      },
    }

    render(<KPIsGrid kpis={negativeChangeKPIs} />)

    expect(screen.getByText('5%')).toBeInTheDocument()
  })
})
