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
    async create(comment: commentPayload): Promise<CommentType> {
        const {data, error} = await supabase
            .from('comments')
            .insert(comment)
            .select()
            .single()

        if (error) throw error;
        return data;
    }

    // Update Comment
    async update(id: string, content: string): Promise<CommentType> {
        const { data, error } = await supabase
            .from('comments')
            .update({ content })
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