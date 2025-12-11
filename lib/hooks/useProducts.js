// javascript
import {useCallback, useEffect, useRef, useState} from 'react';
import {fetchProducts, isAvailableForStorefront} from '@/lib/api';

const PAGE_LIMIT = 8;

export function useProducts({ pageSize = PAGE_LIMIT, hideUnavailable = false } = {}) {
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
    const [total, setTotal] = useState(0);
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
                const baseParams = {
                    category: category || undefined,
                    materials: material || undefined,
                    limit: pageSize,
                    name: name || undefined,
                    sortBy: sort || undefined,
                    order: order || undefined,
                };

                if (!hideUnavailable) {
                    const {
                        items,
                        totalPages: apiTotalPages,
                        page: apiPage,
                        total: apiTotal,
                    } = await fetchProducts({
                        ...baseParams,
                        page: nextPage,
                    });

                    setProducts(items);
                    setPage(apiPage);
                    setTotalPages(apiTotalPages || 1);
                    setTotal(apiTotal ?? 0);

                    if (updateFilters) {
                        deriveFilters(items);
                    }
                } else {
                    // Fetch all pages once, filter out unavailable, then paginate locally to avoid gaps.
                    let allItems = [];
                    let currentPage = 1;
                    let apiTotalPages = 1;

                    // First fetch to know total pages
                    const first = await fetchProducts({ ...baseParams, page: 1 });
                    apiTotalPages = first.totalPages || 1;
                    allItems = [...(first.items || [])];

                    while (currentPage < apiTotalPages) {
                        currentPage += 1;
                        const res = await fetchProducts({ ...baseParams, page: currentPage });
                        allItems.push(...(res.items || []));
                        apiTotalPages = res.totalPages || apiTotalPages;
                    }

                    const filtered = allItems.filter(isAvailableForStorefront);
                    const filteredTotal = filtered.length;
                    const filteredTotalPages = Math.max(1, Math.ceil(filteredTotal / pageSize));
                    const safePage = Math.min(Math.max(nextPage, 1), filteredTotalPages);
                    const start = (safePage - 1) * pageSize;
                    const pagedItems = filtered.slice(start, start + pageSize);

                    setProducts(pagedItems);
                    setPage(safePage);
                    setTotalPages(filteredTotalPages);
                    setTotal(filteredTotal);

                    if (updateFilters) {
                        deriveFilters(filtered);
                    }
                }
            } catch (e) {
                setError('Error loading products');
            } finally {
                setLoading(false);
            }
        },
        [pageSize, hideUnavailable],
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

    const reload = useCallback(async () => {
        await loadProducts({
            page,
            category: selectedCategory,
            material: selectedMaterial,
            name: searchTerm.trim(),
            sort: sortBy,
            order: sortOrder,
        });
    }, [loadProducts, page, searchTerm, selectedCategory, selectedMaterial, sortBy, sortOrder]);

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
        total,
        loading,
        error,
        selectCategory,
        selectMaterial,
        nextPage,
        prevPage,
        goToPage,
        updateSearch,
        selectSort,
        reload,
    };
}
