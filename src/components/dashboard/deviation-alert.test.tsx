import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeviationAlert } from '@/components/dashboard/deviation-alert'

describe('DeviationAlert', () => {
  it('should not render when count is 0', () => {
    const { container } = render(
      <DeviationAlert count={0} onViewContracts={vi.fn()} />
    )

    expect(container.firstChild).toBeNull()
  })

  it('should render alert when count > 0', () => {
    render(
      <DeviationAlert count={2} onViewContracts={vi.fn()} />
    )

    expect(screen.getByText('Atención Requerida')).toBeInTheDocument()
  })

  it('should display the count in the message', () => {
    render(
      <DeviationAlert count={3} onViewContracts={vi.fn()} />
    )

    expect(screen.getByText(/3/)).toBeInTheDocument()
  })

  it('should have a button to view contracts', () => {
    render(
      <DeviationAlert count={1} onViewContracts={vi.fn()} />
    )

    expect(screen.getByText('Revisar Contratos')).toBeInTheDocument()
  })

  it('should call onViewContracts when button is clicked', async () => {
    const mockOnViewContracts = vi.fn()
    const user = userEvent.setup()

    render(
      <DeviationAlert count={1} onViewContracts={mockOnViewContracts} />
    )

    const button = screen.getByText('Revisar Contratos')
    await user.click(button)

    expect(mockOnViewContracts).toHaveBeenCalledOnce()
  })

  it('should explain the deviation threshold', () => {
    render(
      <DeviationAlert count={1} onViewContracts={vi.fn()} />
    )

    expect(screen.getByText(/10% de desvío/)).toBeInTheDocument()
  })
})
