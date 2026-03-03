package Koha::Plugin::Com::LMSCloud::EventManagement::Util::Pages;

use Modern::Perl;
use utf8;
use 5.010;

use C4::Context              ();
use Koha::AdditionalContents ();
use Koha::AdditionalContent  ();
use Koha::DateUtils          qw( dt_from_string );

use Carp    qw( carp croak );
use English qw( -no_match_vars );

our $VERSION = '1.2.0';
use Exporter 'import';

BEGIN {
    our @EXPORT_OK = qw(
        create_opac_page
        update_opac_page
        delete_opac_page
        page_exists
        get_page_url
    );
}

=head1 NAME

Koha::Plugin::Com::LMSCloud::EventManagement::Util::Pages - Manage Koha Additional Content pages

=head1 DESCRIPTION

This module provides functions to manage Koha Additional Content (Pages) for plugins.
It handles creation, updating, and deletion of OPAC pages programmatically.

Supports both the legacy single-table schema (Koha <= 22.11) and the split schema
introduced in Koha 23.11 (Bug 31383) where title/content/lang were moved to
additional_contents_localizations.

Legacy implementations use the Koha ORM directly (Koha::AdditionalContents).
Split implementations use Koha::AdditionalContent + translated_contents relationship.
Localization classes (Koha::AdditionalContentsLocalization(s)) are loaded at runtime
via require since they only exist on Koha >= 23.11.

=head1 FUNCTIONS

=cut

# --- Schema detection ---
# 'legacy' = Koha <= 22.11 - additional_contents has title, content, lang
# 'split'  = Koha >= 23.11 - additional_contents + additional_contents_localizations

my $_schema_type;

sub _schema_type {
    return $_schema_type if defined $_schema_type;

    my $dbh = C4::Context->dbh;
    my $sth = $dbh->prepare(q{SHOW COLUMNS FROM `additional_contents` LIKE 'lang'});
    $sth->execute();
    my $has_lang = $sth->fetchrow_hashref;

    $_schema_type = $has_lang ? 'legacy' : 'split';
    return $_schema_type;
}

# --- Dispatch table ---

my $DISPATCH = {
    create   => { legacy => \&_create_legacy,   split => \&_create_split },
    update   => { legacy => \&_update_legacy,   split => \&_update_split },
    delete   => { legacy => \&_delete_legacy,   split => \&_delete_split },
    exists   => { legacy => \&_exists_legacy,   split => \&_exists_split },
    page_url => { legacy => \&_page_url_legacy, split => \&_page_url_split },
};

# --- Public API ---

=head2 create_opac_page

    create_opac_page({
        code    => 'roomreservations',
        title   => 'Room Reservations',
        content => '<div>...</div>',
        lang    => 'default',
    });

Creates a new Koha page for the OPAC. Returns the id of the created page or undef on failure.

Parameters:
- code: Unique identifier for the page (required)
- title: Title of the page (required)
- content: HTML content for the page (required)
- lang: Language code (default: 'default')
- branchcode: Library code (default: undef = all libraries)

=cut

sub create_opac_page {
    my ($params) = @_;

    return $DISPATCH->{'create'}{ _schema_type() }->($params);
}

=head2 update_opac_page

    update_opac_page({
        code    => 'roomreservations',
        title   => 'Updated Title',
        content => '<div>...</div>',
        lang    => 'default',
    });

Updates an existing Koha page. Returns 1 on success, undef on failure.

Parameters:
- code: Unique identifier for the page (required)
- title: New title (optional)
- content: New HTML content (optional)
- lang: Language code (default: 'default')

=cut

sub update_opac_page {
    my ($params) = @_;

    return $DISPATCH->{'update'}{ _schema_type() }->($params);
}

=head2 delete_opac_page

    delete_opac_page({
        code => 'roomreservations',
        lang => 'default',
    });

Deletes a Koha page by code and language. Returns 1 on success, undef if page not found.

Parameters:
- code: Unique identifier for the page (required)
- lang: Language code (default: 'default')

=cut

sub delete_opac_page {
    my ($params) = @_;

    return $DISPATCH->{'delete'}{ _schema_type() }->($params);
}

