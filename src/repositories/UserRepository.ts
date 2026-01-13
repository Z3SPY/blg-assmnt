

import type { ProfileType } from "../types/stateTypes";
import type { IUserRepository } from "./Interfaces/IUserRepository";
import { supabase } from "@/lib/supabase";

class UserRepositories implements IUserRepository {

    getUserById(id: string): Promise<ProfileType> {
        throw new Error("Method not implemented.");
    }
    getAllUsers(): Promise<ProfileType[]> {
        throw new Error("Method not implemented.");
    }
    async createUser(id: string, username: string): Promise<ProfileType> {
        // call supabase create a publkic instance
        // New instance so should be blank
        const { data, error } = await supabase
            .from("profile")
            .insert({
                id: id,
                username: username,
                bio: "",
                avatar_url: ""
            })
            .select()
            .single();

        if (error) {
            console.error("Database error:", error.message);
            throw new Error("Error Creating Profile: " + error.message);
        }
        

        return data as ProfileType
    }
    updateUser(id: string, user: ProfileType): Promise<ProfileType> {
        throw new Error("Method not implemented.");
    }
    deleteUser(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

export const userRepositry = new UserRepositories();