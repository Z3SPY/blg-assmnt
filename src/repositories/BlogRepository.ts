
// Running supabase Instance
import { supabase } from "../lib/supabase";


import type { BlogType } from "../types/stateTypes";
import type { IBlogRepository } from "./Interfaces/IBlogRepository";

export class BlogRepository implements IBlogRepository {

    // ===================
    // Session less views
    async getBlogById(id: string): Promise<BlogType> {

        try {
            const { data, error } = await supabase
                    .from('blogs')
                    .select('*')
                    .eq("id", id)
                    .single()

            if (error) throw error;

            // Data handle 
            console.log(data);
            return data as BlogType;

        } catch (error) {
            console.log("ERROR getBlogById: ", error);
            throw new Error("Method not implemented.");
        }
        
    }

    
    getAllBlogs(): Promise<BlogType[]> {



        throw new Error("Method not implemented.");
    }



    // ===================
    // Session Views
    async createBlog(blog: BlogType): Promise<BlogType> {


        // Validate blog

        // Supabase Insert
        try {
            const { data, error } =  await supabase
                        .from('blogs')
                        .insert(blog)

            if (error) throw error;

            console.log(data);
            return data as unknown as BlogType;
                    
        } catch (error) {
            console.log("ERROR creatingBlog: ", error);
            throw new Error("Method not implemented.");
        }
    }

    
    updateBlog(id: string, blog: BlogType): Promise<BlogType> {
        throw new Error("Method not implemented.");
    }
    deleteBlog(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    
}


