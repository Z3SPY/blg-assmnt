
// Running supabase Instance
import { supabase } from "../lib/supabase";


import type { BlogType } from "../types/stateTypes";
import type { IBlogRepository } from "./Interfaces/IBlogRepository";

export class BlogRepository implements IBlogRepository {

    // ===================
    // Session less views
    async getBlogById(blogId: string): Promise<BlogType> {

        const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .eq("id", blogId)
                .single()

        if (error) throw error;
        // Data handle 
        console.log(data);
        return data as BlogType;
    }


    // Get all blogs by a specific user
    async getAllBlogsById(userId: string): Promise<BlogType[]> {
        const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .eq("user_id", userId)

                if (error) throw error;
        // Data handle 
        console.log(data);
        return data as BlogType[];
    }

    
    async getAllBlogs(): Promise<BlogType[]> {

        const {data, error} = await supabase
            .from('blogs')
            .select('*');

        if (error) throw error;
        return data as BlogType[];

    }



    // ===================
    // Session Views
    async createBlog(blog: BlogType): Promise<BlogType> {
        // Validate blog
        // Supabase Insert
        const { data, error } =  await supabase
                    .from('blogs')
                    .insert(blog)
        if (error) throw error;
        console.log(data);
        return data as unknown as BlogType;
                   
    }

    
    updateBlog(id: string, blog: BlogType): Promise<BlogType> {
        throw new Error("Method not implemented.");
    }
    deleteBlog(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    
}


