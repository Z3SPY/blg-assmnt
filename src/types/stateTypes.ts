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
    username?: string;
    bio?: string;
    avatar_url?: string;
    createdAt?: string;
}

// UserModel Validation
// Should check if this data is filled before sending



export type { SessionPayload, ProfileType, BlogType };
