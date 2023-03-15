# Development notes

## Release process

```
PUBLIC_URL=/pyggb npm run build
rsync --delete --checksum -nrtv --exclude=.git build/ pages/
# Then if that looks OK, same without "-n":
rsync --delete --checksum -rtv --exclude=.git build/ pages/
# Commit in pages/ worktree
# Push to GitHub
# Wait a few minutes
```
