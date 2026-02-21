# 🚀 StoryStudio: Deployment Guide

This guide walks you through deploying the **StoryStudio** application in a production environment. The recommended stack is:

- **Frontend** → [Vercel](https://vercel.com) (free tier, instant Git deployments)
- **Backend** → [Render](https://render.com) (free tier, always-on web services)
- **Database** → [MongoDB Atlas](https://www.mongodb.com/atlas) (free M0 cluster)

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure the following are complete:

- [ ] All code changes are committed and pushed to GitHub (`https://github.com/Fah218/Text-to-Story-Generator.git`)
- [ ] You have a **MongoDB Atlas** cluster running and a connection string available
- [ ] You have a valid **Cohere API Key** for text generation
- [ ] You have a valid **Leonardo AI API Key** for image generation
- [ ] You have generated a secure random string for `JWT_SECRET`

---

## 🗄️ Step 1: MongoDB Atlas (Already Configured ✅)

Your MongoDB Atlas cluster is **already set up and connected** — you can confirm this from the `✅ Successfully connected to MongoDB Atlas!` message in your backend terminal.

You **do NOT need to create a new cluster**. For deployment, simply:

1. Open your local `backend/.env` file.
2. Copy the value of `MONGO_URI` — it looks like:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```
3. Paste it as the `MONGO_URI` environment variable in your Render backend service (Step 2 below).

> ⚠️ **Important:** In MongoDB Atlas, go to **Network Access** → make sure `0.0.0.0/0` (Allow Access from Anywhere) is added to the IP whitelist so Render's servers can connect to your cluster.

---

## 🟣 Step 2: Deploy the Backend on Render

1. Go to [https://render.com](https://render.com) and sign up or log in.
2. Click **New** → **Web Service**.
3. Connect your GitHub account and select the `Text-to-Story-Generator` repository.
4. Configure the service with the following settings:

   | Field        | Value                          |
   |--------------|--------------------------------|
   | **Name**     | `storystudio-backend`          |
   | **Root Directory** | `backend`                |
   | **Environment** | `Node`                      |
   | **Build Command** | `npm install`              |
   | **Start Command** | `node index.js`            |

5. Scroll down to the **Environment Variables** section and add each key one by one:

   | Key                  | Value                                    |
   |----------------------|------------------------------------------|
   | `PORT`               | `5001`                                   |
   | `MONGO_URI`          | Your MongoDB Atlas connection string     |
   | `JWT_SECRET`         | A long, random, secret string            |
   | `COHERE_API_KEY`     | Your Cohere API key                      |
   | `LEONARDO_API_KEY`   | Your Leonardo AI API key                 |

6. Scroll down to the **Advanced** section (just below Environment Variables) and configure these additional settings:

   | Advanced Setting        | Recommended Value                      |
   |-------------------------|----------------------------------------|
   | **Health Check Path**   | `/` (or `/api/health` if you have one) |
   | **Pre-Deploy Command**  | *(leave blank — no migrations needed for MongoDB)* |
   | **Auto-Deploy**         | `Yes` — re-deploys on every GitHub push |
   | **Instance Type**       | `Free` (or `Starter` for no sleep)     |

   > 📝 **About Pre-Deploy Command:** Render runs this command **before** the start command. It is useful for tasks like database migrations or seeding static assets. Since this project uses **MongoDB** (which is schema-less and does not require migrations), you can safely **leave this field blank** for now.

   > 💡 **Tip — Preventing Sleep on Free Tier:** Render's free tier spins down after 15 minutes of inactivity, causing a ~30 second cold start on the next request. To avoid this during a demo or hackathon, use a free uptime monitoring service like [UptimeRobot](https://uptimerobot.com) to ping your backend URL every 10 minutes and keep it awake.

7. Click **Create Web Service**. Render will install dependencies and start the server.
8. ✅ Once deployed, note down your backend public URL (e.g., `https://storystudio-backend.onrender.com`). You will need this for the frontend.

---

## 🔵 Step 3: Deploy the Frontend on Vercel

1. Go to [https://vercel.com](https://vercel.com) and sign up or log in with your GitHub account.
2. Click **Add New** → **Project**.
3. Import the `Text-to-Story-Generator` repository.
4. Configure the project with the following settings:

   | Field              | Value          |
   |--------------------|----------------|
   | **Framework Preset** | `Vite`       |
   | **Root Directory** | `frontend`     |
   | **Build Command**  | `npm run build`|
   | **Output Directory** | `dist`       |

5. Add the following **Environment Variables** in Vercel:

   | Key                 | Value                                                          |
   |---------------------|----------------------------------------------------------------|
   | `VITE_API_BASE_URL` | Your Render backend URL (e.g., `https://storystudio-backend.onrender.com`) |

6. Click **Deploy**. Vercel will build and deploy your frontend from the `frontend/` folder.
7. ✅ Your frontend will be live at a URL like `https://storystudio.vercel.app`.

---

## 🔗 Step 4: Connect Frontend to Backend

Ensure the `VITE_API_BASE_URL` environment variable inside Vercel is set to your Render backend URL.

In your frontend code, all API calls should reference this variable so they automatically point to the deployed backend instead of `localhost`:

```js
// Example usage in frontend code
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
```

---

## 🔄 Step 5: Enable Auto-Deployments

Both platforms support automatic deployments when you push to GitHub:

- **Vercel**: Re-deploys the frontend automatically on every push to `main`.
- **Render**: Re-deploys the backend automatically on every push to `main` (check the **Auto-Deploy** toggle in Render service settings).

This means your entire deployment pipeline is Git-driven — just push a commit and both services update on their own.

---

## ✅ Post-Deployment Verification

After deployment, verify the following on your live URLs:

- [ ] Home Page loads with all animations and images
- [ ] Sign Up and Login flow works (MongoDB connection verified)
- [ ] Story generation trigger reaches the backend and returns text + image
- [ ] Generated story cards render with chapter illustrations
- [ ] PDF export produces a downloadable file
- [ ] Story History page loads saved entries

---

## 🛟 Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend returns `CORS` errors | Add the Vercel frontend URL to your Express CORS `origin` whitelist |
| MongoDB connection fails | Double-check `MONGO_URI` env var in Render and IP whitelist in Atlas |
| Images don't load | Verify `LEONARDO_API_KEY` is correctly set in Render's environment |
| `VITE_API_BASE_URL` not working | In Vercel, re-deploy after setting the environment variable |
| Render spins up slowly | Free tier services sleep after inactivity — first request may take ~30s |
