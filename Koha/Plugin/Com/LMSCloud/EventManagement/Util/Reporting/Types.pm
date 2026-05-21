package Koha::Plugin::Com::LMSCloud::EventManagement::Util::Reporting::Types;

use Modern::Perl;
use utf8;

use Exporter qw( import );
use Readonly qw( Readonly );

our $VERSION = '1.0.0';

Readonly our $COUNTER     => 'counter';
Readonly our $TIME_SERIES => 'time_series';
Readonly our $TOP_N       => 'top_n';

Readonly our @METRIC_TYPES => ( $COUNTER, $TIME_SERIES, $TOP_N );

Readonly our $BUCKET_DAY   => 'day';
Readonly our $BUCKET_WEEK  => 'week';
Readonly our $BUCKET_MONTH => 'month';

Readonly our @BUCKETS => ( $BUCKET_DAY, $BUCKET_WEEK, $BUCKET_MONTH );

our @EXPORT_OK = qw(
    $COUNTER $TIME_SERIES $TOP_N @METRIC_TYPES
    $BUCKET_DAY $BUCKET_WEEK $BUCKET_MONTH @BUCKETS
);

1;
