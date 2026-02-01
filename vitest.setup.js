import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with Jest-DOM matchers
expect.extend(matchers);

// Automatically run cleanup after each test to prevent memory leaks and state bleed
afterEach(() => {
    cleanup();
});
