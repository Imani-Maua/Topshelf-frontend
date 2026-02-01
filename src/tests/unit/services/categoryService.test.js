import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { categoryService } from '../../../services/categoryService';

vi.mock('axios');

describe('categoryService Unit Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getCategories', () => {
        it('should fetch all categories', async () => {
            const mockResponse = {
                data: {
                    data: [
                        { id: '1', name: 'Steaks', mode: 'PER_CATEGORY' }
                    ]
                }
            };

            axios.get.mockResolvedValue(mockResponse);

            const result = await categoryService.getCategories();

            expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/categories');
            expect(result.data).toHaveLength(1);
            expect(result.data[0].name).toBe('Steaks');
        });
    });

    describe('createCategory', () => {
        it('should create a new category with tier rules', async () => {
            const newCategory = {
                name: 'Cocktails',
                mode: 'PER_ITEM',
                tierRules: [{ minQuantity: 5, bonusPercentage: 10 }]
            };

            const mockResponse = {
                data: {
                    success: true,
                    data: { id: '2', ...newCategory }
                }
            };

            axios.post.mockResolvedValue(mockResponse);

            const result = await categoryService.createCategory(newCategory);

            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:3000/api/categories',
                newCategory
            );
            expect(result.data.name).toBe('Cocktails');
        });
    });

    describe('updateCategory', () => {
        it('should update an existing category', async () => {
            const updates = {
                name: 'Premium Steaks',
                mode: 'PER_CATEGORY'
            };

            const mockResponse = {
                data: {
                    success: true,
                    data: { id: '1', ...updates }
                }
            };

            axios.put.mockResolvedValue(mockResponse);

            const result = await categoryService.updateCategory('1', updates);

            expect(axios.put).toHaveBeenCalledWith(
                'http://localhost:3000/api/categories/1',
                updates
            );
            expect(result.data.name).toBe('Premium Steaks');
        });
    });

    describe('deleteCategory', () => {
        it('should delete a category by ID', async () => {
            const mockResponse = {
                data: { success: true }
            };

            axios.delete.mockResolvedValue(mockResponse);

            const result = await categoryService.deleteCategory('1');

            expect(axios.delete).toHaveBeenCalledWith('http://localhost:3000/api/categories/1');
            expect(result.success).toBe(true);
        });
    });

    describe('error handling', () => {
        it('should handle network errors', async () => {
            axios.get.mockRejectedValue(new Error('Network Error'));

            await expect(categoryService.getCategories())
                .rejects.toThrow('Network Error');
        });
    });
});
