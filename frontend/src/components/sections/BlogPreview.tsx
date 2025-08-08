import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { blogAPI, BlogPost } from '../../services/api';

const BlogPreview: React.FC = () => {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demo purposes
  const mockPosts: BlogPost[] = [
    {
      _id: '1',
      title: 'The Difference Between Single Malt and Blended Whisky',
      slug: 'difference-single-malt-blended-whisky',
      excerpt: 'Understanding the key distinctions between single malt and blended whisky can help investors make informed decisions about their portfolio.',
      featuredImage: {
        url: '/whisky/hero/hero-1.webp',
        alt: 'Premium whisky distillery',
      },
      category: 'whisky-education',
      publishedAt: '2024-01-15',
      readTime: 5,
      author: { name: 'John Smith' },
      tags: [],
      status: 'published',
      viewCount: 0,
      featured: true,
      createdAt: '',
      updatedAt: '',
      content: ''
    },
    {
      _id: '2',
      title: 'How Climate Affects Whisky Maturation',
      slug: 'climate-affects-whisky-maturation',
      excerpt: 'Explore how different climates impact the maturation process and ultimately influence the value of your whisky investment.',
      featuredImage: {
        url: '/whisky/tfandr-whisky-barrels.webp',
        alt: 'Whisky barrels',
      },
      category: 'investment-guide',
      publishedAt: '2024-01-10',
      readTime: 7,
      author: { name: 'Emma Wilson' },
      tags: [],
      status: 'published',
      viewCount: 0,
      featured: true,
      createdAt: '',
      updatedAt: '',
      content: ''
    },
    {
      _id: '3',
      title: 'Why Investors Are Turning to Whisky as a Tangible Asset',
      slug: 'investors-turning-whisky-tangible-asset',
      excerpt: 'Discover why savvy investors are increasingly adding whisky to their portfolios as a hedge against market volatility.',
      featuredImage: {
        url: '/whisky/distillery.webp',
        alt: 'Rare whisky investment opportunity',
      },
      category: 'market-insights',
      publishedAt: '2024-01-05',
      readTime: 6,
      author: { name: 'Michael Chen' },
      tags: [],
      status: 'published',
      viewCount: 0,
      featured: true,
      createdAt: '',
      updatedAt: '',
      content: ''
    },
  ];

  const fetchFeaturedPosts = React.useCallback(async () => {
    try {
      const response = await blogAPI.getFeatured();
      setFeaturedPosts(response.data.data);
    } catch (error) {
      console.error('Error fetching featured posts:', error);
      // Set mock data for demo
      setFeaturedPosts(mockPosts);
    } finally {
      setLoading(false);
    }
  }, [mockPosts]);

  useEffect(() => {
    fetchFeaturedPosts();
  }, [fetchFeaturedPosts]);

  const displayPosts = featuredPosts.length > 0 ? featuredPosts : mockPosts;

  return (
    <section className="section bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="heading-2 text-charcoal mb-4">
            Latest Insights & Resources
          </h2>
          <p className="text-lg text-charcoal/70 max-w-3xl mx-auto">
            Stay informed with our expert analysis and market insights
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loading-spin w-12 h-12 border-4 border-gold border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayPosts.slice(0, 3).map((post, index) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card group"
              >
                <Link to={`/blog/${post.slug}`}>
                  <div className="aspect-w-16 aspect-h-10 overflow-hidden zoom-on-hover">
                    <img
                      src={post.featuredImage?.url || 'https://via.placeholder.com/800x500'}
                      alt={post.featuredImage?.alt || post.title}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-4 text-sm text-charcoal/60 mb-3">
                      <span className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {post.readTime} min read
                      </span>
                    </div>
                    <h3 className="heading-4 text-charcoal mb-3 group-hover:text-gold transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-charcoal/70 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <span className="inline-flex items-center text-gold font-semibold group-hover:text-gold-dark transition-colors">
                      Read More
                      <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/blog" className="btn-secondary">
            View All Articles
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogPreview;