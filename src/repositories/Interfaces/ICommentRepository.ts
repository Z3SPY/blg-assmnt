import type { commentPayload, CommentType }  from "../../types/stateTypes";


export interface ICommentRepository {
    getCommentsByBlogId(blogId: string): Promise<CommentType[]>;
    create(comment: commentPayload, imageFile: File): Promise<CommentType>;
    update(id: string, content: string,  imageFile: File): Promise<CommentType>;
    delete(id: string): Promise<void>;
}