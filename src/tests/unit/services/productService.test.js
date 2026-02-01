import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { productService } from '../../../services/productService';

vi.mock('axios');

describe('productService Unit Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getProducts', () => {
        it('should fetch all products', async () => {
            const mockResponse = {
                data: {
                    data: [
                        { id: '1', name: 'Wagyu Ribeye', price: 15000, categoryId: 'cat1' }
                    ]
                }
            };

            axios.get.mockResolvedValue(mockResponse);

            const result = await productService.getProducts();

            expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/products');
            expect(result.data).toHaveLength(1);
        });
    });

    describe('getProductById', () => {
        it('should fetch a single product by ID', async () => {
            const mockResponse = {
                data: {
                    data: { id: '1', name: 'Wagyu Ribeye', price: 15000 }
                }
            };

            axios.get.mockResolvedValue(mockResponse);

            const result = await productService.getProductById('1');

            expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/products/1');
            expect(result.data.name).toBe('Wagyu Ribeye');
        });
    });

    describe('createProduct', () => {
        it('should create a new product', async () => {
            const newProduct = {
                name: 'Salmon Fillet',
                price: 8000,
                categoryId: 'cat2',
                bonusEligible: true
            };

            const mockResponse = {
                data: {
                    success: true,
                    data: { id: '2', ...newProduct }
                }
            };

            axios.post.mockResolvedValue(mockResponse);

            const result = await productService.createProduct(newProduct);

            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:3000/api/products',
                newProduct
            );
            expect(result.data.name).toBe('Salmon Fillet');
        });
    });

    describe('updateProduct', () => {
        it('should update an existing product', async () => {
            const updates = {
                name: 'Premium Wagyu Ribeye',
                price: 18000
            };

            const mockResponse = {
                data: {
                    success: true,
                    data: { id: '1', ...updates }
                }
            };

            axios.put.mockResolvedValue(mockResponse);

            const result = await productService.updateProduct('1', updates);

            expect(axios.put).toHaveBeenCalledWith(
                'http://localhost:3000/api/products/1',
                updates
            );
            expect(result.data.price).toBe(18000);
        });
    });

    describe('deleteProduct', () => {
        it('should delete a product by ID', async () => {
            const mockResponse = {
                data: { success: true }
            };

            axios.delete.mockResolvedValue(mockResponse);

            const result = await productService.deleteProduct('1');

            expect(axios.delete).toHaveBeenCalledWith('http://localhost:3000/api/products/1');
            expect(result.success).toBe(true);
        });
    });

    describe('error handling', () => {
        it('should handle API errors', async () => {
            axios.get.mockRejectedValue(new Error('API Error'));

            await expect(productService.getProducts())
                .rejects.toThrow('API Error');
        });
    });
});
