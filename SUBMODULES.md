# Working with Git Submodules

This project uses Git submodules to share code between different LMSCloud plugins. If you're new to submodules, this guide will help you understand how to work with them.

## What are Git Submodules?

Git submodules allow you to keep a Git repository as a subdirectory of another Git repository. This lets us share common code (like utility functions) across multiple plugins while maintaining a single source of truth.

## Submodules in this Project

This plugin uses the following submodules:

- **`Koha/Plugin/Com/LMSCloud/Util/`** - Shared utility modules
  - Repository: <https://github.com/lmscloudpauld/koha-plugin-lmscloud-util>
  - Contains: Pages.pm, MigrationHelper.pm, I18N.pm

## Initial Setup

When you first clone this repository, the submodule directories will be empty. You need to initialize and fetch them:

```bash
# Clone the repository
git clone https://github.com/LMSCloud/LMSEventManagement.git
cd LMSEventManagement

# Initialize and fetch all submodules
git submodule update --init --recursive
```

### Alternative: Clone with Submodules

You can clone the repository and initialize submodules in one command:

```bash
git clone --recurse-submodules https://github.com/LMSCloud/LMSEventManagement.git
```

## Daily Workflow

### Pulling Updates

When you pull updates to the main repository, submodules are not automatically updated. You need to update them explicitly:

```bash
# Pull main repository changes
git pull

# Update submodules to the commit referenced by the main repository
git submodule update --recursive
```

### Making Changes to Submodules

**Important**: Submodules have their own Git repository. Changes to submodule files must be committed in the submodule's repository, not the main repository.

#### Step 1: Navigate to the Submodule

```bash
cd Koha/Plugin/Com/LMSCloud/Util
```

#### Step 2: Make Your Changes and Commit

```bash
# Make changes to files
vim Pages.pm

# Commit in the submodule repository
git add Pages.pm
git commit -m "fix: improve error handling in Pages.pm"
git push origin main
```

#### Step 3: Update Main Repository Reference

```bash
# Go back to main repository root
cd ../../../../../

# The main repository now sees the submodule has new commits
git status
# Output: modified:   Koha/Plugin/Com/LMSCloud/Util (new commits)

# Stage the submodule update
git add Koha/Plugin/Com/LMSCloud/Util

# Commit the new submodule reference
git commit -m "chore: update Util submodule"
git push
```

### Checking Submodule Status

```bash
# See the status of all submodules
git submodule status

# See if submodules have uncommitted changes
git status
```

## Common Issues and Solutions

### Issue: Submodule directory is empty

**Solution**: Initialize and update submodules

```bash
git submodule update --init --recursive
```

### Issue: "You are in 'detached HEAD' state" when in submodule

This is normal! Submodules are checked out at specific commits, not on a branch. If you want to make changes:

```bash
cd Koha/Plugin/Com/LMSCloud/Util
git checkout main  # or whatever branch you want to work on
# Make your changes and commit as described above
```

### Issue: Submodule changes not showing up after pull

**Solution**: Update submodules after pulling

```bash
git pull
git submodule update --recursive
```

### Issue: Accidentally committed changes in main repo instead of submodule

**Solution**: The main repository only tracks the commit reference, not file changes. You need to commit in the submodule:

```bash
# Unstage from main repo
git restore --staged Koha/Plugin/Com/LMSCloud/Util

# Go to submodule and commit there
cd Koha/Plugin/Com/LMSCloud/Util
git add .
git commit -m "your changes"
git push

# Then update the reference in main repo
cd ../../../../../
git add Koha/Plugin/Com/LMSCloud/Util
git commit -m "chore: update Util submodule"
```

## Best Practices

1. **Always update submodules after pulling**: Get in the habit of running `git submodule update --recursive` after `git pull`

2. **Keep submodule changes separate**: Don't mix submodule updates with other changes in the same commit

3. **Push submodule changes first**: When you've made changes to a submodule, push those changes before updating the reference in the main repository

4. **Document breaking changes**: If you make breaking changes to shared utilities, coordinate with other plugins using them

5. **Test across plugins**: When modifying shared code, test it in all plugins that use it

## Quick Reference

```bash
# Initialize submodules (first time)
git submodule update --init --recursive

# Update submodules (after git pull)
git submodule update --recursive

# Clone with submodules in one command
git clone --recurse-submodules <repository-url>

# See submodule status
git submodule status

# Make changes in submodule
cd <submodule-path>
git checkout main
# ... make changes ...
git add .
git commit -m "..."
git push
cd <back-to-main-repo>
git add <submodule-path>
git commit -m "chore: update submodule"
```

## Further Reading

- [Git Submodules Documentation](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [GitHub: Working with Submodules](https://github.blog/2016-02-01-working-with-submodules/)
