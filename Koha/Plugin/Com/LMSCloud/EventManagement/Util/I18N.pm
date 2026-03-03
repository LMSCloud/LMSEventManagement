package Koha::Plugin::Com::LMSCloud::EventManagement::Util::I18N v0.0.1;

use Modern::Perl;
use utf8;

use C4::Languages ();

use Koha::Cache::Memory::Lite ();

use Encode           ();
use Locale::Messages qw(
    bindtextdomain
    gettext
    LC_MESSAGES
    ngettext
    npgettext
    pgettext
    textdomain
);
use POSIX ();

use Carp       qw( carp );
use IPC::Open3 qw( open3 );
use Readonly   qw( Readonly );
use parent 'Exporter';

## no critic qw(Modules::ProhibitAutomaticExportation)
our @EXPORT = qw(
    __
    __x
    __n
    __nx
    __xn
    __p
    __px
    __np
    __npx
    N__
    N__n
    N__p
    N__np
);
## use critic

our $CONFIG = {
    TEXTDOMAIN => undef,
    DIR        => undef,
};

Readonly my $CONSTANTS => {
    INDEX_FIRST_SYSTEM_LOCALE => 0,
    INDEX_REGION_SUBTAGS      => 2,
    LENGTH_TRIMMED_ISO639_1   => 4,
};

sub new {
    my ( $self, $textdomain, $dir ) = @_;

    $CONFIG->{'TEXTDOMAIN'} = $textdomain;
    $CONFIG->{'DIR'}        = $dir;

    return $self;
}

sub init {
    my $cache     = Koha::Cache::Memory::Lite->get_instance();
    my $cache_key = 'i18n:plugin:initialized';

    my ( $locale, $output_charset );
    if ( !$cache->get_from_cache($cache_key) ) {
        my ( $writer, $reader, $err );
        open3( $writer, $reader, $err, 'locale -a' );

        my $system_locales = [ grep { chomp; not( /^C/smx || $_ eq 'POSIX' ) } <$reader> ];
        if ( @{$system_locales} ) {

            # LANG needs to be set to a valid locale,
            # otherwise LANGUAGE is ignored
            $ENV{LANG} = $system_locales->[ $CONSTANTS->{'INDEX_FIRST_SYSTEM_LOCALE'} ];    ## no critic qw(Variables::RequireLocalizedPunctuationVars)
            POSIX::setlocale( LC_MESSAGES, q{} );

            my $langtag = C4::Languages::getlanguage;
            my $subtags = [ split /-/smx, $langtag ];
            my ( $language, $region ) = @{$subtags};
            if ( $region && length $region == $CONSTANTS->{'LENGTH_TRIMMED_ISO639_1'} ) {
                $region = $subtags->[ $CONSTANTS->{'INDEX_REGION_SUBTAGS'} ];
            }
            $locale         = $language;
            $output_charset = 'UTF-8';
            if ($region) {
                $locale .= "_$region";
            }

            $ENV{LANGUAGE}       = $locale;    ## no critic qw(Variables::RequireLocalizedPunctuationVars)
            $ENV{OUTPUT_CHARSET} = 'UTF-8';    ## no critic qw(Variables::RequireLocalizedPunctuationVars)

            textdomain( $CONFIG->{'TEXTDOMAIN'} );
            bindtextdomain( $CONFIG->{'TEXTDOMAIN'}, $CONFIG->{'DIR'} );
        }
        else {
            carp 'No locale installed. Localization cannot work and is therefore disabled';
        }

        $cache->set_in_cache( $cache_key, 1 );
    }

    return ( $locale, $output_charset );
}

sub __ {    ## no critic qw(Subroutines::ProhibitUnusedPrivateSubroutines)
    my ($msgid) = @_;

    $msgid = Encode::encode_utf8($msgid);

    return _gettext( \&gettext, [$msgid] );
}

