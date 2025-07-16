import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CalendarIcon, 
  ClockIcon, 
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';
import { blogAPI, BlogPost } from '../services/api';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  // Removed category filtering - only showing all articles
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: 9,
      };
      
      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await blogAPI.getPosts(params);
      setPosts(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Use mock data for demo
      setPosts(mockPosts);
    } finally {
      setLoading(false);
    }
  };

  // Removed fetchCategories - no longer needed

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPosts();
  };

  // Mock data for demo

  const mockPosts: BlogPost[] = Array(9).fill(null).map((_, index) => ({
    _id: `${index + 1}`,
    title: [
      'The Complete Guide to Whisky Cask Investment',
      'Understanding Single Malt vs Blended Whisky',
      'Top 5 Distilleries for Investment in 2024',
      'How Climate Affects Whisky Maturation',
      'Rare Whisky: A Growing Alternative Asset',
      'Tax Benefits of Whisky Investment',
      'Building a Diversified Whisky Portfolio',
      'The Science Behind Whisky Aging',
      'Global Whisky Market Trends 2024',
    ][index],
    slug: `post-${index + 1}`,
    excerpt: [
      'Discover the fundamentals of whisky cask investment, from selecting the right distillery to understanding market dynamics and exit strategies.',
      'Learn the key differences between single malt and blended whiskies, and how each category performs as an investment asset.',
      'Explore our analysis of the top Scottish distilleries offering the best investment potential for 2024 and beyond.',
      'Understanding how temperature, humidity, and seasonal changes impact whisky maturation is crucial for maximizing investment returns.',
      'The rare whisky market has outperformed traditional assets by 12.5% annually. Learn why collectors are driving unprecedented demand.',
      'Whisky investments can offer significant tax advantages. Discover how to structure your portfolio for optimal tax efficiency.',
      'Learn strategies for building a balanced whisky portfolio that maximizes returns while minimizing risk through diversification.',
      'Delve into the chemical processes that transform new make spirit into premium aged whisky, adding value over time.',
      'Stay ahead with our comprehensive analysis of global whisky market trends, emerging markets, and future growth projections.',
    ][index],
    featuredImage: {
      url: [
        '/images/shop-bottle-5.webp',  // Premium single malt bottle
        '/images/tfandr-whisky-barrels.webp',  // Oak whisky barrels
        '/images/shop-bottle-8.webp',  // Highland whisky bottle
        '/images/shop-daftmill-2011.webp',  // Rare Daftmill bottle
        '/images/shop-bottle-10.webp',  // Premium whisky bottle
        '/images/shop-secrets-smoke.webp',  // Smoky whisky bottle
        '/images/shop-bottle-11.webp',  // Exclusive whisky bottle
        '/images/shop-bottle-12.webp',  // Limited edition bottle
        '/images/shop-hero-image.webp',  // Hero whisky image
      ][index % 9],
      alt: 'Premium whisky and cask imagery',
    },
    category: 'whisky-investment',
    publishedAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
    readTime: 5 + (index % 3),
    author: { name: ['John Smith', 'Emma Wilson', 'Michael Chen'][index % 3] },
    tags: [],
    status: 'published',
    viewCount: 0,
    featured: false,
    createdAt: '',
    updatedAt: '',
    content: ''
  }));

  const displayPosts = posts.length > 0 ? posts : mockPosts;

  return (
    <>
      <Helmet>
        <title>Blog & Insights - ViticultWhisky</title>
        <meta 
          name="description" 
          content="Expert insights, market analysis, and education about whisky investment." 
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal to-charcoal-light" />
        <div className="relative z-10 h-full flex items-center">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="heading-1 text-white mb-6">Blog & Insights</h1>
              <p className="text-xl text-white/90">
                Stay informed with expert analysis and market insights
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-whisky-50 sticky top-20 z-30">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-full lg:w-96">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="form-input pl-12"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-charcoal/40" />
              </div>
            </form>

            {/* Category Filter - Only All Articles */}
            <div className="flex justify-center">
              <button
                className="px-6 py-3 rounded-full text-sm font-medium bg-gold text-charcoal"
              >
                All Articles
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="section bg-white">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loading-spin w-12 h-12 border-4 border-gold border-t-transparent rounded-full" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayPosts.map((post, index) => (
                  <motion.article
                    key={post._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="card group"
                  >
                    <Link to={`/blog/${post.slug}`}>
                      <div className="aspect-w-16 aspect-h-10 overflow-hidden">
                        <img
                          src={post.featuredImage?.url || 'https://via.placeholder.com/800x500'}
                          alt={post.featuredImage?.alt || post.title}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-sm text-charcoal/60 mb-3">
                          <span className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {post.readTime} min read
                          </span>
                        </div>
                        <h2 className="heading-4 text-charcoal mb-3 group-hover:text-gold transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-charcoal/70 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm text-charcoal/60">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                          </div>
                          <span className="text-gold font-semibold text-sm group-hover:text-gold-dark transition-colors">
                            Read More →
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-md bg-whisky-100 text-charcoal disabled:opacity-50 disabled:cursor-not-allowed hover:bg-whisky-200 transition-colors"
                  >
                    Previous
                  </button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-md ${
                          currentPage === page
                            ? 'bg-gold text-charcoal'
                            : 'bg-whisky-100 text-charcoal hover:bg-whisky-200'
                        } transition-colors`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-md bg-whisky-100 text-charcoal disabled:opacity-50 disabled:cursor-not-allowed hover:bg-whisky-200 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section bg-gradient-to-br from-charcoal to-charcoal-light">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="heading-2 text-white mb-4">Stay Updated</h2>
            <p className="text-white/80 mb-8">
              Get the latest whisky investment insights delivered to your inbox
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="form-input flex-1"
              />
              <button type="submit" className="btn-primary">
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Blog;