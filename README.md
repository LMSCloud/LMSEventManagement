# 🎭 LMSEventManagement

This is a big one! This koha-plugin will make it easy for you to create, manage and advertise events to your target audience.

## Roadmap
- [ ] Some goal
- [ ] Some other goal
- [ ] These are placeholders...

## Setup

### /etc/apache2/apache2.conf

```conf
<Directory /var/lib/koha/INSTANCE/plugins/>
    Options Indexes FollowSymLinks
    AllowOverride None
    Require all granted
</Directory>


<Directory /var/lib/koha/INSTANCE/uploads/LMSEventManagement>
    Options Indexes FollowSymLinks
    AllowOverride None
    Require all granted
</Directory>
```

### /etc/apache2/sites-available/INSTANCE.conf

```conf
ScriptAlias /opac-events "/var/lib/koha/INSTANCE/plugins/Koha/Plugin/Com/LMSCloud/EventManagement/opac/events.pl"
Alias /plugin "/var/lib/koha/INSTANCE/plugins"
Alias /lms-event-management/images "/var/lib/koha/INSTANCE/uploads/LMSEventManagement/"
```

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
