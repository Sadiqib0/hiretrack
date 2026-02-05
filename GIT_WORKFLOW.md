# 🔒 Secure Git Workflow for HireTrack

## Initial Setup (IMPORTANT!)

### 1. Initialize Git Repository
```bash
cd hiretrack
git init
```

### 2. Verify .gitignore is Working
```bash
# Check what will be committed
git status

# You should NOT see:
# - .env
# - backend/.env
# - web/.env.local
# - Any files with passwords/keys

# If you see .env files, STOP and check .gitignore
```

### 3. Create Your First Commit
```bash
git add .
git commit -m "Initial commit: HireTrack project setup"
```

## Daily Workflow

### Before Each Commit
```bash
# 1. Check status
git status

# 2. Review changes
git diff

# 3. Make sure no secrets are included
git diff | grep -i "password\|secret\|key" # Should be empty

# 4. Add files
git add .

# 5. Commit
git commit -m "feat: describe your changes"
```

### Commit Message Convention
```
feat: new feature
fix: bug fix
docs: documentation changes
style: formatting, missing semicolons, etc
refactor: code restructuring
test: adding tests
chore: updating dependencies, etc
```

## Pushing to GitHub

### First Time Setup
```bash
# Create repository on GitHub first (don't initialize with README)

# Add remote
git remote add origin https://github.com/your-username/hiretrack.git

# Push
git branch -M main
git push -u origin main
```

### Regular Pushes
```bash
git push
```

## 🚨 What to Check Before Pushing

### ✅ Safe to Commit:
- Source code (.ts, .tsx, .js, etc.)
- Configuration templates (.env.example)
- Documentation (README.md, etc.)
- Docker files (docker-compose.yml, Dockerfile)
- Package files (package.json, pubspec.yaml)

### ❌ NEVER Commit:
- .env files
- .env.local
- .env.development, .env.production
- node_modules/
- Build outputs (dist/, build/, .next/)
- Database files
- API keys, passwords, secrets
- Personal data

## Emergency: Removing Secrets from Git History

If you accidentally committed secrets:

```bash
# 1. Remove the file
git rm --cached .env

# 2. Add to .gitignore if not already there
echo ".env" >> .gitignore

# 3. Commit
git add .gitignore
git commit -m "Remove .env from tracking"

# 4. For already pushed commits, you need to rewrite history
# WARNING: This is destructive!
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# 5. Force push (⚠️ coordinate with team first!)
git push origin --force --all

# 6. Rotate ALL secrets that were exposed
# - Change database passwords
# - Regenerate JWT secrets
# - Revoke and create new API keys
```

## Branch Strategy

### For Solo Development
```bash
# Work on main branch
git checkout main
git pull
# make changes
git add .
git commit -m "your message"
git push
```

### For Team Development
```bash
# Create feature branch
git checkout -b feature/add-analytics-page

# Make changes and commit
git add .
git commit -m "feat: add analytics dashboard page"

# Push branch
git push -u origin feature/add-analytics-page

# Create Pull Request on GitHub
# After review, merge to main
```

## Common Git Commands

```bash
# Check status
git status

# View history
git log --oneline

# View changes
git diff

# Undo uncommitted changes
git checkout -- <file>

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Update from remote
git pull

# View remotes
git remote -v

# Clone repository
git clone https://github.com/username/hiretrack.git
```

## Environment Variables Checklist

Before pushing, verify:

- [ ] `.env` is in `.gitignore`
- [ ] `.env` is NOT in `git status`
- [ ] `.env.example` has NO real secrets
- [ ] All secrets use environment variables
- [ ] Documentation mentions how to set up `.env`

## Setting Up Project from Git

When cloning on a new machine:

```bash
# 1. Clone
git clone https://github.com/username/hiretrack.git
cd hiretrack

# 2. Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp web/.env.example web/.env.local

# 3. Fill in your secrets
code .env
code backend/.env
code web/.env.local

# 4. Install dependencies
cd backend && npm install
cd ../web && npm install

# 5. Start development
docker-compose up -d
cd backend && npm run prisma:migrate
npm run start:dev
```

## Best Practices

1. **Commit often** - Small, focused commits are better
2. **Write clear messages** - Explain what and why
3. **Review before push** - Always check `git diff` first
4. **Pull before push** - Stay in sync with remote
5. **Never commit secrets** - Use environment variables
6. **Keep .gitignore updated** - Add new sensitive files immediately
7. **Backup .env files** - Keep them secure separately

## Questions?

- Git confused? `git status` is your friend
- Made a mistake? Don't panic, most things can be undone
- Need help? Check: https://git-scm.com/docs

---

**Remember**: Once something is pushed to GitHub, assume it's public forever. Be careful!
