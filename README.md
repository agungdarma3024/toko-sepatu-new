# 👟 Wolak-Walik: Modern Full-Stack E-Commerce

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Sanity](https://img.shields.io/badge/Sanity_CMS-F03E2F?style=for-the-badge&logo=sanity&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

Wolak-Walik is a fully custom, high-performance e-commerce platform built from scratch. Designed to provide a seamless shopping experience with lightning-fast load times and a powerful headless CMS backend for easy store management.

🌐 **Live Demo:** [Masukkan Link Vercel Anda Di Sini]

---

## ✨ Key Features

- **Headless CMS Integration:** Powered by Sanity Studio. Store owners can dynamically manage products, categories, banners, and incoming orders without touching the code.
- **Advanced Multi-layered Filtering:** Real-time product filtering by category, price range, size, and color without page reloads.
- **Secure User Authentication:** Custom Login & Register system. Cart and Wishlist access is strictly protected and bound to authenticated users.
- **Seamless Checkout System:** Features auto-fill capabilities for logged-in users and a simulated OTP verification process for secure transactions.
- **Global State Management:** Smooth and interactive Shopping Cart and Wishlist functionalities handled via React Context API.
- **Responsive Design:** Fully optimized for mobile, tablet, and desktop viewing using Tailwind CSS.

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Shadcn UI components.
- **Backend & Database:** Sanity CMS (Headless CMS).
- **Deployment:** Vercel.

---

## 🚀 Getting Started (Local Development)

Follow these instructions to set up the project locally on your machine.

### Prerequisites
Make sure you have Node.js and npm installed.

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/agungdarma3024/toko-sepatu-new.git](https://github.com/agungdarma3024/toko-sepatu-new.git)

 2.  cd toko-sepatu-new

 3.  npm install


4.  Set up Environment Variables:
    Create a .env.local file in the root directory and add your Sanity project credentials:
    Cuplikan kode:
        NEXT_PUBLIC_SANITY_PROJECT_ID="your_project_id"
        NEXT_PUBLIC_SANITY_DATASET="production"
        NEXT_PUBLIC_SANITY_API_TOKEN="your_api_token"

5.  Run the development server:
    Bash
    npm run dev

6.  Open http://localhost:3000 with your browser to see the result.
    To access the Sanity Studio admin dashboard, navigate to http://localhost:3000/studio.