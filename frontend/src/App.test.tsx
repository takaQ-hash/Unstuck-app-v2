import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App.tsx'

describe('App', () => {
  it('何も表示しない', () => {
    const { container } = render(<App />)

    expect(container).toBeInTheDocument()
    expect(container).toBeEmptyDOMElement()
  })
})
