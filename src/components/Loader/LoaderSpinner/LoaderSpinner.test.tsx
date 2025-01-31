import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import LoaderSpinner from './LoaderSpinner'

describe('LoaderSpinner', () => {
    const defaultProps = {}

    const setup = (customProps?: { [key: string]: any }) => {
        const props = { ...defaultProps, ...customProps }
        render(<LoaderSpinner {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByRole('img', { hidden: true })
        expect(element).toBeTruthy()
    })
})
