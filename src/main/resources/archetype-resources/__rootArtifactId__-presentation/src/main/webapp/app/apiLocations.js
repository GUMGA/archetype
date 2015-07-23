#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )

define(function () {
    'use strict';
    return {
        apiLocation: location.origin+"/${parentArtifactId}-api"
    };
});
