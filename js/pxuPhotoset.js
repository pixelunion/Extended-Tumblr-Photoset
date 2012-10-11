/*!
    --------------------------------
    PXU Photoset Extended
    --------------------------------
    + https://github.com/PixelUnion/Extended-Tumblr-Photoset
    + Version 1.3.0
    + Copyright 2012 Pixel Union
    + Licensed under the MIT license    
*/

(function( $ ){

    $.fn.pxuPhotoset = function( options, callback ) {

        var defaults = {
            'highRes'        : true,
            'rounded'        : 'corners',
            'borderRadius'   : '5px',
            'exif'           : true,
            'captions'       : true,
            'gutter'         : '10px',
            'photoset'       : '.photo-slideshow',
            'photoWrap'      : '.photo-data',
            'photo'          : '.photo'
        };

        var settings = $.extend(defaults, options);

        return this.each(function() {
            var $this = $(this);

            $this.imagesLoaded(function() {
            
                var getLayout = $this.data('layout');
                var layout = JSON.stringify(getLayout).split('');
                var rowCount = layout.length;

                // here we are going to combine rows, image count per row, 
                // and the last image number in each row (of total images)
                var rowArray=[];
                for (i = 1; i <= rowCount; ++i) {

                    // incremently add images so that we can split() them and make the rows
                    var lastImageInRow = 0;
                    for(var p = 0; p < i; ++p ) {
                        var increment = parseInt(layout[p],10);
                        lastImageInRow += increment;
                    }
                    
                    var rowImageCount = parseInt(layout[i-1],10);
                    // rowArray = (row number, images in row, last image in row)
                    rowArray[i] = Array(i, rowImageCount, lastImageInRow);
                }

                // create our rows
                for (var i = 1; i <= rowCount; i++) {

                    var firstPhoto;
                    if( i === 1 ) {
                        // first row, start at zero
                        firstPhoto = 0;
                    } else {
                        // after the first row, we find the previous row's last photo
                        firstPhoto = rowArray[i-1][2];
                    }

                    // now that we have our firstPhoto, we slice from it to the last photo in the row rowArray[i][2]
                    // and we add a clas to each of those images with however many images are in that row, eg: count-2
                    // and then we wrap them all in a div.row
                    $this.find(settings.photoWrap)
                        .slice(firstPhoto,rowArray[i][2]).addClass('count-' + rowArray[i][1]).wrapAll('<div class="row clearit" />');

                } // end create rows

                // apply gutter
                $(this).find('.row').css('margin-bottom',settings.gutter);
                $(this).find(settings.photoWrap+':not(:first-child) ' + settings.photo + ' img').css('margin-left', settings.gutter);

                // our function to find the minimum value
                Array.min = function( array ){
                     return Math.min.apply( Math, array );
                };

                function findHeights(photoset) {
                    photoset.find('.row').each(function() {
                        // check how many images are in this row
                        var currentRow = $(this);
                        var photoCount = currentRow.find(settings.photoWrap).length;
                        if( photoCount > 0 ) {
                            var imageHeights = currentRow.find(settings.photo+' img').map(function() {
                                return $(this).height();
                            }).get();
                            var smallestHeight = Array.min(imageHeights);
                            currentRow.height(smallestHeight).find(settings.photo).height(smallestHeight);
                        }
                    });
                }
                findHeights($this);
                $(window).resize(function() {
                    findHeights($this);
                });


                // EXIF data and CAPTIONS enabled
                if( settings.exif && settings.captions ) {

                    $this.find(settings.photoWrap).each(function() { 

                        var
                            thisImage = $(this).find('img');

                        var exifData;
                        var pxuCaption;

                        if( thisImage.hasClass('exif-yes') ) {
                            // exif data avialable

                            var exifCamera   = thisImage.data('camera')   || '-';
                            var exifISO      = thisImage.data('iso')      || '-';
                            var exifAperture = thisImage.data('aperture') || '-';
                            var exifExposure = thisImage.data('exposure') || '-';
                            var exifFocal    = thisImage.data('focal')    || '-';

                            exifData = '<table class="exif"><tr><td colspan="2"><span class="label">Camera</span><br>'+exifCamera+'</td></tr><tr><td><span class="label">ISO</span><br>'+exifISO+'</td><td><span class="label">Aperture</span><br>'+exifAperture+'</td></tr><tr><td><span class="label">Exposure</span><br>'+exifExposure+'</td><td><span class="label">Focal Length</span><br>'+exifFocal+'</td></tr></table>';
                        } else {
                            exifData = '';
                        }

                        if( thisImage.hasClass('caption-yes') ) {
                            var getCaption = thisImage.data('caption');
                            pxuCaption = '<p class="pxu-caption">'+getCaption+'</p>';
                        } else {
                            pxuCaption = '';
                        }

                        if( pxuCaption !== '' || exifData !== '' ) {
                            $(this).find('.info').append('<div class="pxu-data">'+pxuCaption+exifData+'<span class="arrow-down"></span></div>'); 

                            if( exifData === '' ) {
                                $(this).find('.pxu-data').addClass('caption-only');
                            }           

                            $(this).find('span.info').css('display','block');
                        }
                        
                    });

                }
                
                // Roll through EXIF data ONLY
                else if( settings.exif ) {

                    $this.find(settings.photoWrap).each(function() {
                        var thisImage = $(this).find('img');

                        if( thisImage.hasClass('exif-yes') ) {
                            // exif data avialable

                            var exifCamera   = thisImage.data('camera')   || '-';
                            var exifISO      = thisImage.data('iso')      || '-';
                            var exifAperture = thisImage.data('aperture') || '-';
                            var exifExposure = thisImage.data('exposure') || '-';
                            var exifFocal    = thisImage.data('focal')    || '-';

                            var exifData = '<table class="exif"><tr><td colspan="2"><span class="label">Camera</span><br>'+exifCamera+'</td></tr><tr><td><span class="label">ISO</span><br>'+exifISO+'</td><td><span class="label">Aperture</span><br>'+exifAperture+'</td></tr><tr><td><span class="label">Exposure</span><br>'+exifExposure+'</td><td><span class="label">Focal Length</span><br>'+exifFocal+'</td></tr></table><span class="arrow-down"></span>';
                        
                            $(this).find('.info').append('<div class="pxu-data">'+exifData+'</div>');            

                            $(this).find('span.info').css('display','block');
                        }            
                 
                    });

                } // end EXIF

                // Roll through caption data ONLY
                else if( settings.captions ) {

                    $this.find(settings.photoWrap).each(function() {
                        var thisImage  = $(this).find('img');

                        if( thisImage.hasClass('caption-yes') ) {
                            var getCaption = thisImage.data('caption');
                            var pxuCaption = '<p class="pxu-caption" style="margin:0;">'+getCaption+'</p>';

                            $(this).find('.info').append('<div class="pxu-data caption-only">'+pxuCaption+'<span class="arrow-down"></span></div>');            

                            $(this).find('span.info').css('display','block');

                        }
                        
                    });

                } // end CAPTIONS

                // Roll through HighRes data and replace the images
                if( settings.highRes ) {
                    $this.find(settings.photoWrap).each(function() {
                        var thisImage = $(this).find('.photo img');
                        var bigOne    = thisImage.data('highres');

                        thisImage.attr('src', bigOne);
                    });
                } // end HIGH RES

                // Round the corners on the top and bottom rows
                if( settings.rounded == 'corners' ) {

                    var rows = $this.find('.row');

                    if( rowCount == 1 ) {
                        // only one row
                        rows.find(settings.photoWrap + ':first-child ' + settings.photo).css({
                            borderRadius: settings.borderRadius + ' 0 0 ' + settings.borderRadius
                        });
                        rows.find(settings.photoWrap + ':last-child ' + settings.photo).css({
                            borderRadius: '0 '+ settings.borderRadius + ' ' + settings.borderRadius + ' 0'
                        });
                    } else {
                        // more than one row
                        for (var row = 0; row < rowCount; row++) {
                            var count;
                            if( row === 0 ) {
                                // first row
                                count = rows.eq(row).find(settings.photo).size();
                                if( count == 1 ) {
                                    rows.eq(row).find(settings.photo).css({
                                        borderRadius: settings.borderRadius + ' ' + settings.borderRadius + ' 0 0'
                                    });
                                } else {
                                    rows.eq(row).find(settings.photoWrap + ':first-child ' + settings.photo).css({
                                        borderRadius: settings.borderRadius + ' 0 0 0'
                                    });
                                    rows.eq(row).find(settings.photoWrap + ':last-child ' + settings.photo).css({
                                        borderRadius: '0 '+settings.borderRadius +' 0 0'
                                    });
                                } 
                            }

                            if( row == rowCount-1) {
                                // we're on the last row
                                count = rows.eq(row).find(settings.photo).size();
                                if( count == 1 ) {
                                    rows.eq(row).find(settings.photo).css({
                                        borderRadius: '0 0 '+settings.borderRadius +' '+settings.borderRadius
                                    });
                                } else {
                                    rows.eq(row).find(settings.photoWrap + ':first-child ' + settings.photo).css({
                                        borderRadius: '0 0 0 '+settings.borderRadius
                                    });
                                    rows.eq(row).find(settings.photoWrap + ':last-child ' + settings.photo).css({
                                        borderRadius: '0 0 '+settings.borderRadius +' 0'
                                    });
                                }
                            } // end last row

                        } // end for loop

                    } // end else
                
                } // end ROUNDED

                // Round the corners on the top and bottom rows
                if( settings.rounded == 'all' ) {

                    $this.find(settings.photo).css({ borderRadius: settings.borderRadius });
                
                } // end ROUNDED

                // Round the corners on the top and bottom rows
                if( !settings.rounded ) {

                    $this.find(settings.photo).css({ borderRadius: 0 });
                
                } // end ROUNDED

                // We're done! Add a 'processed' class so people can tie other processes into it

                $this.addClass('processed');

                // callback if provided
                if (typeof callback == 'function') { // make sure the callback is a function
                        callback.call(this);
                }

            }); // end imagesLoaded

            // opacity change on icons
            $(settings.photoWrap)
            .on("mouseenter", function() { $(this).find('.icons').css("visibility", "visible"); } )
            .on("mouseleave", function() { $(this).find('.icons').css("visibility", "hidden"); } );

            // display photo info
            $("span.info")
            .on("mouseenter", function() {
                var toggle = $(this);
                var exifData = toggle.children('.pxu-data');
                exifData.css('display','block').stop(true, false).animate({opacity: 1}, 200);        
            });
            $("span.info")
            .on("mouseleave", function() {
                var toggle = $(this);
                var exifData = toggle.children('.pxu-data');
                exifData.stop(true, false).animate({opacity: 0}, 200, function() {
                    $(this).css('display','none');
                });        
            });

        }); // end return each
    
    }; // end PXU Photoset Extended

})( jQuery );
