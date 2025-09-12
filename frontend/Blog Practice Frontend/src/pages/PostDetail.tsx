import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiHome } from 'react-icons/fi';
import api from '../api';

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  category: {
    id: string;
    name: string;
  };
  tags: Array<{
    id: string;
    name: string;
  }>;
  readingTime: number;
  createdAt: string;
  updatedAt: string;
  postStatus: 'DRAFT' | 'PUBLISHED';
}

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/api/v1/posts/${id}`);
        setPost(response.data);
      } catch (err) {
        setError('無法載入文章，請稍後再試');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    } else {
      setError('找不到文章 ID');
      setLoading(false);
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">錯誤！</strong>
          <span className="block sm:inline"> {error || '找不到該文章'}</span>
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 mr-2"
          >
            <FiArrowLeft className="mr-2" /> 返回上一頁
          </button>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <FiHome className="mr-2" /> 回到首頁
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 導航按鈕 */}
      <div className="flex justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          <FiArrowLeft className="mr-2" /> 返回
        </button>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <FiHome className="mr-2" /> 回到首頁
        </Link>
      </div>

      {/* 文章內容 */}
      <article className="bg-white rounded-lg shadow-md p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
          <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4 mb-4">
            <span>作者: {post.author?.name || '未知作者'}</span>
            <span>發布時間: {formatDate(post.createdAt)}</span>
            <span>閱讀時間: {post.readingTime || 1} 分鐘</span>
            {post.updatedAt !== post.createdAt && (
              <span className="text-xs text-gray-400">(最後更新: {formatDate(post.updatedAt)})</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {post.category && (
              <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-sm font-medium">
                {post.category.name}
              </span>
            )}
            {post.tags?.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 px-3 py-1 text-sm font-medium"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </header>

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
};

export default PostDetail;
