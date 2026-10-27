// app/blog/page.tsx
import api from '@/app/lib/api';

import Link from 'next/link';

export default async function Blog() {
  const res = await api.get('/api/blog-posts', { params: { populate: '*' } });
  const posts = res.data.data;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post: any) => (
          <Link
            key={post.id}
            href={`/blog/${post.attributes.slug}`}
            className="border p-4 rounded hover:shadow"
          >
            {post.attributes.coverImage?.data?.attributes?.url && (
              <img
                src={post.attributes.coverImage.data.attributes.url}
                alt={post.attributes.title}
                className="rounded mb-2"
              />
            )}
            <h2 className="text-xl font-bold">{post.attributes.title}</h2>
            <p>{post.attributes.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
