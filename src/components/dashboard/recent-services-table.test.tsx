import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RecentServicesTable } from '@/components/dashboard/recent-services-table'
import type { RecentService } from '@/types/finance-metrics'

const mockServices: RecentService[] = [
  {
    id: '1',
    date: '2026-02-05',
    contractId: 'c1',
    cateringCompanyName: 'Catering A',
    clientCompanyName: 'Client A',
    expected: 100,
    actual: 105,
    deviation: 5,
    cost: 50000,
    status: 'CONFIRMED',
  },
  {
    id: '2',
    date: '2026-02-04',
    contractId: 'c2',
    cateringCompanyName: 'Catering B',
    clientCompanyName: 'Client B',
    expected: 80,
    actual: 75,
    deviation: -5,
    cost: 40000,
    status: 'PENDING',
  },
]

describe('RecentServicesTable', () => {
  it('should render table with headers', () => {
    render(
      <RecentServicesTable
        services={mockServices}
        onViewDetails={vi.fn()}
      />
    )

    expect(screen.getByText('Registro de Consumos')).toBeInTheDocument()
    expect(screen.getByText('Fecha')).toBeInTheDocument()
    expect(screen.getByText('Proveedor')).toBeInTheDocument()
    expect(screen.getByText('Presupuestado')).toBeInTheDocument()
    expect(screen.getByText('Real')).toBeInTheDocument()
    expect(screen.getByText('Desvío')).toBeInTheDocument()
    expect(screen.getByText('Costo')).toBeInTheDocument()
    expect(screen.getByText('Estado')).toBeInTheDocument()
  })

  it('should render all services as rows', () => {
    render(
      <RecentServicesTable
        services={mockServices}
        onViewDetails={vi.fn()}
      />
    )

    expect(screen.getByText('Catering A')).toBeInTheDocument()
    expect(screen.getByText('Catering B')).toBeInTheDocument()
  })

  it('should display service details correctly', () => {
    render(
      <RecentServicesTable
        services={mockServices}
        onViewDetails={vi.fn()}
      />
    )

    // Expected and actual quantities
    const quantities = screen.getAllByText(/^(100|105|80|75)$/)
    expect(quantities.length).toBeGreaterThan(0)
  })

  it('should show deviation with positive and negative values', () => {
    render(
      <RecentServicesTable
        services={mockServices}
        onViewDetails={vi.fn()}
      />
    )

    // Should show both +5 and -5 deviations
    expect(screen.getByText('+5')).toBeInTheDocument()
    expect(screen.getByText('-5')).toBeInTheDocument()
  })

  it('should show confirmed status badge', () => {
    render(
      <RecentServicesTable
        services={mockServices}
        onViewDetails={vi.fn()}
      />
    )

    expect(screen.getByText('Facturado')).toBeInTheDocument()
  })

  it('should show pending status badge', () => {
    render(
      <RecentServicesTable
        services={mockServices}
        onViewDetails={vi.fn()}
      />
    )

    const pendingBadges = screen.getAllByText('Pendiente')
    expect(pendingBadges.length).toBeGreaterThan(0)
  })

  it('should have action buttons to view details', () => {
    render(
      <RecentServicesTable
        services={mockServices}
        onViewDetails={vi.fn()}
      />
    )

    const buttons = screen.getAllByRole('button', { name: /Ver Detalles/ })
    expect(buttons.length).toBe(2)
  })

  it('should call onViewDetails with correct contractId when button clicked', async () => {
    const mockOnViewDetails = vi.fn()
    const user = userEvent.setup()

    render(
      <RecentServicesTable
        services={mockServices}
        onViewDetails={mockOnViewDetails}
      />
    )

    const buttons = screen.getAllByRole('button', { name: /Ver Detalles/ })
    await user.click(buttons[0])

    expect(mockOnViewDetails).toHaveBeenCalledWith('c1')
  })

  it('should display costs in currency format', () => {
    render(
      <RecentServicesTable
        services={mockServices}
        onViewDetails={vi.fn()}
      />
    )

    // Check for values in costs
    expect(screen.getAllByText(/50/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/40/).length).toBeGreaterThan(0)
  })

  it('should display null costs as dash', () => {
    const servicesWithNoCost: RecentService[] = [
      {
        ...mockServices[0],
        cost: null,
      },
    ]

    render(
      <RecentServicesTable
        services={servicesWithNoCost}
        onViewDetails={vi.fn()}
      />
    )

    const dashes = screen.getAllByText('-')
    expect(dashes.length).toBeGreaterThan(0)
  })

  it('should have full history link', () => {
    render(
      <RecentServicesTable
        services={mockServices}
        onViewDetails={vi.fn()}
      />
    )

    expect(screen.getByText('Ver Histórico Completo')).toBeInTheDocument()
  })

  it('should call onViewDetails with "all" when viewing full history', async () => {
    const mockOnViewDetails = vi.fn()
    const user = userEvent.setup()

    render(
      <RecentServicesTable
        services={mockServices}
        onViewDetails={mockOnViewDetails}
      />
    )

    const historyLink = screen.getByText('Ver Histórico Completo')
    await user.click(historyLink)

    expect(mockOnViewDetails).toHaveBeenCalledWith('all')
  })
})
