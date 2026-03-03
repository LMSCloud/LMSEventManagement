# Working with Git Submodules

This project uses a Git submodule to share utility code across LMSCloud plugins while keeping each plugin fully self-contained.

## Architecture

```
vendor/koha-plugin-lmscloud-util/          # submodule (source of truth)
    I18N.pm
    MigrationHelper.pm
    Pages.pm

tools/sync_util.sh                         # copies + rewrites namespace

Koha/Plugin/Com/LMSCloud/EventManagement/Util/   # generated output (committed)
    I18N.pm            # package ...::EventManagement::Util::I18N
    MigrationHelper.pm # package ...::EventManagement::Util::MigrationHelper
    Pages.pm           # package ...::EventManagement::Util::Pages
```

The submodule lives under `vendor/` instead of inside the `Koha/` tree. A build-time sync script (`tools/sync_util.sh`) copies the `.pm` files into the plugin's own namespace and rewrites all `package` declarations. The generated files are committed to the repo so the build is always reproducible.

This means:
- Each plugin ships its own copy of the Util modules under its own namespace
- Installing one plugin's `.kpz` via the Koha UI cannot overwrite another plugin's files
- The submodule remains the single source of truth for shared code

## Initial Setup

```bash
git clone --recurse-submodules https://github.com/LMSCloud/LMSEventManagement.git
cd LMSEventManagement
```

Or, if you already cloned without `--recurse-submodules`:

```bash
git submodule update --init --recursive
```

## Updating the Shared Utilities

When upstream changes are made to [koha-plugin-lmscloud-util](https://github.com/lmscloudpauld/koha-plugin-lmscloud-util):

```bash
# Pull the latest submodule commit
cd vendor/koha-plugin-lmscloud-util
git checkout main
git pull
cd ../..

# Re-sync the generated files
./tools/sync_util.sh

# Commit both the submodule ref and the regenerated files
git add vendor/koha-plugin-lmscloud-util Koha/Plugin/Com/LMSCloud/EventManagement/Util/
git commit -m "chore: update Util submodule"
```

## Making Changes to Shared Code

1. Make changes in `vendor/koha-plugin-lmscloud-util/`
2. Commit and push in the submodule repo
3. Run `./tools/sync_util.sh` to regenerate
4. Commit the updated submodule ref + generated files in this repo
5. Repeat in the other plugin repo (LMSRoomReservations)

## Daily Workflow

After `git pull`, always update submodules:

```bash
git pull
git submodule update --recursive
```

The generated `Util/` files are committed, so you only need to re-run `./tools/sync_util.sh` if the submodule ref changed and you want to verify the output.
