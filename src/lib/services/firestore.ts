// This file mocks a Firestore-like interface for in-memory data storage.
// In a real Firebase app, you would replace this with the actual Firebase SDK.

import { mockAccounts, mockCategories, mockTransactions, mockWorkspaces } from "../data";
import type { Account, Category, Subcategory, Transaction, Workspace } from "../types";

type CollectionData = Account | Workspace | Transaction | Category | Subcategory;

let inMemoryDb: { [key: string]: CollectionData[] } = {
    'workspaces': mockWorkspaces,
    'workspaces/ws1/accounts': mockAccounts,
    'workspaces/ws1/transactions': mockTransactions,
    'categories': mockCategories,
};

const findCollection = (path: string) => {
    if (!inMemoryDb[path]) {
        inMemoryDb[path] = [];
    }
    return inMemoryDb[path];
}

export const db = {
    collection: (path: string) => {
        const collectionData = findCollection(path);
        
        return {
            get: async () => {
                await new Promise(res => setTimeout(res, 50)); // simulate latency
                return {
                    docs: collectionData.map(doc => ({
                        id: doc.id,
                        data: () => doc,
                    })),
                };
            },
            doc: (id: string) => {
                return {
                    get: async () => {
                        await new Promise(res => setTimeout(res, 20));
                        const doc = collectionData.find(d => d.id === id);
                        return {
                            exists: !!doc,
                            data: () => doc,
                        }
                    },
                    set: async (data: any, options?: { merge: boolean }) => {
                        const index = collectionData.findIndex(d => d.id === id);
                        if (index > -1) {
                            if (options?.merge) {
                                collectionData[index] = { ...collectionData[index], ...data, updatedAt: new Date() };
                            } else {
                                collectionData[index] = { ...data, id, updatedAt: new Date() };
                            }
                        } else {
                           collectionData.push({ ...data, id, createdAt: new Date(), updatedAt: new Date() });
                        }
                    },
                    update: async (data: any) => {
                         const index = collectionData.findIndex(d => d.id === id);
                         if (index > -1) {
                             collectionData[index] = { ...collectionData[index], ...data, updatedAt: new Date() };
                         } else {
                             throw new Error("Document to update not found");
                         }
                    },
                    delete: async () => {
                        const index = collectionData.findIndex(d => d.id === id);
                        if (index > -1) {
                            collectionData.splice(index, 1);
                        }
                    }
                }
            },
            add: async (data: any) => {
                 const newId = `mock_${Math.random().toString(36).substr(2, 9)}`;
                 const newDoc = { ...data, id: newId, createdAt: new Date(), updatedAt: new Date() };
                 collectionData.push(newDoc);
                 return { id: newId };
            },
            where: (field: string, op: '==' | 'array-contains', value: any) => {
                return {
                    get: async () => {
                         await new Promise(res => setTimeout(res, 50));
                         const results = collectionData.filter(doc => {
                             const docField = (doc as any)[field];
                             if (op === '==') return docField === value;
                             return false;
                         });
                         return {
                             docs: results.map(doc => ({
                                id: doc.id,
                                data: () => doc,
                            })),
                         }
                    }
                }
            }
        }
    },
    // A helper to find a doc across multiple collections of the same type (e.g. 'accounts')
    findDoc: async (predicate: (doc: any) => boolean, collectionName: string) => {
        for (const path in inMemoryDb) {
            if (path.endsWith(collectionName)) {
                const doc = inMemoryDb[path].find(predicate);
                if (doc) return doc;
            }
        }
        return null;
    },
    clearCollection: (path: string) => {
        if (inMemoryDb[path]) {
            inMemoryDb[path] = [];
        }
    },
    reset: () => {
        inMemoryDb = {
            'workspaces': mockWorkspaces,
            'workspaces/ws1/accounts': mockAccounts,
            'workspaces/ws1/transactions': mockTransactions,
            'categories': mockCategories,
        };
    }
};

export const hasTransactionsForAccount = async (workspaceId: string, accountId: string) => {
    const transactions = findCollection(`workspaces/${workspaceId}/transactions`);
    return transactions.some(t => (t as Transaction).accountId === accountId);
}
