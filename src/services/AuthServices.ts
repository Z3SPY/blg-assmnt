import type { IAuthServices } from "../repositories/Interfaces/IUserRepository";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import { userRepositry } from "@/repositories/UserRepository";


// Acts as a layer for connecting to Repostories
// Ill put most of the logic for chekcing here

export class AuthService implements IAuthServices {

    // Create new User
    async signUp(email: string, password: string, username: string): Promise<User> {

        // if Create here, pass some user id to user Repository
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) throw error;
        if (!data.user) throw new Error('Sign up failed');

        // If successful create an instance of profile objects
        try {
            await userRepositry.createUser(data.user.id, username);
            alert("Account created! You can now log in.");
            return data.user;
        } catch (pError) {
            console.error("Authenticaion Worked, but Profile instance failed");
            throw pError;
        }
        
    }


    // Login to User
    async signIn(email: string, password: string): Promise<User> {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        }); 

        if (error) throw error;
        if (!data.user) throw new Error('Sign in failed');

        return data.user;
    }
    
    async signOut(): Promise<void> {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }

   async getUserSession(): Promise<User | null> {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
    }

    

}


// Instance to be called
export const authService = new AuthService();