import { db } from "./firestore";
import type { Workspace } from "../types";

const WORKSPACES_COLLECTION = 'workspaces';

export const getWorkspaces = async (userId: string): Promise<Workspace[]> => {
    const snapshot = await db.collection(WORKSPACES_COLLECTION).where('ownerUserId', '==', userId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Workspace));
}

export const saveWorkspace = async (workspaceData: Partial<Workspace>): Promise<Workspace> => {
    if (workspaceData.id) {
        const { id, ...data } = workspaceData;
        await db.collection(WORKSPACES_COLLECTION).doc(id).set(data, { merge: true });
        return { ...data, id } as Workspace;
    } else {
        const newDoc = {
            baseCurrency: 'EUR',
            ...workspaceData,
        }
        const docRef = await db.collection(WORKSPACES_COLLECTION).add(newDoc);
        return { ...newDoc, id: docRef.id } as Workspace;
    }
}
