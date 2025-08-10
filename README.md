# ShopWise E-Commerce Platform

ShopWise is a modern e-commerce web application built with React, Node.js, Express, and PostgreSQL. It allows users to browse products, manage a cart, checkout, track orders, and get AI-powered clothing recommendations for budget-friendly shopping. The platform is designed to provide a seamless shopping experience with a professional UI and robust backend.

## Features

- **Product Browsing**: View a curated list of products with details like price and description.
- **Cart Management**: Add/remove items to/from the cart and proceed to checkout.
- **Order Tracking**: Track order status and print receipts.
- **User Authentication**: Register, login, forgot password, and reset password functionalities.
- **AI Recommendations**: Get personalized clothing suggestions under a specified budget (e.g., $20) using an AI model (LLaMA 3.1 via OpenRouter API).
- **Admin Dashboard**: Manage products and orders (for authenticated admin users).
- **Responsive Design**: Tailwind CSS ensures a mobile-friendly interface.
- **Blog**: Share fashion tips and updates.

## Tech Stack

- **Frontend**: React, React Router, Tailwind CSS, Axios, React Toastify
- **Backend**: Node.js, Express, PostgreSQL
- **API**: OpenRouter AI for clothing recommendations
- **Database**: PostgreSQL with tables for users, products, orders, and cart
- **Authentication**: JWT-based authentication

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Git
- OpenRouter API key (sign up at [openrouter.ai](https://openrouter.ai))

### Installation

1. **Clone the Repository**:
   ```bash
   git clone <your-repo-url>
   cd ShopWise