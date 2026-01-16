
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

    
    async getAllBlogs(page: number, pageSize = 5, searchTerm: string = ""): Promise<{ data: BlogType[], count: number}> {

        let query = supabase
        .from('blogs')
        .select('*', { count: 'exact' });

        if (searchTerm) {
            query = query.ilike('title', `%${searchTerm}%`);
        }

        const { data, count, error } = await query
            .range((page - 1) * pageSize, page * pageSize - 1)
            .order('created_at', { ascending: false });
        
        if (error) throw error;

        return { data, count: count || 0 };

    }



    // ===================
    // Session Views
    async createBlog(blog: BlogType, blogFile?: File): Promise<BlogType> {
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

    
    async updateBlog(id: string, blog: BlogType, blogFile?: File): Promise<BlogType> {
        // Validate blog
        let urlRef = blog.cover_path;

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

        const { data, error } = await supabase
                .from('blogs')
                .update({ 
                    title: blog.title, 
                    content: blog.content, 
                    cover_path: urlRef 
                })
                .eq('id', id)
                .select()
                .single();


        if (error) throw error;
        //console.log(data);
        return data as BlogType;
    }

    async deleteBlog(id: string): Promise<void> {
        const response = await supabase
            .from('blogs')
            .delete()
            .eq('id', id)

        if (response.error) throw response.error;

        return;
    }



    

    
}


export const blogRepository = new BlogRepository();