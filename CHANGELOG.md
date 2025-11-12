## [unreleased]

### 🐛 Bug Fixes

- Prevent status badge from overlapping event title
- Resolve ambiguous 'name' column in SQL queries
- Respect auto_inject setting in widget inject script
- Use attr__ macro for attribute translations
- Prevent wide character print by utf8 encoding ical exports

### ⚙️ Miscellaneous Tasks

- Increment major, minor versions for new release
- Increment patch version
- Increment patch version
- Build new bundle
- Update CHANGELOG.md
- Increment patch version
- Build new bundle
## [2.8.0-beta.15] - 2025-10-21

### 🚀 Features

- Migrate OPAC interface to Koha Pages
- Add accessible status badges to event cards
- Sort OPAC filter options lexicographically
- Add accessible link styling to OPAC event details modal
- Add iCalendar export functionality
- Make toast variants configurable
- Add libraries endpoint to request handler
- Split into {opac,staff}.ts for leaner bundles, preparation for more entry points
- Add configurable OPAC events widget

### 🐛 Bug Fixes

- Make image extension check case-insensitive in frontend
- Exclude 'code' parameter from API requests
- Validate datetime year is at least 1000
- Make pip modal scrollable on desktop
- Lower z-index of status badge to avoid dropdown overflow
- Warning, now error on incorrect nullish coelescing in LMSTable
- Pell editor toolbar not functioning correctly
- Make modal action buttons responsive on mobile
- Prevent unconditional rendering of pell editor due to incorrect css
- Add OPAC Widget breadcrumb label
- Consistently use nothing over empty string for rendering
- Bypass pagination for locations and event types in modal dropdowns

### 💼 Other

- *(9071bd1)* Update pages on upgrades
- *(964c14e)* Prevent breaking card styles by moving badge as last child into figure element

### 🚜 Refactor

- Migrate to pders01/koha-plugin for project management
- Migrate from Rollup to Rolldown with code splitting
- Improve LMSPellEditor modal interaction and performance
- Extract modal sizing logic to eliminate duplication
- Simplify OPAC events filter UI and improve mobile responsiveness
- Improve icon alignment in card details modal

### 🎨 Styling

- Improve legibility of card content by removing font-thin classes

### 🧪 Testing

- Expand target groups to 25 for testing

### ⚙️ Miscellaneous Tasks

- Add database seed fixtures for testing
- Update dependencies to latest versions in range
- Update select dependencies to new major versions
- Build new bundle
- Build new bundle
- Add gitattributes to keep diffs cleaner
- Add lit-analyzer and lit-specific lint script
- Remove config for unused tool knip
- Remove old env file, ignore list for koha-plugin-tools
- Remove old packaging tool package-kpz
- Allow cpanfile.snapshot to be tracked
- Add Template::Plugin::Gettext for string extraction via xgettext-tt2
- Add EventManagement root as entry point for string extraction
- Add local dir to gitignore
- Update german translations
- Build new bundle
- Add CHANGELOG.md
- Add SUBMODULES.md
- Update README.md
- Remove use 5.032 requirement
## [1.6.12-beta.14] - 2024-03-04

### 🐛 Bug Fixes

- Prevent formatting issue w/ > 2 selected target groups
- Fetch all events after init hydration for filtering
- Reorder date sorting dropdown content
- Use end time in are_upcoming method on events class
- Reset of events modal
- Use a language agnostic method to determine the event type key
- Broken textdomain import due to perlimports
- Use form resets instead of input snapshot reverts for modal resets

### 💼 Other

- Increment version on two patches
- *(8b8daae378570609b3013ae883aad2fbea8cb2cc)* Chain another then call to the initial Promise.all call
- Check if events_count is defined and not zero
- Build new package
- *(c5b3a4af9dba847265f38f10af287837454b507c)* Build new package
- *(060f814f25797900d9cbcdbe97575fa49bc37d9a)* Use proper loop variable; dtf formatter
- *(efab10dd86d89bcedde064ca04cbdf9aa797d3aa)* Build new package
- Increment patch version by 3 and build new package
- *(e7a0b8b58a16b3496a4ce9e65abfcd6a1aa9a565)* Remove guard clause, now handled by int parsing
- Build new package
- *(dd92a0d6280486cf4b5aad1e2a48a202398d86c0)* Rename utils to util for conformity w/ room reservations
- *(dd92a0d6280486cf4b5aad1e2a48a202398d86c0)* Adjust calls to migration helper to updated package name
- Add remeda for clone and future refactors

### 🚜 Refactor

- Move MigrationHelper and Validator into LMSCloud namespace

### ⚙️ Miscellaneous Tasks

- Add no-fmt variant of build script
- Increment patch version and build new package
- Add perlimports config
- Increment patch version
- Increment patch version and build new package
## [1.6.4-beta.12] - 2023-12-04

### 🐛 Bug Fixes

- Adjust field name in detail to refactored standard
- Adjust field name in detail to refactored standard

### 💼 Other

- Increment version on patch
## [1.6.3-beta.11] - 2023-11-24

### 🐛 Bug Fixes

- Correct request body format in staff events view

### 💼 Other

- Increment version on patch
## [1.6.2-beta.10] - 2023-11-21

### 💼 Other

- Stop propagation of search events
- Increment version on patch
## [1.6.1-beta.10] - 2023-11-20

### 🐛 Bug Fixes

- Prevent concat call on undefined filters

### 💼 Other

- Increment version on patch
## [1.6.0-beta.10] - 2023-11-20

### ⚙️ Miscellaneous Tasks

