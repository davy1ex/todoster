import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Set up custom configurations for testing-library
configure({
    testIdAttribute: 'data-testid',
});