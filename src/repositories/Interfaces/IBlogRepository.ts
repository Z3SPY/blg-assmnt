import type { BlogType } from "../../types/stateTypes";

export interface IBlogRepository {
    getBlogById(id: string): Promise<BlogType>;
    getAllBlogsById(id: string): Promise<BlogType[]>;
    getAllBlogs(page: number, pageSize : number, searchTerm: string): Promise<{ data: BlogType[], count: number}>;
    createBlog(blog: BlogType, coverFile?: File): Promise<BlogType>;

    updateBlog(id: string, blog: BlogType, blogFile: File): Promise<BlogType>;
    deleteBlog(id: string): Promise<void>;


}