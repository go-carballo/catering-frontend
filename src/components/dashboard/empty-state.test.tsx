import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EmptyState } from '@/components/dashboard/empty-state'

describe('EmptyState', () => {
  it('should render with provided title and description', () => {
    render(
      <EmptyState
        title="No hay datos"
        description="Por favor crea un nuevo item"
      />
    )

    expect(screen.getByText('No hay datos')).toBeInTheDocument()
    expect(screen.getByText('Por favor crea un nuevo item')).toBeInTheDocument()
  })

  it('should render action button when provided', () => {
    render(
      <EmptyState
        title="No hay datos"
        description="Por favor crea un nuevo item"
        actionLabel="Crear"
        onAction={vi.fn()}
      />
    )

    expect(screen.getByText('Crear')).toBeInTheDocument()
  })

  it('should not render button when actionLabel not provided', () => {
    render(
      <EmptyState
        title="No hay datos"
        description="Por favor crea un nuevo item"
      />
    )

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should call onAction when button is clicked', async () => {
    const mockOnAction = vi.fn()
    const user = userEvent.setup()

    render(
      <EmptyState
        title="No hay datos"
        description="Por favor crea un nuevo item"
        actionLabel="Crear"
        onAction={mockOnAction}
      />
    )

    const button = screen.getByText('Crear')
    await user.click(button)

    expect(mockOnAction).toHaveBeenCalledOnce()
  })

  it('should render custom icon when provided', () => {
    const TestIcon = () => <div data-testid="custom-icon">📦</div>

    render(
      <EmptyState
        title="No hay datos"
        description="Por favor crea un nuevo item"
        icon={<TestIcon />}
      />
    )

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('should render default icon when not provided', () => {
    render(
      <EmptyState
        title="No hay datos"
        description="Por favor crea un nuevo item"
      />
    )

    // FileText icon from lucide-react should be rendered
    const svgs = document.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })
})
