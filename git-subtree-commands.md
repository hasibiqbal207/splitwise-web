# Git Subtree Commands

## Pull Updates from Subtree Repo

### With squash:
```bash
git subtree pull --prefix=frontend splitwise-frontend main --squash
```

### Without squash:
```bash
git subtree pull --prefix=frontend splitwise-frontend main
```

**Note:** Use this when changes have been made in the original repo and you want to update your main repo's subtree.

## Push Changes Back to Original Repo (if allowed)

### With squash:
```bash
git subtree push --prefix=frontend splitwise-frontend main
```
Only works if your local history can be pushed (you can't undo the squash!).

### Without squash:
```bash
git subtree push --prefix=frontend splitwise-frontend main
```

**Recommended** if you added commits without squash, preserving full commit history.
