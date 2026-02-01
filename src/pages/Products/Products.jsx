import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import './Products.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [currentProduct, setCurrentProduct] = useState({
        name: '',
        price: '',
        categoryId: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const res = await productService.getProducts();
            setProducts(res.data || []);
        } catch (err) {
            console.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const res = await categoryService.getCategories();
            setCategories(res.data || []);
        } catch (err) {
            console.error('Failed to load categories');
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !categoryFilter || p.categoryId === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const openModal = (product = null) => {
        if (product) {
            setCurrentProduct({
                ...product,
                price: product.price.toString()
            });
            setIsEditing(true);
        } else {
            setCurrentProduct({
                name: '',
                price: '',
                categoryId: categories.length > 0 ? categories[0].id : ''
            });
            setIsEditing(false);
        }
        setValidationErrors([]);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setValidationErrors([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Frontend validation
        const errors = [];
        if (!currentProduct.name.trim()) {
            errors.push('Product name is required');
        }
        if (currentProduct.name.length > 200) {
            errors.push('Product name must not exceed 200 characters');
        }
        const price = parseFloat(currentProduct.price);
        if (isNaN(price) || price < 0) {
            errors.push('Price must be a non-negative number');
        }
        if (price > 1000000) {
            errors.push('Price must not exceed $1,000,000');
        }
        if (!currentProduct.categoryId) {
            errors.push('Category is required');
        }

        if (errors.length > 0) {
            setValidationErrors(errors);
            return;
        }

        try {
            const productData = {
                name: currentProduct.name.trim(),
                price: parseFloat(currentProduct.price),
                categoryId: currentProduct.categoryId
            };

            if (isEditing) {
                await productService.updateProduct(currentProduct.id, productData);
            } else {
                await productService.createProduct(productData);
            }
            loadProducts();
            closeModal();
        } catch (err) {
            const backendErrors = err.response?.data?.details || [err.response?.data?.error || 'Operation failed'];
            setValidationErrors(backendErrors);
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                await productService.deleteProduct(id);
                loadProducts();
            } catch (err) {
                const errorMsg = err.response?.data?.details?.[0] || err.response?.data?.error || 'Failed to delete product';
                alert(errorMsg);
            }
        }
    };

    // Calculate stats
    const totalProducts = products.length;
    const averagePrice = products.length > 0
        ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2)
        : '0.00';
    const filteredCount = filteredProducts.length;

    if (loading && products.length === 0) {
        return (
            <div className="products-container">
                <div className="loading-state">
                    <p>Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="products-container">
            {/* Header */}
            <div className="products-header">
                <div className="products-title">
                    <h2>Product Inventory</h2>
                    <p>Manage your restaurant's menu items and pricing.</p>
                </div>
                <div className="products-controls">
                    <div className="search-wrapper">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select
                        className="category-filter"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <button className="btn-add" onClick={() => openModal()}>
                        <span>➕</span> Add Product
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="products-stats">
                <div className="stat-card">
                    <span className="stat-label">Total Products</span>
                    <span className="stat-value">{totalProducts}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Average Price</span>
                    <span className="stat-value">${averagePrice}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Showing</span>
                    <span className="stat-value">{filteredCount}</span>
                </div>
            </div>

            {/* Products Table */}
            <div className="products-table-container">
                {filteredProducts.length > 0 ? (
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th className="price-column">Price</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product.id}>
                                    <td>
                                        <span className="product-name">{product.name}</span>
                                    </td>
                                    <td>
                                        <span className={`category-badge ${product.category?.mode === 'PER_ITEM' ? 'per-item' : 'per-category'}`}>
                                            {product.category?.name || 'Unknown'}
                                        </span>
                                    </td>
                                    <td className="price-column">
                                        <span className="product-price">${product.price.toFixed(2)}</span>
                                    </td>
                                    <td>
                                        <div className="action-btns">
                                            <button className="action-btn edit" onClick={() => openModal(product)}>
                                                ✏️
                                            </button>
                                            <button className="action-btn delete" onClick={() => handleDelete(product.id, product.name)}>
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">
                        <h3>No products found</h3>
                        <p>{searchQuery || categoryFilter ? 'Try adjusting your filters.' : 'Create your first product to get started!'}</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                        </div>

                        {validationErrors.length > 0 && (
                            <div className="validation-error">
                                {validationErrors.map((err, idx) => (
                                    <div key={idx}>• {err}</div>
                                ))}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    required
                                    maxLength="200"
                                    value={currentProduct.name}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                    placeholder="e.g. Espresso Martini, Ribeye Steak"
                                />
                            </div>

                            <div className="form-group">
                                <label>Price</label>
                                <div className="price-input-wrapper">
                                    <span className="price-prefix">$</span>
                                    <input
                                        type="number"
                                        className="price-input"
                                        required
                                        min="0"
                                        max="1000000"
                                        step="0.01"
                                        value={currentProduct.price}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    required
                                    value={currentProduct.categoryId}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, categoryId: e.target.value })}
                                >
                                    <option value="">Select a category...</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name} ({cat.mode.replace('_', ' ')})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save">
                                    {isEditing ? 'Save Changes' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
