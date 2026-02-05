import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorState } from '@/components/dashboard/error-state'

describe('ErrorState', () => {
  it('should render with title and description', () => {
    render(
      <ErrorState
        title="Error al cargar"
        description="No se pudieron obtener los datos"
      />
    )

    expect(screen.getByText('Error al cargar')).toBeInTheDocument()
    expect(screen.getByText('No se pudieron obtener los datos')).toBeInTheDocument()
  })

  it('should display error icon by default', () => {
    render(
      <ErrorState
        title="Error al cargar"
        description="No se pudieron obtener los datos"
      />
    )

    // AlertTriangle icon should be rendered
    const svgs = document.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })

  it('should render custom icon when provided', () => {
    const TestIcon = () => <div data-testid="custom-error-icon">⚠️</div>

    render(
      <ErrorState
        title="Error al cargar"
        description="No se pudieron obtener los datos"
        icon={<TestIcon />}
      />
    )

    expect(screen.getByTestId('custom-error-icon')).toBeInTheDocument()
  })

  it('should render action button when provided', () => {
    render(
      <ErrorState
        title="Error al cargar"
        description="No se pudieron obtener los datos"
        actionLabel="Reintentar"
        onAction={vi.fn()}
      />
    )

    expect(screen.getByText('Reintentar')).toBeInTheDocument()
  })

  it('should not render button when action not provided', () => {
    render(
      <ErrorState
        title="Error al cargar"
        description="No se pudieron obtener los datos"
      />
    )

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should call onAction when button clicked', async () => {
    const mockOnAction = vi.fn()
    const user = userEvent.setup()

    render(
      <ErrorState
        title="Error al cargar"
        description="No se pudieron obtener los datos"
        actionLabel="Reintentar"
        onAction={mockOnAction}
      />
    )

    const button = screen.getByText('Reintentar')
    await user.click(button)

    expect(mockOnAction).toHaveBeenCalledOnce()
  })
})
