import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { MemoryRouter } from 'react-router-dom'

import allDimensies from '@/constants/dimensies'

import RaadpleegUniversalObjectOverview from './RaadpleegUniversalObjectOverview'

const queryClient = new QueryClient()

describe('RaadpleegUniversalObjectOverview', () => {
    const defaultProps = {
        dataModel: allDimensies.BELEIDSKEUZES,
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <RaadpleegUniversalObjectOverview {...props} />
                </QueryClientProvider>
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Beleidskeuzes')
        expect(element).toBeTruthy()
    })
})
