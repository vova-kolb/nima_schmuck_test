// javascript
import {useCallback, useEffect, useRef, useState} from 'react';
import {fetchProducts} from '@/lib/api';

const PAGE_LIMIT = 8;

export function useProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const searchTimeoutRef = useRef(null);

    const deriveFilters = (items) => {
        setCategories(
            Array.from(new Set(items.map((p) => p.category).filter(Boolean))),
        );
        setMaterials(
            Array.from(new Set(items.map((p) => p.materials).filter(Boolean))),
        );
    };

    const loadProducts = useCallback(
        async ({
            page: nextPage = 1,
            category,
            material,
            updateFilters = false,
            name,
            sort,
            order,
        } = {}) => {
            setLoading(true);
            setError('');
            try {
                const {items, totalPages: apiTotalPages, page: apiPage} =
                    await fetchProducts({
                        category: category || undefined,
                        materials: material || undefined,
                        page: nextPage,
                        limit: PAGE_LIMIT,
                        name: name || undefined,
                        sortBy: sort || undefined,
                        order: order || undefined,
                    });

                setProducts(items);
                setPage(apiPage);
                setTotalPages(apiTotalPages || 1);

                if (updateFilters) {
                    deriveFilters(items);
                }
            } catch (e) {
                setError('Error loading products');
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    useEffect(() => {
        loadProducts({page: 1, updateFilters: true});
    }, [loadProducts]);

    const selectCategory = useCallback(
        async (value) => {
            setSelectedCategory(value);
            await loadProducts({
                page: 1,
                category: value,
                material: selectedMaterial,
                name: searchTerm.trim(),
                sort: sortBy,
                order: sortOrder,
            });
        },
        [loadProducts, searchTerm, selectedMaterial, sortBy, sortOrder],
    );

    const selectMaterial = useCallback(
        async (value) => {
            setSelectedMaterial(value);
            await loadProducts({
                page: 1,
                category: selectedCategory,
                material: value,
                name: searchTerm.trim(),
                sort: sortBy,
                order: sortOrder,
            });
        },
        [loadProducts, searchTerm, selectedCategory, sortBy, sortOrder],
    );

    const goToPage = useCallback(
        async (nextPage) => {
            if (nextPage < 1 || nextPage > totalPages) return;
            await loadProducts({
                page: nextPage,
                category: selectedCategory,
                material: selectedMaterial,
                name: searchTerm.trim(),
                sort: sortBy,
                order: sortOrder,
            });
        },
        [loadProducts, searchTerm, selectedCategory, selectedMaterial, sortBy, sortOrder, totalPages],
    );

    const nextPage = useCallback(async () => {
        await goToPage(page + 1);
    }, [goToPage, page]);

    const prevPage = useCallback(async () => {
        await goToPage(page - 1);
    }, [goToPage, page]);

    const updateSearch = useCallback(
        (value) => {
            setSearchTerm(value);
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }

            const trimmed = value.trim();
            searchTimeoutRef.current = setTimeout(() => {
                loadProducts({
                    page: 1,
                    category: selectedCategory,
                    material: selectedMaterial,
                    name: trimmed,
                    sort: sortBy,
                    order: sortOrder,
                    updateFilters: trimmed === '',
                });
            }, 400);
        },
        [loadProducts, selectedCategory, selectedMaterial, sortBy, sortOrder],
    );

    const selectSort = useCallback(
        async ({sort, order}) => {
            setSortBy(sort);
            setSortOrder(order);
            await loadProducts({
                page: 1,
                category: selectedCategory,
                material: selectedMaterial,
                name: searchTerm.trim(),
                sort,
                order,
            });
        },
        [loadProducts, searchTerm, selectedCategory, selectedMaterial],
    );

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    return {
        products,
        categories,
        materials,
        selectedCategory,
        selectedMaterial,
        searchTerm,
        sortBy,
        sortOrder,
        page,
        totalPages,
        loading,
        error,
        selectCategory,
        selectMaterial,
        nextPage,
        prevPage,
        goToPage,
        updateSearch,
        selectSort,
    };
}
