

import type { ProfileType } from "../types/stateTypes";
import type { IUserRepository } from "./Interfaces/IUserRepository";
import { supabase } from "@/lib/supabase";

class UserRepositories implements IUserRepository {

    // ===================
    // GET USERS BY ID
    async getUserById(id: string): Promise<ProfileType> {
        const {data, error} = await supabase
            .from("profile")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw new Error(`User could not be found: ${error.message}` )
        return data as ProfileType
    }

    // ===================
    // GET ALL USERS
    async getAllUsers(): Promise<ProfileType[]> {
        const {data, error} = await supabase
            .from("profile")
            .select("*");
        
        if (error) throw error;
        return data as ProfileType[];
    }

    // ===================
    // CREATE USER PROFILE
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

    // ===================
    // UPDATE USER PROFILE
    async updateUser(id: string, user: ProfileType): Promise<ProfileType> {
        const {data, error} = await supabase
            .from("profile")
            .update(user)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data as ProfileType;
    }

    // ===================
    // DELETE USER PROFILE
    async  deleteUser(id: string): Promise<void> {
        const { error } = await supabase
            .from("profile")
            .delete()
            .eq("id", id);
        if (error) throw error;
    }
}

export const userRepositry = new UserRepositories();