import { mockCategories } from "../data";
import type { Category, Subcategory } from "../types";

// In a real app, this would fetch from Firestore.
// For now, we use mock data as categories are system-level.
export const getCategories = async (): Promise<(Category & { subcategories: Subcategory[] })[]> => {
    // Simulate async call
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockCategories;
}
