// src/pages/Home.tsx
import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiCalendar } from 'react-icons/fi';
import api from '../api';

interface AuthorDto {
  id: string;
  username: string;
  email: string;
}

interface CategoryDto {
  id: string;
  name: string;
}

interface TagDto {
  id: string;
  name: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: AuthorDto;
  category: CategoryDto;
  tags: TagDto[];
  readingTime: number;
  createdAt: string;
  updatedAt: string;
  postStatus: 'DRAFT' | 'PUBLISHED';
}

const Home = () => {
  const [activeTab, setActiveTab] = useState<string>('All Posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/api/v1/posts');
        setPosts(response.data);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setError('無法載入文章，請稍後再試');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>(posts.map((p) => p.category.name));
    return ['All Posts', ...Array.from(set)];
  }, [posts]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach((c) => {
      counts[c] = c === 'All Posts' ? posts.length : posts.filter((p) => p.category.name === c).length;
    });
    return counts;
  }, [categories, posts]);

  const filteredPosts = useMemo(() => {
    if (activeTab === 'All Posts') return posts;
    return posts.filter((p) => p.category.name === activeTab);
  }, [activeTab, posts]);

  return (
    <div className="space-y-6">
      {/* Blog Posts 卡片容器 */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="px-6 pt-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Blog Posts</h2>
        </div>

        {/* 分頁（All / Category） */}
        <div className="px-6 mt-4">
          <div className="flex gap-8 text-gray-600">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`relative pb-3 transition-colors ${
                  activeTab === cat ? 'text-blue-600' : 'hover:text-gray-900'
                }`}
              >
                {cat} ({categoryCounts[cat]})
                {activeTab === cat && (
                  <span className="absolute left-0 -bottom-[1px] h-[2px] w-full bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tag 列（示意，與設計保持簡潔） */}
        <div className="px-6 mt-4 pb-6">
          <button className="inline-flex items-center gap-2 rounded-full bg-gray-100 text-gray-700 px-4 py-2 shadow-sm">
            testtag (1)
          </button>
        </div>
      </section>

      {/* 文章卡片清單 */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">載入文章中...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              重試
            </button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            目前沒有文章
          </div>
        ) : (
          filteredPosts.map((post) => (
            <Link key={post.id} to={`/post/${post.id}`} className="block">
              <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition cursor-pointer">
                <h3 className="text-2xl font-semibold text-gray-900">{post.title}</h3>
                <p className="text-gray-500 -mt-1">
                  作者: {post.author?.name || '未知作者'}
                </p>
                <div 
                  className="text-gray-700 mt-3 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <div className="mt-5">
                  <div className="flex flex-wrap items-center text-sm text-gray-500 gap-3 mb-2">
                    <span className="inline-flex items-center gap-1">
                      <FiCalendar /> 
                      {new Date(post.createdAt).toLocaleDateString('zh-TW')}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <FiClock /> 閱讀時間: {post.readingTime || 1} 分鐘
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {post.category && (
                      <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-xs font-medium">
                        {post.category.name}
                      </span>
                    )}
                    
                    {post.tags && post.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 px-3 py-1 text-xs font-medium"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;