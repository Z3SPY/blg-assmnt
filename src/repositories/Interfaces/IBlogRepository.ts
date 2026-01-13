import type { BlogType } from "../../types/stateTypes";

export interface IBlogRepository {
    getBlogById(id: string): Promise<BlogType>;
    getAllBlogsById(id: string): Promise<BlogType[]>;
    getAllBlogs(): Promise<BlogType[]>;
    createBlog(blog: BlogType): Promise<BlogType>;
    updateBlog(id: string, blog: BlogType): Promise<BlogType>;
    deleteBlog(id: string): Promise<void>;
}