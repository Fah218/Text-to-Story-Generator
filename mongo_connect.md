# Setting up MongoDB Atlas for Authentication

To implement a complete backend for your `StoryStudio` application, you'll need a database to store user credentials (securely), manage active session states, and optionally save users' generated story outputs. 

Here is the setup process for connecting your future Node.js backend to **MongoDB Atlas** so your existing `AuthModal.jsx` (Sign In / Sign Up) UI logic actually routes correctly:

---

## 1. Create a Free Cluster on MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up/log in.
2. Under "Data Services", build a new cluster.
3. Choose the **M0 (Free)** tier.
4. Select AWS, GCP, or Azure, and the region closest to your users.
5. Provide a cluster name (e.g., `StoryStudioDB`) and click "Create".

## 2. Configure Database Access & Security

Once the cluster is provisioned:

1. **Database Access:** 
   - Wait for the overview dashboard.
   - Go to `Security > Database Access` in the left menu.
   - Click "Add New Database User".
   - Use the **Password** authentication method.
   - Enter a `username` (e.g., `StoryAdmin`) and a secure `password`. **Save this password!**
   - Provide "Read and write to any database" privileges, and add the user.

2. **Network Access:**
   - Go to `Security > Network Access` in the left menu.
   - Click "Add IP Address".
   - Select **"Allow Access from Anywhere"** (which adds `0.0.0.0/0`).
     *(Note: This is useful for development, but in production, you should restrict this strictly to your production server's IP.)*

## 3. Retrieve Your Connection String

1. Navigate back to `Deployment > Database` on your cluster overview.
2. Click the **"Connect"** button on your cluster.
3. Select **"Drivers"** underneath "Connect to your application".
4. Copy the connection string. It will look like this:
   ```
   mongodb+srv://<username>:<password>@cluster0.abc12.mongodb.net/?retryWrites=true&w=majority&appName=StoryStudio
   ```
5. Replace `<password>` with the password you specifically created in Step 2.1. (Make sure you remove the angle brackets `< >`).

## 4. Integrate into Your Backend Project (.env)

When you begin wiring the backend for StoryStudio:

1. Create a `.env` file at the root of your `backend` folder.
2. Inside that file, declare your database connection URI variable:
   ```env
   MONGO_URI=mongodb+srv://StoryAdmin:MySecretPassword123@cluster0.abc12.mongodb.net/storystudio?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   ```
   *(Notice `/storystudio` added after the `.net/` -- this tells MongoDB which specific database collection to insert into).*

3. To finish, inside your backend setup (like an `index.js`), use Mongoose to hook directly into the string:

```javascript
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Successfully connected to MongoDB Atlas!'))
.catch((error) => console.log('Database Connection Error: ', error));
```

4. Now your frontend `AuthModal.jsx` can seamlessly run `POST /api/auth/register` and store secure generated objects in your cloud deployment!
