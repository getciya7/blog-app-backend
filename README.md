# **Blog Platform**

The Blog Platform is a full-stack web application that allows users to create, publish, update, delete, and view blog posts. Users can engage with blog posts by commenting, liking, and sharing them on social media. The platform features secure user authentication, role-based access control, image storage using Cloudinary, password reset functionality, and a responsive design using Tailwind CSS for an optimal user experience across all devices.

## **Features**

- User authentication with JWT and Bcryptjs.
- Forgot password and reset password functionality.
- Image storage using Cloudinary.
- Create, read, update, and delete blog posts.
- Comment, share and like blog posts.
- Responsive design with Tailwind CSS.
- Role-based access control.

## **Tech Stack**

- **Frontend:**

  - React.js
  - Tailwind CSS
  - React Router
  - Formik
  - Yup
  - Axios

- **Backend:**

  - Node.js
  - Express.js
  - MongoDB
  - JWT (JSON Web Tokens)
  - Bcryptjs
  - Cloudinary

- **Deployment:**
  - Frontend: Netlify
  - Backend: Render

## **Deployment Links**

- **Frontend:** [Netlify Deployment](https://getciya7-blog-app.netlify.app/)
- **Backend:** [Render Deployment](https://blog-app-backend-zo7g.onrender.com)

## **Installation Instructions**

### **Frontend Setup**

1. Clone the frontend repository:

   ```bash
   git clone https://github.com/getciya7/blog--app-frontend
   ```

2. Navigate to the project directory:

   ```bash
   cd blog--app-frontend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`.

### **Backend Setup**

1. Clone the backend repository:

   ```bash
   git clone https://github.com/getciya7/blog-app-backend
   ```

2. Navigate to the project directory:

   ```bash
   cd blog-app-backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root of the project and add your environment variables:

   ```bash
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   EMAIL_SERVICE=your_email_service_provider
   EMAIL_USER=your_email_username
   EMAIL_PASS=your_email_password
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:5000`.

## **Usage**

### **Frontend**

- **Login/Register:** Users can register and log in to the platform.
- **Forgot/Reset Password:** Users can request a password reset link if they forget their password and reset it using the link sent to their email.
- **Dashboard:** Authenticated users can view, create, edit, and delete their blog posts.
- **Blog Posts:** All users can view blog posts. Logged-in users can comment on and like posts.
- **Upload Images:** Users can upload images for their blog posts, which are stored on Cloudinary.
- **Responsive Design:** The application is fully responsive and styled with Tailwind CSS to work on all device sizes.

### **Backend**

- **Authentication:** JWT-based authentication is used to secure API routes.
- **Password Reset:** Password reset functionality implemented using a token-based system sent via email.
- **Image Storage:** Cloudinary is used for storing and managing images uploaded by users.
- **CRUD Operations:** Users can perform create, read, update, and delete operations on their blog posts.
- **Role-Based Access Control:** Middleware is implemented to manage user permissions.

## **API Endpoints**

### **Authentication**

- **POST** `/api/auth/register`: Register a new user.
- **POST** `/api/auth/login`: Log in a user and receive a token.
- **POST** `/api/auth/forgot-password`: Send a password reset link to the user's email.
- **POST** `/api/auth/reset-password`: Reset the user's password using the token sent via email.

### **Blog Posts**

- **GET** `/api/posts`: Get all blog posts.
- **GET** `/api/posts/:id`: Get a specific blog post by ID.
- **POST** `/api/posts`: Create a new blog post (requires authentication).
- **PUT** `/api/posts/:id`: Update a specific blog post by ID (requires authentication).
- **DELETE** `/api/posts/:id`: Delete a specific blog post by ID (requires authentication).
- **POST** `/api/posts/:id/upload-image`: Upload an image to a blog post (requires authentication).

### **Comments**

- **POST** `/api/comments/create`: Add a comment to a specific post (requires authentication).
- **GET** `/api/comments/post/:id`: Get all comments for a specific post.
- **DELETE** `/api/comments/:id`: Delete comment on specific post (requires authentication).
- **PUT** `api/comments/:id`: Update comment on specific post (requires authentication).

### **LIke**

- **POST** `/api/posts/:id/like`: Add a like on post (requires authentication).
- **PUT** `/api/posts/:id/unlike`: Remove like on post (requires authentication).
