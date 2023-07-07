# 🎭 LMSEventManagement

This is a big one! This koha-plugin makes it easy for you to create, manage and advertise events to your target audiences.

# Downloading

From the [release page](https://github.com/LMSCloud/LMSEventManagement/releases) you can download the relevant *.kpz file

# Installing

Koha's Plugin System allows for you to add additional tools and reports to Koha that are specific to your library.
Plugins are installed by uploading KPZ ( Koha Plugin Zip ) packages.
A KPZ file is just a zip file containing the perl files, template files, and any other files necessary to make the plugin work.

The plugin system needs to be turned on by a system administrator.

To set up the Koha plugin system you must first make some changes to your install.

* Change `<enable_plugins>0<enable_plugins>` to `<enable_plugins>1</enable_plugins>` in your koha-conf.xml file
* Confirm that the path to `<pluginsdir>` exists, is correct, and is writable by the web server
* Restart your webserver

Once set up is complete you will need to alter your UseKohaPlugins system preference.

## Additional steps

At the moment you also need to make some changes to your apache2 configuration to make this plugin work.
This will be addressed in a future release.

### /etc/apache2/apache2.conf

```conf
<Directory /var/lib/koha/INSTANCE/plugins/>
    Options Indexes FollowSymLinks
    AllowOverride None
    Require all granted
</Directory>
```

### /etc/apache2/sites-available/INSTANCE.conf

```conf
ScriptAlias /events "/var/lib/koha/INSTANCE/plugins/Koha/Plugin/Com/LMSCloud/EventManagement/Opac/events.pl"
Alias /plugin "/var/lib/koha/INSTANCE/plugins"
```

### Or in /etc/apache2/sites-available/INSTANCE.conf

```conf
<Directory /var/lib/koha/INSTANCE/plugins/>
    Options FollowSymLinks
    AllowOverride None
    Require all granted
</Directory>

ScriptAlias /events "/var/lib/koha/INSTANCE/plugins/Koha/Plugin/Com/LMSCloud/EventManagement/Opac/events.pl"
Alias /plugin "/var/lib/koha/INSTANCE/plugins"
```

# Usage

## Create target groups

Target groups are groups of patrons that can be used to target events to. They have a small set
of properties which you can use to create certain age cohorts. Of course you can also create groups
like 'Family' or 'Friends' or 'Staff' for example where the age is not the deciding factor.

| Property    | Database Field | Description                      |
| ----------- | -------------- | -------------------------------- |
| Name        | name           | Name of the target group         |
| Minimum age | min_age        | Lower age boundary of the group  |
| Maximum age | max_age        | Upper age boundary for the group |



## Create locations

Locations are the places where your events will take place. They have a small set of properties that
denote the location's address and you can also add a link to the location's website or a map provider
of your choice. The provider's hostname will be shown to users so they know where they will be redirected.

| Property             | Database Field | Description                                      |
| -------------------- | -------------- | ------------------------------------------------ |
| Name                 | name           | Name of the location                             |
| Street               | street         | Street address of the location                   |
| Number               | number         | Street number of the location                    |
| Zip code             | zip            | Zip code of the location                         |
| City                 | city           | City of the location                             |
| Country              | country        | Country of the location                          |
| Site or map provider | link           | Link to the location's website or a map provider |



## Create event types

Event types are sort of like categories for your events. They allow users to filter events by type
but also act as templates for new events you'd like to create. You can set a subset of properties
that actual events will inherit from the event type.

| Property                       | Database Field    | Description                                          |
| ------------------------------ | ----------------- | ---------------------------------------------------- |
| Name                           | name              | Name of the event type                               |
| Minimum age                    | min_age           | Minimum age requirement                              |
| Maximum age                    | max_age           | Maximum age requirement                              |
| Maximum number of participants | max_participants  | Maximum allowed number of participants               |
| Location                       | location          | Reference to a created location                      |
| Image                          | image             | URL to an image                                      |
| Description                    | description       | Event description                                    |
| Open registration              | open_registration | Denotes if external users can register for the event |

## Create events

Events are the actual events you'd like to advertise to your patrons. They are accessible through
the /events route on your OPAC (if you copied the ScriptAlias from the setup example). You can create
events from scratch or use an event type as a template. Please note that you will have to assign
the event to an event type, though. This is just so every event is associated with an event type that
patrons can use to filter events. 

| Property                       | Database Field     | Description                                          |
| ------------------------------ | ------------------ | ---------------------------------------------------- |
| Name                           | name               | Name of the event                                    |
| Event type                     | event_type         | Reference to a created event type                    |
| Minimum age                    | min_age            | Minimum age requirement                              |
| Maximum age                    | max_age            | Maximum age requirement                              |
| Maximum number of participants | max_participants   | Maximum allowed number of participants               |
| Start time                     | start_time         | Date and time when the event will start              |
| End time                       | end_time           | Date and time when the event will end                |
| Registration start time        | registration_start | Date and time when event registration starts         |
| Registration end time          | registration_end   | Date and time when event registration ends           |
| Location                       | location           | Reference to a created location                      |
| Image                          | image              | URL to an image                                      |
| Description                    | description        | Event description                                    |
| Registration URL               | registration_link  | URL to an external registration page                 |
| Open registration              | open_registration  | Denotes if external users can register for the event |

### Note about some properties

Three properties are non-functional at the moment but will be used for a native event registration in a future release
  - Registration start time, which is a date and time when registration for the event will start 
  - Registration end time, which is a date and time when registration for the event will end
  - Status, which denotes the current state of the event, can be pending, confirmed, cancelled o

## The target group matrices

Maybe you already noticed the target group matrices in the event and event type creation modal.
These are used to associate target groups with events and event types. This is also where you
declare fees for participation which you can individually set for each target group.

## Images

You can upload images for events and event types. These images will be stored under the LMSEventManagement
namespace and can be viewed in the images tab of the plugin's admin interface. The following image formats
are supported:

- JPEG or JPG
- PNG
- GIF
- AVIF
- WEBP

If possible use AVIF or WEBP as they are the most efficient formats. If you upload an image that is not
in one of the supported formats you'll get an error. The maximum file size is 10MB. To ensure optimal
performance you should keep the file size as small as possible, e.g. in a low kilobyte range.

# Development

PRs and issues are welcome! Please note that this plugin is in currently in beta.
We haven't encountered any major issues but bugs are always possible. If you find
a bug please open an issue and we'll try to fix it as soon as possible.

# License

This plugin is licensed under the GPLv3 license. See the LICENSE file for more information.
