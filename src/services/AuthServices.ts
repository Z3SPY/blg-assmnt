import type { IAuthServices } from "../repositories/Interfaces/IUserRepository";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import { userRepositry } from "@/repositories/UserRepository";
import type { ProfileType } from "@/types/stateTypes";


// Acts as a layer for connecting to Repostories
// Ill put most of the logic for chekcing here

export class AuthService implements IAuthServices {

    // ===================
    // Create new User
    async signUp(email: string, password: string, username: string): Promise<ProfileType> {

        // if Create here, pass some user id to user Repository
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) throw error;
        if (!data.user) throw new Error('Sign up failed');

        // If successful create an instance of profile objects
        try {
            // Get Context for both maybe?
            // Flow basically is 
            // (Immutable) Auth User => Profile Data
            const profileData = await userRepositry.createUser(data.user.id, username);
            alert("Account created! You can now log in.");
            return profileData; // Returned as profile Type (Note: its the one with username)
        } catch (pError) {
            console.error("Authenticaion Worked, but Profile instance failed");
            throw pError;
        }
        
    }

    // ===================
    // Login to User
    async signIn(email: string, password: string): Promise<ProfileType> {

        // just base Root Auth from supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        }); 

        if (error) throw error;
        if (!data.user) throw new Error('Sign in failed');

        // Then get profile type form user repo

        try {
            const profileData = await userRepositry.getUserById(data.user.id);
            return profileData;
        } catch (pError) {
            console.error("Unable to create a profile instance");
            throw pError;
        }

    }
    
    // ===================
    async signOut(): Promise<void> {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }

    // ===================
    async getUserSession(): Promise<ProfileType | null> {
        const { data , error } = await supabase.auth.getUser();
        if (error) throw error;

        try {
            const profileData = await userRepositry.getUserById(data.user.id);
            return profileData;
        } catch (pError) {
            console.error("Unable to create a profile instance");
            throw pError;
        }
    }

    

}


// Instance to be called
export const authService = new AuthService();