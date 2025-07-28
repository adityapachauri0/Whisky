import React, { useState, useEffect } from 'react';
import logger from '../utils/logger';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CalendarIcon, 
  ClockIcon, 
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';
import { blogAPI, BlogPost } from '../services/api';
import blogPostsData from '../data/blogPosts';
import SchemaMarkup from '../components/common/SchemaMarkup';

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
      logger.error('Error fetching posts:', error);
      // Use rich blog data
      const filteredPosts = searchQuery 
        ? blogPostsData.filter(post => 
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
          )
        : blogPostsData;
      
      // Implement pagination
      const startIndex = (currentPage - 1) * 9;
      const endIndex = startIndex + 9;
      setPosts(filteredPosts.slice(startIndex, endIndex));
      setTotalPages(Math.ceil(filteredPosts.length / 9));
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

  const displayPosts = posts;

  return (
    <>
      <Helmet>
        <title>Whisky Investment Blog & Expert Insights | Market Analysis | ViticultWhisky</title>
        <meta 
          name="description" 
          content="Expert whisky investment insights, market analysis, and educational articles. Learn about cask investment, distillery guides, and market trends from industry experts." 
        />
        <meta name="keywords" content="whisky investment blog, whisky market analysis, cask investment insights, whisky industry news, Scottish whisky investment guide" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://viticultwhisky.co.uk/blog" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Whisky Investment Blog & Expert Insights | Market Analysis" />
        <meta property="og:description" content="Expert whisky investment insights, market analysis, and educational articles from industry professionals." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://viticultwhisky.co.uk/blog" />
        <meta property="og:image" content="https://viticultwhisky.co.uk/whisky/blog/viticult_whisky_cask_investment32.webp" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Whisky Investment Blog & Expert Insights" />
        <meta name="twitter:description" content="Expert whisky investment insights and market analysis from industry professionals." />
        <meta name="twitter:image" content="https://viticultwhisky.co.uk/whisky/blog/viticult_whisky_cask_investment32.webp" />
        
        {/* Additional SEO */}
        <meta name="article:section" content="Investment" />
        <meta name="article:tag" content="Whisky Investment" />
        <meta name="article:tag" content="Cask Investment" />
        <meta name="article:tag" content="Scottish Whisky" />
      </Helmet>

      {/* Schema Markup for Blog Page */}
      <SchemaMarkup type="website" />
      <SchemaMarkup 
        type="breadcrumb" 
        data={{
          breadcrumbs: [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://viticultwhisky.co.uk"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Blog",
              "item": "https://viticultwhisky.co.uk/blog"
            }
          ]
        }}
      />
      <SchemaMarkup 
        type="article" 
        data={{
          title: "Whisky Investment Blog & Expert Insights",
          description: "Expert whisky investment insights, market analysis, and educational articles. Learn about cask investment, distillery guides, and market trends from industry experts.",
          image: "https://viticultwhisky.co.uk/whisky/blog/viticult_whisky_cask_investment32.webp",
          author: "ViticultWhisky Expert Team",
          datePublished: new Date().toISOString(),
          dateModified: new Date().toISOString(),
          url: "https://viticultwhisky.co.uk/blog",
          keywords: "whisky investment blog, whisky market analysis, cask investment insights, whisky industry news, Scottish whisky investment guide",
          wordCount: 2000
        }}
      />

      {/* Hero Section */}
      <section className="relative h-screen min-h-[800px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center hero-zoom"
          style={{ backgroundImage: 'url(/whisky/blog/viticult_whisky_cask_investment32.webp)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal/80 via-charcoal/70 to-charcoal-light/80" />
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