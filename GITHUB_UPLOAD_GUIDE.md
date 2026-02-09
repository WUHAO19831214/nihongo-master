# How to Upload to GitHub

Follow these steps to upload your project to GitHub.

### 1. Initialize Git Repository
Open your terminal in the project folder and run:

```bash
git init
git add .
git commit -m "Initial commit: Nihongo Master with AI features"
```

### 2. Create a Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Name your repository (e.g., `nihongo-master`).
3. Set visibility (Public or Private).
4. Do **not** initialize with README, .gitignore, or License (since we already have them locally).
5. Click **Create repository**.

### 3. Push to GitHub
Copy the commands shown on GitHub under "...or push an existing repository from the command line", which will look like this:

```bash
git remote add origin https://github.com/YOUR_USERNAME/nihongo-master.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Troubleshooting
- If `git init` says "Reinitialized existing Git repository", that's fine.
- If `git remote add origin` says "remote origin already exists", run `git remote set-url origin https://github.com/YOUR_USERNAME/nihongo-master.git` instead.