=head2 page_exists

    my $exists = page_exists({
        code => 'roomreservations',
        lang => 'default',
    });

Checks if a page exists with the given code and language.

Parameters:
- code: Unique identifier for the page (required)
- lang: Language code (default: 'default')

Returns 1 if page exists, 0 otherwise.

=cut

sub page_exists {
    my ($params) = @_;

    return $DISPATCH->{'exists'}{ _schema_type() }->($params);
}

=head2 get_page_url

    my $url = get_page_url({ code => 'roomreservations' });

Returns the OPAC URL for a page identified by code, or undef if not found.
Handles both legacy (?page_id=N with idnew) and split (?page_id=N with parent id) schemas.

=cut

sub get_page_url {
    my ($params) = @_;

    return $DISPATCH->{'page_url'}{ _schema_type() }->($params);
}

# --- Legacy implementations (Koha <= 22.11) ---
# additional_contents: idnew, category, code, location, branchcode, title, content, lang, published_on, number

sub _create_legacy {
    my ($params) = @_;

    my $code       = $params->{'code'}    or croak 'code parameter is required';
    my $title      = $params->{'title'}   or croak 'title parameter is required';
    my $content    = $params->{'content'} or croak 'content parameter is required';
    my $lang       = $params->{'lang'} // 'default';
    my $branchcode = $params->{'branchcode'};

    if ( page_exists( { code => $code, lang => $lang } ) ) {
        carp "Page with code '$code' and lang '$lang' already exists";
        return;
    }

    my $page = Koha::AdditionalContent->new(
        {   category     => 'pages',
            code         => $code,
            location     => 'opac_only',
            branchcode   => $branchcode,
            title        => $title,
            content      => $content,
            lang         => $lang,
            published_on => dt_from_string()->ymd(),
            number       => 0,
        }
    )->store;

    if ( !$page ) {
        carp 'Failed to create OPAC page';
        return;
    }

    return $page->idnew;
}

sub _exists_legacy {
    my ($params) = @_;

    my $code = $params->{'code'} or croak 'code parameter is required';
    my $lang = $params->{'lang'} // 'default';

    my $count = Koha::AdditionalContents->search(
        {   category => 'pages',
            code     => $code,
            lang     => $lang,
            location => 'opac_only',
        }
    )->count;

    return $count > 0 ? 1 : 0;
}

sub _update_legacy {
    my ($params) = @_;

    my $code = $params->{'code'} or croak 'code parameter is required';
    my $lang = $params->{'lang'} // 'default';

    my $page = Koha::AdditionalContents->search(
        {   category => 'pages',
            code     => $code,
            lang     => $lang,
            location => 'opac_only',
        }
    )->next;

    if ( !$page ) {
        carp "Page with code '$code' and lang '$lang' not found";
        return;
    }

    $page->title( $params->{'title'} )     if exists $params->{'title'};
    $page->content( $params->{'content'} ) if exists $params->{'content'};

    my $rv = $page->store;

    if ( !$rv ) {
        carp 'Failed to update OPAC page';
        return;
    }

    return 1;
}

sub _delete_legacy {
    my ($params) = @_;

    my $code = $params->{'code'} or croak 'code parameter is required';
    my $lang = $params->{'lang'} // 'default';

    my $pages = Koha::AdditionalContents->search(
        {   category => 'pages',
            code     => $code,
            lang     => $lang,
            location => 'opac_only',
        }
    );

    if ( !$pages->count ) {
        carp "Page with code '$code' and lang '$lang' not found";
        return;
    }

    $pages->delete;
    return 1;
}

sub _page_url_legacy {
    my ($params) = @_;

    my $code = $params->{'code'} or croak 'code parameter is required';

    my $page = Koha::AdditionalContents->search(
        {   category => 'pages',
            code     => $code,
            location => 'opac_only',
        }
    )->next;

    return unless $page;
    return '/cgi-bin/koha/opac-page.pl?page_id=' . $page->idnew;
}

# --- Split schema implementations (Koha >= 23.11) ---
# additional_contents: id, category, code, location, branchcode, published_on, ...
# additional_contents_localizations: id, additional_content_id, title, content, lang, ...
# Localization ORM classes are loaded at runtime since they don't exist on legacy Koha.

