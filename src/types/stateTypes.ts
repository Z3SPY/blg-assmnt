import type { SessionPayload } from "../state/session/session";



interface BlogType {
    id?: string;
    user_id: string;
    title?: string;
    cover_path?: string;
    content?: string;
    created_at?: string;
}

interface ProfileType {
    id: string;
    username?: string;
    bio?: string;
    avatar_url?: string;
    created_at?: string;
}

// UserModel Validation
// Should check if this data is filled before sending



export type { SessionPayload, ProfileType, BlogType };
