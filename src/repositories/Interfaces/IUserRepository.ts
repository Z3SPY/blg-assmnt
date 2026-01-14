
import type { ProfileType } from "../../types/stateTypes";
import type { User } from "@supabase/supabase-js";


// Public Profile 
export interface IUserRepository {
    getUserById(id: string): Promise<ProfileType>;
    getAllUsers(): Promise<ProfileType[]>;
    createUser(id: string, username: string): Promise<ProfileType>;
    updateUser(id: string, user: ProfileType): Promise<ProfileType>;
    deleteUser(id: string): Promise<void>;
}

// Supabase Auth Profile
export interface IAuthServices {
    signUp(email: string,  password: string, username: string): Promise<ProfileType>;
    signIn(email: string, password: string): Promise<ProfileType>;
    signOut(): Promise<void>;
    getUserSession(): Promise<ProfileType | null>;
}
