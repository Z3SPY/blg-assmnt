import type { commentPayload, CommentType }  from "../../types/stateTypes";


export interface ICommentRepository {
    getCommentsByBlogId(blogId: string): Promise<CommentType[]>;
    create(comment: commentPayload): Promise<CommentType>;
    update(id: string, content: string): Promise<CommentType>;
    delete(id: string): Promise<void>;
}