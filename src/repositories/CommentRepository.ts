import { supabase } from "@/lib/supabase";
import type { ICommentRepository } from "./Interfaces/ICommentRepository";
import type { commentPayload, CommentType } from "@/types/stateTypes";

class CommentRepository implements ICommentRepository {

    // Get Comments
    async getCommentsByBlogId(blogId: string): Promise<CommentType[]> {
        
        const { data, error } = await supabase
            .from("comments")
            .select('*')
            .eq('blog_id', blogId)
            .order('created_at', {ascending: false});
        
        if (error) throw error;
        return data || [];
        
    }

    // Create Comment
    async create(comment: commentPayload, imageFile?: File): Promise<CommentType> {
        let urlRef  = "";

        if (imageFile) {
            const fileName = `${comment.blog_id}-${Date.now()}.${comment.user_id}` 
            const url = `blgPhoto/${fileName}`;

            // Store it in blog-covers
            const {error : photoError} = await supabase.storage
                .from("blog-covers")
                .upload(url, imageFile, {
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

        const {data, error} = await supabase
            .from('comments')
            .insert({...comment, image_url: urlRef})
            .select()
            .single()

        if (error) throw error;
        return data;
    }

    // Update Comment
    async update(id: string, content: string, imageFile?: File): Promise<CommentType> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateData: any = { content };

        if (imageFile) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `update-${id}-${Date.now()}.${fileExt}`;
            const path = `comment-images/${fileName}`;

            const { error: photoError } = await supabase.storage
                .from("blog-covers")
                .upload(path, imageFile);

            if (photoError) throw photoError;

            const { data: urlData } = supabase.storage
                .from("blog-covers")
                .getPublicUrl(path);
            
            updateData.image_url = urlData.publicUrl;
        }



        const { data, error } = await supabase
            .from('comments')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Delete
    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

}

export const commentRepository = new CommentRepository();