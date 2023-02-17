#!/usr/bin/perl
#
# Copyright 2017 Marywood University
#
# This file is not part of Koha.
#
# Koha is free software; you can redistribute it and/or modify it
# under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 3 of the License, or
# (at your option) any later version.
#
# Koha is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Koha; if not, see <http://www.gnu.org/licenses>.
use Modern::Perl;
use utf8;
use 5.032;
use English qw(-no_match_vars);

use C4::Auth qw( get_template_and_user );
use C4::Context;
use C4::Output qw( output_html_with_http_headers );

use File::Basename;
use File::Spec;
use CGI qw ( -utf8 );

our $VERSION = '1.0.0';

no if ( $PERL_VERSION >= 5.018 ), 'warnings' => 'experimental';

my @dirs = File::Spec->splitdir( dirname(__FILE__) );

splice @dirs, -1;
my $plugin_dir = File::Spec->catdir(@dirs);

my $query = CGI->new;
my ( $template, $borrowernumber, $cookie ) = get_template_and_user(
    {   template_name   => $plugin_dir . '/views/opac/events.tt',
        query           => $query,
        type            => 'opac',
        authnotrequired => 1,
        is_plugin       => 1,
    }
);

$template->param( borrowernumber => $borrowernumber, );

output_html_with_http_headers $query, $cookie, $template->output;
