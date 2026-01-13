import type { SessionPayload } from "../state/session/session";



interface BlogType {
    id: string;
    userId: string;
    title?: string;
    content?: string;
    createdAt?: string;
}

interface ProfileType {
    id: string;
    userName?: string;
    bio?: string;
    avatarUrl?: string;
    createdAt?: string;
}

// UserModel Validation
// Should check if this data is filled before sending



export type { SessionPayload, ProfileType, BlogType };
