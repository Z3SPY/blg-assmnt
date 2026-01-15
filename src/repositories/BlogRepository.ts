
// Running supabase Instance
import { supabase } from "../lib/supabase";


import type { BlogType } from "../types/stateTypes";
import type { IBlogRepository } from "./Interfaces/IBlogRepository";

class BlogRepository implements IBlogRepository {

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
        //console.log(data);
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
        //console.log(data);
        return data as BlogType[];
    }

    
    async getAllBlogs(page: number, pageSize = 5): Promise<{ data: BlogType[], count: number}> {

        const startVal = (page - 1) * pageSize;
        const endVal = startVal + pageSize - 1;

        const { data, error, count } = await supabase
            .from('blogs')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(startVal, endVal);

        if (error) throw error;
        return { 
            data: data as BlogType[], 
            count: count || 0 
        };

    }



    // ===================
    // Session Views
    async createBlog(blog: BlogType, blogFile: File): Promise<BlogType> {
        // Validate blog
        let urlRef = "";

        if (blogFile) {
            // This solves the duplication issue // No same naming conv
            const fileName = `${blog.id}-${Date.now()}.${blogFile.name}`
            const url = `blgPhoto/${fileName}`;

            // Store it in blog-covers
            const {error : photoError} = await supabase.storage
                .from("blog-covers")
                .upload(url, blogFile, {
                    upsert: false,
                    cacheControl: '3600'
                })
            
            if (photoError) throw photoError;

            // Then we proceed to get a reference instance
            const { data } = await supabase.storage
                .from("blog-covers")
                .getPublicUrl(url);

            
            urlRef = data.publicUrl;
        }

        const { data, error } =  await supabase
                    .from('blogs')
                    .insert({...blog, cover_path: urlRef})
                    .select()
                    .single();


        if (error) throw error;
        //console.log(data);
        return data as BlogType;
                   
    }

    
    updateBlog(id: string, blog: BlogType): Promise<BlogType> {
        throw new Error("Method not implemented.");
    }
    deleteBlog(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }



    

    
}


export const blogRepository = new BlogRepository();