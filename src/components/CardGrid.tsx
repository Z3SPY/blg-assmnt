import type { BlogType } from '@/types/stateTypes'
import React from 'react'
import Card from './Card';

interface listOfCards {
    blogs: BlogType[];
    limit: number;
    className?: string; 
}

function CardGrid({ blogs, limit, className = "" }: listOfCards) {
  const visibleBlogs = limit ? blogs.slice(0, limit) : blogs;

  return (
    <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {visibleBlogs.map((blog) => (
        <Card key={blog.id} blog={blog} />
      ))}
    </div>
  );
}

export default CardGrid