sub __x {    ## no critic qw(Subroutines::ProhibitUnusedPrivateSubroutines)
    my ( $msgid, %vars ) = @_;

    $msgid = Encode::encode_utf8($msgid);

    return _gettext( \&gettext, [$msgid], %vars );
}

sub __n {    ## no critic qw(Subroutines::ProhibitUnusedPrivateSubroutines)
    my ( $msgid, $msgid_plural, $count ) = @_;

    $msgid        = Encode::encode_utf8($msgid);
    $msgid_plural = Encode::encode_utf8($msgid_plural);

    return _gettext( \&ngettext, [ $msgid, $msgid_plural, $count ] );
}

sub __nx {
    my ( $msgid, $msgid_plural, $count, %vars ) = @_;

    $msgid        = Encode::encode_utf8($msgid);
    $msgid_plural = Encode::encode_utf8($msgid_plural);

    return _gettext( \&ngettext, [ $msgid, $msgid_plural, $count ], %vars );
}

sub __xn {    ## no critic qw(Subroutines::ProhibitUnusedPrivateSubroutines Subroutines::RequireArgUnpacking)
    return __nx(@_);
}

sub __p {    ## no critic qw(Subroutines::ProhibitUnusedPrivateSubroutines)
    my ( $msgctxt, $msgid ) = @_;

    $msgctxt = Encode::encode_utf8($msgctxt);
    $msgid   = Encode::encode_utf8($msgid);

    return _gettext( \&pgettext, [ $msgctxt, $msgid ] );
}

sub __px {    ## no critic qw(Subroutines::ProhibitUnusedPrivateSubroutines)
    my ( $msgctxt, $msgid, %vars ) = @_;

    $msgctxt = Encode::encode_utf8($msgctxt);
    $msgid   = Encode::encode_utf8($msgid);

    return _gettext( \&pgettext, [ $msgctxt, $msgid ], %vars );
}

sub __np {    ## no critic qw(Subroutines::ProhibitUnusedPrivateSubroutines)
    my ( $msgctxt, $msgid, $msgid_plural, $count ) = @_;

    $msgctxt      = Encode::encode_utf8($msgctxt);
    $msgid        = Encode::encode_utf8($msgid);
    $msgid_plural = Encode::encode_utf8($msgid_plural);

    return _gettext( \&npgettext, [ $msgctxt, $msgid, $msgid_plural, $count ] );
}

sub __npx {    ## no critic qw(Subroutines::ProhibitUnusedPrivateSubroutines)
    my ( $msgctxt, $msgid, $msgid_plural, $count, %vars ) = @_;

    $msgctxt      = Encode::encode_utf8($msgctxt);
    $msgid        = Encode::encode_utf8($msgid);
    $msgid_plural = Encode::encode_utf8($msgid_plural);

    return _gettext( \&npgettext, [ $msgctxt, $msgid, $msgid_plural, $count ], %vars );
}

sub N__ {    ## no critic qw(Subroutines::RequireArgUnpacking)
    return $_[0];
}

sub N__n {    ## no critic qw(NamingConventions::Capitalization Subroutines::RequireArgUnpacking)
    return $_[0];
}

sub N__p {    ## no critic qw(NamingConventions::Capitalization Subroutines::RequireArgUnpacking)
    return $_[1];
}

sub N__np {    ## no critic qw(NamingConventions::Capitalization Subroutines::RequireArgUnpacking)
    return $_[1];
}

sub _gettext {
    my ( $sub, $args, %vars ) = @_;

    init();

    my $text = Encode::decode_utf8( $sub->( @{$args} ) );
    if (%vars) {
        $text = _expand( $text, %vars );
    }

    return $text;
}

sub _expand {
    my ( $text, %vars ) = @_;

    my $re = join q{|}, map {quotemeta} keys %vars;
    $text =~ s/[{]($re)[}]/defined $vars{$1} ? $vars{$1} : "{$1}"/gesmx;

    return $text;
}

1;
