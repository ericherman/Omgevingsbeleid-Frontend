import { render } from '@testing-library/react';
import React from 'react';
import PopUpModules from './PopUpModules';

describe('PopUpModules', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<PopUpModules {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('PopUpModules')).toBeTruthy();
    });
});
