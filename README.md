# LMSEventManagement

This is a big one! This koha-plugin will make it easy for you to create, manage and advertise events to your target audience.

## Roadmap
- [] Some goal
- [] Some other goal
- [] These are placeholders...

## Usage
TBA

## Development

The following subsections describe how to project is laid out at the moment.

### perl

Most things live in ```Koha/Plugin/Com/LMSCloud/EventManagement.pm```.
Here lies everything that's even remotely related to Koha's plugin hooks. We may be able to extract some of the CRUD methods to their own modules in the future.

There is a planned library of validators under ```Koha/Plugin/Com/LMSCloud/EventManagement/Validators.pm```.
We should add a type-safe way to validate all user input coming from the frontend to prevent DBI exceptions and prevent users to fill in data, that messes up the frontend in unpredictable ways.

The controller code for the API-endpoint lives under ```Koha/Plugin/Com/LMSCloud/EventManagement/EventsController.pm```.
The heart of communication for updating our main events view. Still work in progress.

#### Formatting & Linting

For formatting we use perltidy for formatting with this config

```conf
# PBP .perltidyrc

-l=180   # Max line idth is 78 cols
-i=4    # Indent level is 4 cols
-ci=4   # Continuation indent is 4 cols
-st     # Output to STDOUT
-se     # Errors to STDERR
-vt=2   # Maximal vertical tightness
-cti=0  # No extra indentation for closing brackets
-pt=1   # Medium parenthesis tightness
-bt=1   # Medium brace tightness
-sbt=1  # Medium square bracket tightness
-bbt=1  # Medium block brace tightness
-nsfs   # No space before semicolons
-nolq   # Don't outdent long quoted strings
-wbb="% + - * / x != == >= <= =~ < > | & **= += *= &= <<= &&= -= /= |= >>= ||= .= %= ^= x="
        # Break before all operatorsw
```

For linting we use perlcritic with this config

```conf
# PBP & Core .perlcriticrc

exclude = Documentation Naming
include   = CodeLayout Modules
force = 1
only = 0
severity =
theme = pbp || core
top = 100
verbose = 11
color-severity-highest = bold red underline
color-severity-high = bold magenta
color-severity-medium = blue
color-severity-low =
color-severity-lowest =
program-extensions =

[-NamingConventions::Capitalization]
[-TestingAndDebugging::RequireUseWarnings]

[BuiltinFunctions::RequireBlockGrep]
severity = 2

[CodeLayout::ProhibitHardTabs]
severity = 1

[ClassHierarchies::ProhibitAutoloading]
severity = 5

[RegularExpressions::RequireExtendedFormatting]
add_themes = client_foo
severity   = 3

[RegularExpressions::RequireExtendedFormatting]
add_themes = client_foo client_bar
severity   = 3

[ControlStructures::ProhibitPostfixControls]
allow    = for if
severity = 4

[Documentation::RequirePodSections]
lib_sections = NAME | SYNOPSIS | METHODS | AUTHOR
add_themes = my_favorites
severity   = 4

[ValuesAndExpressions::ProhibitInterpolationOfLiterals]
[ValuesAndExpressions::ProhibitLeadingZeros]
[InputOutput::ProhibitBarewordFileHandles]
[Miscellanea::ProhibitTies]
```

### Template Toolkit

Instead of using the old 'op' way and creating everything in one template, we create templates for all views (as is the standard for most full-blown frameworks) and load the respective template depending on user input. Just look at the **tools** hook in the __EventManagement__ module.

```
Koha/Plugin/Com/LMSCloud
├── EventManagement
...
│   ├── configuration
│   │   ├── add_event_type.tt
│   │   ├── add_target_group.tt
│   │   ├── configure.tt
│   │   ├── configure_event_types.tt
│   │   ├── configure_target_groups.tt
│   │   ├── edit_event_type.tt
│   │   └── edit_target_group.tt
...
│   ├── opac
│   │   ├── event.tt
│   │   ├── events.pl
│   │   ├── events.tt
│   │   └── wrappers
...
│   ├── tools
│   │   ├── add_event.tt
│   │   ├── choose_event_type.tt
│   │   ├── edit_event.tt
│   │   └── tool.tt
...
```

### JavaScript

JavaScript lives in the ```src``` directory in the project root. The ```js``` directory in the package is the bundled version that gets created by rollup. Accessing the bundle is done by including the distribution under ```js/main.js```.

```HTML
<script type="text/javascript" src="/api/v1/contrib/eventmanagement/static/js/main.js"></script>
```

If you've loaded the bundle you can access its methods by deconstructing the object like this

```JS
const { LMSEventsFilter, updateRangeOutput } = EventManagementBundle;
```

or you can just access the methods on the object itself.

```JS
EventManagementBundle.updateRangeOutput({some, args, note: 'not actual implementation'});
```

To create a new version of the bundle run

```bash
./node_modules/.bin/rollup -c rollup.config.js
```

in the project root.

### Formatting & Linting

We use eslint with airbnb's base config in this project.

```bash
./node_modules/.bin/eslint file.js
```