sub _find_parent {
    my ($args) = @_;

    my $search = {
        category => 'pages',
        code     => $args->{'code'},
        location => 'opac_only',
    };

    # When branchcode key exists, filter by it (undef → IS NULL via DBIC).
    # When key is absent, match any branchcode.
    if ( exists $args->{'branchcode'} ) {
        $search->{'branchcode'} = $args->{'branchcode'};
    }

    return Koha::AdditionalContents->search($search)->next;
}

sub _create_split {
    my ($params) = @_;

    my $code       = $params->{'code'}    or croak 'code parameter is required';
    my $title      = $params->{'title'}   or croak 'title parameter is required';
    my $content    = $params->{'content'} or croak 'content parameter is required';
    my $lang       = $params->{'lang'} // 'default';
    my $branchcode = $params->{'branchcode'};

    if ( page_exists( { code => $code, lang => $lang } ) ) {
        carp "Page with code '$code' and lang '$lang' already exists";
        return;
    }

    # Find or create parent record
    my $parent = _find_parent( { code => $code, branchcode => $branchcode } );

    if ( !$parent ) {
        $parent = Koha::AdditionalContent->new(
            {   category     => 'pages',
                code         => $code,
                location     => 'opac_only',
                branchcode   => $branchcode,
                published_on => dt_from_string()->ymd(),
                number       => 0,
            }
        )->store;

        if ( !$parent ) {
            carp 'Failed to create additional_contents record';
            return;
        }
    }

    # Create localization record
    require Koha::AdditionalContentsLocalization;

    my $localization = Koha::AdditionalContentsLocalization->new(
        {   additional_content_id => $parent->id,
            title                 => $title,
            content               => $content,
            lang                  => $lang,
        }
    )->store;

    if ( !$localization ) {
        carp 'Failed to create localization record';
        return;
    }

    return $localization->id;
}

sub _exists_split {
    my ($params) = @_;

    my $code = $params->{'code'} or croak 'code parameter is required';
    my $lang = $params->{'lang'} // 'default';

    my $parent = _find_parent( { code => $code } );
    return 0 unless $parent;

    return $parent->translated_contents->search( { lang => $lang } )->count > 0 ? 1 : 0;
}

sub _update_split {
    my ($params) = @_;

    my $code = $params->{'code'} or croak 'code parameter is required';
    my $lang = $params->{'lang'} // 'default';

    my $parent = _find_parent( { code => $code } );

    if ( !$parent ) {
        carp "Page with code '$code' not found";
        return;
    }

    my $localization = $parent->translated_contents->search( { lang => $lang } )->next;

    if ( !$localization ) {
        carp "Localization for code '$code' and lang '$lang' not found";
        return;
    }

    $localization->title( $params->{'title'} )     if exists $params->{'title'};
    $localization->content( $params->{'content'} ) if exists $params->{'content'};

    my $rv = $localization->store;

    if ( !$rv ) {
        carp 'Failed to update localization';
        return;
    }

    return 1;
}

sub _delete_split {
    my ($params) = @_;

    my $code = $params->{'code'} or croak 'code parameter is required';
    my $lang = $params->{'lang'} // 'default';

    my $parent = _find_parent( { code => $code } );

    if ( !$parent ) {
        carp "Page with code '$code' not found";
        return;
    }

    my $localization = $parent->translated_contents->search( { lang => $lang } )->next;

    if ( !$localization ) {
        carp "Localization for code '$code' and lang '$lang' not found";
        return;
    }

    $localization->delete;

    # Clean up parent if no localizations remain
    if ( !$parent->translated_contents->count ) {
        $parent->delete;
    }

    return 1;
}

sub _page_url_split {
    my ($params) = @_;

    my $code = $params->{'code'} or croak 'code parameter is required';

    my $parent = _find_parent( { code => $code } );

    return unless $parent;
    return '/cgi-bin/koha/opac-page.pl?page_id=' . $parent->id;
}

=head1 AUTHOR

LMSCloud GmbH

=cut

1;
