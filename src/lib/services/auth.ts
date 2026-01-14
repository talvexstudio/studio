import type { User } from "../types";

// This is a mock authentication service.
// In a real app, this would be replaced with Firebase Authentication.

const mockUser: User = {
    uid: 'user1',
    email: 'demo@flowledger.com',
    displayName: 'Demo User',
    photoURL: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
};

export const mockAuth = {
    currentUser: mockUser,
};
