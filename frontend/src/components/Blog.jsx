import React from 'react';

const Blog = () => {
  return (
    <div className="min-h-screen bg-secondary dark:bg-primary p-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-primary dark:text-white">ShopWise Blog</h2>
      <div className="max-w-4xl mx-auto">
        <article className="bg-white dark:bg-[#2d2d2d] p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-2xl font-semibold text-primary dark:text-white mb-4">
            Top Fashion Trends for 2025
          </h3>
          <p className="text-gray-700 dark:text-[#b0b0b0] mb-4">
            Discover the latest trends in fashion, from stylish sneakers to elegant wristwatches. Our curated
            collection at ShopWise brings you the best in quality and style. Stay ahead of the curve with our
            exclusive products, designed to elevate your wardrobe.
          </p>
          <p className="text-gray-700 dark:text-[#b0b0b0]">
            Posted on August 7, 2025 by ShopWise Team
          </p>
        </article>
        <p className="text-center text-gray-700 dark:text-[#b0b0b0]">
          More blog posts coming soon!
        </p>
      </div>
    </div>
  );
};

export default Blog;