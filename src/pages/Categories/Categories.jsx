import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import './Categories.css';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentCategory, setCurrentCategory] = useState({
        name: '',
        mode: 'PER_CATEGORY',
        tierRules: [{ minQuantity: 0, bonusPercentage: 5 }]
    });
    const [isEditing, setIsEditing] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const res = await categoryService.getCategories();
            setCategories(res.data || []);
        } catch (err) {
            console.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openModal = (category = null) => {
        if (category) {
            setCurrentCategory({
                ...category,
                tierRules: category.tierRules.map(t => ({ ...t }))
            });
            setIsEditing(true);
        } else {
            setCurrentCategory({
                name: '',
                mode: 'PER_CATEGORY',
                tierRules: [{ minQuantity: 0, bonusPercentage: 5 }]
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

    const validateTierRules = (tierRules) => {
        const errors = [];

        if (tierRules.length === 0) {
            errors.push('At least one tier rule is required');
            return errors;
        }

        // Check for duplicates
        const quantities = tierRules.map(t => t.minQuantity);
        const bonuses = tierRules.map(t => t.bonusPercentage);

        if (new Set(quantities).size !== quantities.length) {
            errors.push('Duplicate minimum quantities found');
        }

        if (new Set(bonuses).size !== bonuses.length) {
            errors.push('Duplicate bonus percentages found');
        }

        // Check strictly increasing bonuses
        const sorted = [...tierRules].sort((a, b) => a.minQuantity - b.minQuantity);
        for (let i = 1; i < sorted.length; i++) {
            if (sorted[i].bonusPercentage <= sorted[i - 1].bonusPercentage) {
                errors.push(
                    `Bonuses must strictly increase. Tier at ${sorted[i].minQuantity}+ ` +
                    `has ${sorted[i].bonusPercentage}% which is not greater than ` +
                    `the previous tier's ${sorted[i - 1].bonusPercentage}%`
                );
                break;
            }
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Parse all tier rules to numbers before validation and submission
        const sanitizedTiers = currentCategory.tierRules.map(tier => ({
            ...tier,
            minQuantity: parseInt(tier.minQuantity) || 0,
            bonusPercentage: parseInt(tier.bonusPercentage) || 0
        }));

        const errors = validateTierRules(sanitizedTiers);
        if (errors.length > 0) {
            setValidationErrors(errors);
            return;
        }

        const categoryToSave = {
            name: currentCategory.name,
            mode: currentCategory.mode,
            tierRules: sanitizedTiers
        };

        try {
            if (isEditing) {
                await categoryService.updateCategory(currentCategory.id, {
                    ...categoryToSave,
                    tierRules: categoryToSave.tierRules.map(({ id, categoryId, ...rest }) => rest)
                });
            } else {
                await categoryService.createCategory(categoryToSave);
            }
            loadCategories();
            closeModal();
        } catch (err) {
            const backendErrors = err.response?.data?.details || [err.response?.data?.error || 'Operation failed'];
            setValidationErrors(backendErrors);
        }
    };

    const handleDelete = async (id, name, productCount) => {
        if (productCount > 0) {
            alert(`Cannot delete "${name}" because it has ${productCount} associated products. Remove the products first.`);
            return;
        }

        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                await categoryService.deleteCategory(id);
                loadCategories();
            } catch (err) {
                alert(err.response?.data?.error || 'Failed to delete category');
            }
        }
    };

    const addTier = () => {
        setCurrentCategory(prev => {
            const tiers = prev.tierRules || [];
            const lastTier = tiers.length > 0
                ? tiers[tiers.length - 1]
                : { minQuantity: 0, bonusPercentage: 0 };

            return {
                ...prev,
                tierRules: [
                    ...tiers,
                    {
                        minQuantity: lastTier.minQuantity + 10,
                        bonusPercentage: lastTier.bonusPercentage + 5
                    }
                ]
            };
        });
    };

    const removeTier = (index) => {
        setCurrentCategory(prev => {
            if (prev.tierRules.length <= 1) return prev;
            return {
                ...prev,
                tierRules: prev.tierRules.filter((_, i) => i !== index)
            };
        });
    };

    const updateTier = (index, field, value) => {
        // Allow empty string so users can clear the input while typing
        const newValue = value === '' ? '' : parseInt(value);

        setCurrentCategory(prev => {
            const newTiers = prev.tierRules.map((tier, i) => {
                if (i !== index) return tier;
                return {
                    ...tier,
                    [field]: field === 'bonusPercentage' && newValue !== '' ? Math.max(1, newValue) : newValue
                };
            });
            return { ...prev, tierRules: newTiers };
        });
    };

    if (loading && categories.length === 0) {
        return (
            <div className="categories-container">
                <div className="loading-state">
                    <p>Loading categories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="categories-container">
            {/* Header */}
            <div className="categories-header">
                <div className="categories-title">
                    <h2>Product Categories</h2>
                    <p>Manage bonus tier structures for your product categories.</p>
                </div>
                <div className="categories-controls">
                    <div className="search-wrapper">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search categories..."
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="btn-add" onClick={() => openModal()}>
                        <span>➕</span> Add Category
                    </button>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="categories-grid">
                {filteredCategories.length > 0 ? (
                    filteredCategories.map(category => (
                        <div className="category-card" key={category.id}>
                            <div className="category-header">
                                <div>
                                    <h3 className="category-name">{category.name}</h3>
                                    <span className={`mode-badge ${category.mode === 'PER_ITEM' ? 'per-item' : 'per-category'}`}>
                                        {category.mode.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>

                            <p className="product-count">
                                {category.products?.length || 0} product{category.products?.length !== 1 ? 's' : ''}
                            </p>

                            <div className="tier-ladder">
                                <div className="tier-ladder-title">Bonus Tiers</div>
                                <div className="tier-steps">
                                    {category.tierRules
                                        .sort((a, b) => a.minQuantity - b.minQuantity)
                                        .map((tier, idx) => (
                                            <div className="tier-step" key={idx}>
                                                <span className="tier-quantity">{tier.minQuantity}+</span>
                                                <span className="tier-arrow">→</span>
                                                <span className="tier-bonus">{tier.bonusPercentage}%</span>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            <div className="category-actions">
                                <button className="action-btn edit" title="Edit Category" onClick={() => openModal(category)}>
                                    ✏️
                                </button>
                                <button
                                    className="action-btn delete"
                                    title="Delete Category"
                                    onClick={() => handleDelete(category.id, category.name, category.products?.length || 0)}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <h3>No categories found</h3>
                        <p>{searchQuery ? 'Try adjusting your search.' : 'Create your first category to get started!'}</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{isEditing ? 'Edit Category' : 'Create New Category'}</h3>
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
                                <label>Category Name</label>
                                <input
                                    type="text"
                                    required
                                    value={currentCategory.name}
                                    onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                                    placeholder="e.g. Cocktails, Steaks, Desserts"
                                />
                            </div>

                            <div className="form-group">
                                <label>Calculation Mode</label>
                                <div className="mode-selector">
                                    <div
                                        className={`mode-option ${currentCategory.mode === 'PER_ITEM' ? 'selected' : ''}`}
                                        onClick={() => setCurrentCategory({ ...currentCategory, mode: 'PER_ITEM' })}
                                    >
                                        <div className="mode-option-title">Per Item</div>
                                        <div className="mode-option-desc">Each item counts individually</div>
                                    </div>
                                    <div
                                        className={`mode-option ${currentCategory.mode === 'PER_CATEGORY' ? 'selected' : ''}`}
                                        onClick={() => setCurrentCategory({ ...currentCategory, mode: 'PER_CATEGORY' })}
                                    >
                                        <div className="mode-option-title">Per Category</div>
                                        <div className="mode-option-desc">Total items in category</div>
                                    </div>
                                </div>
                            </div>

                            <div className="tier-rules-section">
                                <div className="tier-rules-header">
                                    <h4>Bonus Tiers</h4>
                                    <button type="button" className="btn-add-tier" onClick={addTier}>
                                        + Add Tier
                                    </button>
                                </div>

                                {currentCategory.tierRules.map((tier, index) => (
                                    <div className="tier-rule-row" key={index}>
                                        <div className="tier-input-group">
                                            <label htmlFor={`minQuantity-${index}`}>Min Quantity</label>
                                            <input
                                                id={`minQuantity-${index}`}
                                                type="number"
                                                min="0"
                                                required
                                                value={tier.minQuantity}
                                                onChange={(e) => updateTier(index, 'minQuantity', e.target.value)}
                                                placeholder="0"
                                            />
                                        </div>
                                        <div className="tier-input-group">
                                            <label htmlFor={`bonusPercentage-${index}`}>Bonus %</label>
                                            <input
                                                id={`bonusPercentage-${index}`}
                                                type="number"
                                                min="1"
                                                max="100"
                                                required
                                                value={tier.bonusPercentage}
                                                onChange={(e) => updateTier(index, 'bonusPercentage', e.target.value)}
                                                placeholder="5"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className="btn-remove-tier"
                                            onClick={() => removeTier(index)}
                                            disabled={currentCategory.tierRules.length === 1}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save">
                                    {isEditing ? 'Save Changes' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
