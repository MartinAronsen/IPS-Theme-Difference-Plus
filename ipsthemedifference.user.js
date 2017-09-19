// ==UserScript==
// @name         IPS Theme Difference Plus
// @namespace    https://github.com/MartinAronsen/IPS-Theme-Difference-Plus/
// @version      0.2
// @description  Work magic on the Theme Difference tool by IPS
// @author       Preben Liland Madsen ( Modified by Martin Aronsen )
// @updateURL    https://github.com/MartinAronsen/IPS-Theme-Difference-Plus/raw/master/ipsthemedifference.user.js
// @downloadURL  https://github.com/MartinAronsen/IPS-Theme-Difference-Plus/raw/master/ipsthemedifference.user.js
// @match        https://invisioncommunity.com/index.php?app=core&module=system&controller=plugins&do=diff
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if( $('.ipsType_pageTitle').text() != 'Theme Differences')
    {
        $('#ipsTabs_elThemeDiffs_el_themeDiffsHtml_panel .ipsHr').hide();
        $('#ipsTabs_elThemeDiffs_el_themeDiffsHtml_panel table.diff').hide();

        var applications = [];

        $('#ipsTabs_elThemeDiffs_el_themeDiffsHtml_panel .ipsSpacer_bottom').each( function(index) {
            var index_name_mappings = [ 'application', 'location', 'group', 'template'];
            var outerDiv = this;
            var templateLocation = '';
            $(this).find('.ipsGrid_span3 .ipsType_large').each( function( index_name ) {
                var itemName = $(this).text();
                switch( index_name ) {
                    case 0:
                        if( applications.indexOf(itemName)==-1 )
                            applications.push( itemName );

                        if ( itemName == "Commerce" ) { itemName = "Nexus"; }

                        templateLocation += itemName.toLowerCase();
                        break;
                    case 1:
                        templateLocation += '/' + itemName;
                        break;
                    case 2:
                        templateLocation += '/' + itemName;
                        break;
                    case 3:
                        templateLocation += '/' + itemName + '.phtml';
                        $(outerDiv).find('.ipsGrid.ipsAreaBackground_light').append( `<div class="clickToHide ipsGrid_span12"><span class="ipsType_large">${templateLocation}</span></div>`);
                        $(outerDiv).on( 'click', function() {
                            if( $(outerDiv).find('table.diff').length ) {
                                $(outerDiv).find('table.diff').toggle();
                            }
                        });
                        break;
                }
                $(outerDiv).attr('data-' + index_name_mappings[index_name], $(this).text());
                if( $(outerDiv).find('.ipsPad.ipsType_center.ipsType_large').length ) {
                    var noDiffDiv = $(outerDiv).find('.ipsPad.ipsType_center.ipsType_large');
                    var datastate = $(noDiffDiv).find('strong').text();
                    $(outerDiv).attr('data-state', datastate);
                }
            });
        });


        $('.ipsPageHeader').append('<form>Application: <select id="selectApplications"><option value="all">All</option></select></form>');
        applications.forEach( function(value) {
            $('#selectApplications')
                .append($('<option>', { value : value })
                        .text(value));
        });

        $('.ipsPageHeader').append('<form>Location: <select id="selectLocation"><option value="all" selected>All</option><option value="admin">Admin</option><option value="front">Front</option><option value="global">Global</option></select></form>');

        var selectedLoc = $( "#selecLocation option:selected" ).val();
        var selectedApp = $( "selectApplications option:selected" ).val();

        $( "#ipsTabs_elThemeDiffs_el_themeDiffsHtml_panel .ipsSpacer_bottom[data-state='added']" ).css({
            'background' :  'green',
            'opacity' : '0.6'
        });
        $( "#ipsTabs_elThemeDiffs_el_themeDiffsHtml_panel .ipsSpacer_bottom[data-state='deleted']" ).css({
            'background' :  'red',
            'opacity' : '0.6'
        });

        $( "#ipsTabs_elThemeDiffs_el_themeDiffsHtml_panel .ipsSpacer_bottom .ipsPad.ipsType_center.ipsType_large" ).css('color', 'white');

        $('#selectApplications, #selectLocation').change( function()
        {
            selectedApp = $( "#selectApplications option:selected" ).val();
            selectedLoc = $( "#selectLocation option:selected" ).val();

            if( selectedLoc == 'all' && selectedApp == 'all' )
            {
                $( "#ipsTabs_elThemeDiffs_el_themeDiffsHtml_panel .ipsSpacer_bottom" ).show();
            }
            else
            {
                $( "#ipsTabs_elThemeDiffs_el_themeDiffsHtml_panel .ipsSpacer_bottom" ).hide();

                if ( selectedLoc == 'all' && selectedApp != 'all' )
                {
                    $( `#ipsTabs_elThemeDiffs_el_themeDiffsHtml_panel [data-application='${selectedApp}']` ).show();
                }
                else if ( selectedLoc != 'all' && selectedApp != 'all' )
                {
                    $( `#ipsTabs_elThemeDiffs_el_themeDiffsHtml_panel [data-application='${selectedApp}'][data-location='${selectedLoc}']` ).show();
                }
                else if ( selectedLoc != 'all' && selectedApp == 'all')
                {
                    $( `#ipsTabs_elThemeDiffs_el_themeDiffsHtml_panel [data-location='${selectedLoc}']` ).show();
                }
            }
        });
    }
})();
