import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { categoryService } from '../../../services/categoryService';

vi.mock('axios');

describe('categoryService unit tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getCategories should return data', async () => {
        const mockData = { data: [{ id: '1', name: 'Food' }] };
        axios.get.mockResolvedValue({ data: mockData });

        const result = await categoryService.getCategories();
        expect(result).toEqual(mockData);
    });

    it('updateCategory should send PUT request', async () => {
        const category = { id: '1', name: 'Drinks' };
        axios.put.mockResolvedValue({ data: { success: true } });

        await categoryService.updateCategory(category.id, category);
        expect(axios.put).toHaveBeenCalledWith(expect.stringContaining('/categories/1'), category);
    });
});