- Update german translations
- Increment two minor versions after refactor
## [1.4.5-beta.9] - 2023-11-07

### 🐛 Bug Fixes

- Refetch settings after update and rerender
- Refactor and fix event retrieval logic
- [**breaking**] Correct infinite "scrolling" requests implementation

### 💼 Other

- Actually write update cache back to cache file
- Use canonical exit values for interop
- Increment version after patch
- Update internal/privileged event/s endpoints
- *(a51c4d4744c397643b9ccba08d96dfa00230f26e)* Remove -in filter
- Build new package
- Increment version on patch
- Build new package after dependency change

### ⚙️ Miscellaneous Tasks

- Add caching for perltidy (perltidyc)
- Add individual entries for formatting
- Correct name of perltidyrc
## [1.4.3-beta.8] - 2023-10-28

### 🚀 Features

- Require dblclick on modal editors

### 🐛 Bug Fixes

- Add import of translate directive to event types table
- Prevent null pointer on event type links
- Limit width of pell editor modal to 5xl or 1024px from sm
- Use repeat directive in tables
- Update filters on load of additional content
- Temporarily set id as default sort column
- Revert ommission of open_registration

### 💼 Other

- Inform users about cascading on event type deletion
- *(f03a30bf6ac2bb10f851b06b9447c354236c7378)* Update german translations
- *(3f4d239d8479809678399754a865242b393e66e7)* Increment version on patch
- Increment version on patch
- Update german translations
- Update lit to v3
- Increment version after feat and 2 patches
- Increment version on patch

### 🚜 Refactor

- Move count into Public::Events controller

### ⚙️ Miscellaneous Tasks

- Add node script to build plugin w/ perl v 5.030
- Replace parameter expansion in build:5.030
- Add .perlcriticrc and reformat modules
- Commenced work on api tests (requires fix in upstream)
- Reorder and -format tailwind classes
- Build new package
## [1.3.29-beta.7] - 2023-09-18

### 🐛 Bug Fixes

- Fix fk error on deletion of event types

### 💼 Other

- Increment version on patch
## [1.3.28-beta.6] - 2023-09-18

### 🐛 Bug Fixes

- Prevent empty strings in datetime request parameters

### 💼 Other

- Increase version on patch
## [1.3.27-beta.5] - 2023-08-11

### 🐛 Bug Fixes

- Add missing private method
- Be more verbose while applying migrations
- Reintroduce formatting based on locale for dt displays
- Update german translations
- Use covention 'images' in event types modal
- Prevent masking of updated form fields
- Skip validations if nullish value and nullable is true
- Set registration dates as optional for the moment
- Reset inputs in tables to prev values on aborts
- Revert modals to empty state on succesful saves
- Overwrite centered text in pell editor to be left aligned
- Revert to defaults for staff event card inputs on abort
- Render on first created item by setting reactive property isEmpty
- Properly group evaluations for load more button
- Initialise is_success as 1 and return 0 on errors

### 💼 Other

- Build new package
- Return failing statement in migration helper
- Log db errstr if statements fail
- Increment patch version after fix
- Start w/ event type in events modal
- Update german translations
- Update patch version
- Update german translations
- Update german translations
- Add formatting for perl files on builds
- Only revert input states on non-save events
- Cleanup orphaned table rows on new table row edits
- Properly handle checkbox and textarea inputs
- Increase patch version for new release

### 🚜 Refactor

- Add transactions to migration helper

### ⚙️ Miscellaneous Tasks

- Reformat perl w/ new formatting rule
- Build new package
- Fixup illogical event types seed
- Delete unmaintained tests
- Add script for automatic datetime updates on demo instances
## [1.3.11-beta.4] - 2023-07-21

### 🐛 Bug Fixes

- Prevent state leak in staff event cards
- Return unblessed ref instead of as_list call
- Prevent memory leaks by explicit destruction of intersectionObserverHandler instances
- Add event emitters to reliably updated form fields arr
- Give anchor components appropriate styles
- Prevent mismatch of modal requests and user input
- Update german translations
- Add property to both modal components in views
- Use repeat directive for card deck renders
- Write current migration to db on installs

### 💼 Other

- Update german translations
- Update german translations
- Increment patch version
- Change property for image picker
- Update fields w/ api mapping on event type change
- Build new package
- Increment patch version
- Increment patch version

### 🚜 Refactor

- Make tsconfig stricter
- Move input templates to classes
- Make images property consistent
- Rely on idiomatic lit rendering for staff event card deck
- Reintroduce updating modal on event type change
- Fixup preview component after refactor
## [1.3.1-beta.3] - 2023-07-18

### 🚀 Features

- Add reset filters button to staff events view
- Add a confirmation modal for deletions

### 🐛 Bug Fixes

- Use dayjs for formatting w/o utc conversion
- Update german translations
- Handle null values in templ res checks
- Update german translations

### 💼 Other

- Use a static icon and a title for reset
- Build new package
- Update version info for new release

### 🚜 Refactor

- Restructure dir layout for lib/converters
- Standardize all date db writes
- Move more specific compontents to custom
## [1.1.1-beta.2] - 2023-07-17

### 🐛 Bug Fixes

- Replace bool str representation w/ real bool
- Always write ISO8601 to db, offset in format

### 💼 Other

- Normalize without using Date constructor
- Update static version string in base module
## [1.1.0-beta.1] - 2023-07-07

### 💼 Other

- Add target group configuration
- Removing old translations, rename db seed for tests
- Don't close the currently clicked dropdown
