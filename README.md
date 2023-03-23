# 🎭 LMSEventManagement

This is a big one! This koha-plugin will make it easy for you to create, manage and advertise events to your target audience.

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
ScriptAlias /events "/var/lib/koha/INSTANCE/plugins/Koha/Plugin/Com/LMSCloud/EventManagement/Opac/events.pl"
Alias /plugin "/var/lib/koha/INSTANCE/plugins"
Alias /lms-event-management/images "/var/lib/koha/INSTANCE/uploads/LMSEventManagement/"
```

### Or in /etc/apache2/sites-available/INSTANCE.conf

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

ScriptAlias /events "/var/lib/koha/INSTANCE/plugins/Koha/Plugin/Com/LMSCloud/EventManagement/Opac/events.pl"
Alias /plugin "/var/lib/koha/INSTANCE/plugins"
Alias /lms-event-management/images "/var/lib/koha/INSTANCE/uploads/LMSEventManagement/"
```

## Usage

TBA
