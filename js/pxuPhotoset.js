/*!
    --------------------------------
    PXU Photoset Extended
    --------------------------------
    + https://github.com/PixelUnion/Extended-Tumblr-Photoset
    + Version 1.1.0
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

        var options = $.extend(defaults, options);

        return this.each(function() {
            var $this = $(this);

            $this.imagesLoaded(function() {
            
                var getLayout = $this.data('layout');
                var layout = JSON.stringify(getLayout).split('');

                // check how many rows there are
                var rowCount = [];
                for (var i = 1; i < layout.length + 1; i++) {
                    rowCount.push(i);
                }

                // here we are going to combine rows, image count per row, 
                // and the last image number in each row (of total images)
                var result=[];
                for (i = 0; i < rowCount.length; ++i) {

                    // incremently add images so that we can split() them and make the rows
                    var pN = 0;
                    for(p = 0; p < i + 1; ++p ) {
                        increment = parseInt(layout[p]);
                        pN += increment;
                    }
                    
                    var lN = parseInt(layout[i]);
                    // result = (row, image count, last image in row)
                    result[i] = Array(rowCount[i], lN, pN);
                }

                // create our rows
                for (var i = 0; i < rowCount.length; i++) {

                    var pC;
                    if( result[i-1] === undefined ) {
                        pC = 0
                    } else {
                        pC = result[i-1][2]
                    }

                    $this.find(options.photoWrap)
                        .slice(pC,result[i][2]).addClass('count-' + result[i][1]).wrapAll('<div class="row clearit" />');

                } // end create rows

                // apply gutter
                $(this).find('.row').css('margin-bottom',options.gutter);
                $(this).find(options.photoWrap+':not(:first-child) ' + options.photo + ' img').css('margin-left', options.gutter);

                // our function to find the minimum value
                Array.min = function( array ){
                     return Math.min.apply( Math, array );
                };

                function findHeights(photoset) {
                    photoset.find('.count-1 img').each(function() {
                        var c1height = $(this).height();
                        $(this).parents('.row').height(c1height);
                    });

                    // find the shortest image in rows that have two images
                    var c2heights = photoset.find('.count-2 img').map(function() {
                        return $(this).height();
                    }).get();
                    var c2min = Array.min(c2heights);

                    // find the shortest image in rows that have three images
                    var c3heights = photoset.find('.count-3 img').map(function() {
                        return $(this).height();
                    }).get();
                    var c3min = Array.min(c3heights);

                    photoset.find('.count-2').parents('.row').css({height: c2min});
                    photoset.find('.count-2').children(options.photo).css({height: c2min});
                    photoset.find('.count-3').parents('.row').css({height: c3min});
                    photoset.find('.count-3').children(options.photo).css({height: c3min});
                }
                findHeights($this);
                $(window).resize(function() {
                    findHeights($this);
                });


                // EXIF data and CAPTIONS enabled
                if( options.exif == true && options.captions == true ) {

                    $this.find(options.photoWrap).each(function() { 

                        var
                            thisImage = $(this).find('img');

                        var exifData;
                        var pxuCaption;

                        if( thisImage.hasClass('exif-yes') ) {
                            // exif data avialable

                            var
                                exifCamera   = thisImage.data('camera') || '-'
                                exifISO      = thisImage.data('iso') || '-'
                                exifAperture = thisImage.data('aperture') || '-'
                                exifExposure = thisImage.data('exposure') || '-'
                                exifFocal    = thisImage.data('focal') || '-';

                            exifData = '<table class="exif"><tr><td colspan="2"><span class="label">Camera</span><br>'+exifCamera+'</td></tr><tr><td><span class="label">ISO</span><br>'+exifISO+'</td><td><span class="label">Aperture</span><br>'+exifAperture+'</td></tr><tr><td><span class="label">Exposure</span><br>'+exifExposure+'</td><td><span class="label">Focal Length</span><br>'+exifFocal+'</td></tr></table>';
                        } else {
                            exifData = ''
                        }

                        if( thisImage.hasClass('caption-yes') ) {
                            var getCaption = thisImage.data('caption');
                            pxuCaption = '<p class="pxu-caption">'+getCaption+'</p>';
                        } else {
                            pxuCaption = '';
                        }

                        if( pxuCaption != '' || exifData != '' ) {
                            $(this).find('.info').append('<div class="pxu-data">'+pxuCaption+exifData+'<span class="arrow-down"></span></div>'); 

                            if( exifData == '' ) {
                                $(this).find('.pxu-data').addClass('caption-only');
                            }           

                            $(this).find('span.info').css('display','block');
                        }
                        
                    });

                }
                
                // Roll through EXIF data ONLY
                else if( options.exif == true ) {

                    $this.find(options.photoWrap).each(function() {
                        var thisImage = $(this).find('img');

                        if( thisImage.hasClass('exif-yes') ) {
                            // exif data avialable

                            var
                                exifCamera   = thisImage.data('camera') || '-'
                                exifISO      = thisImage.data('iso') || '-'
                                exifAperture = thisImage.data('aperture') || '-'
                                exifExposure = thisImage.data('exposure') || '-'
                                exifFocal    = thisImage.data('focal') || '-';

                            var exifData = '<table class="exif"><tr><td colspan="2"><span class="label">Camera</span><br>'+exifCamera+'</td></tr><tr><td><span class="label">ISO</span><br>'+exifISO+'</td><td><span class="label">Aperture</span><br>'+exifAperture+'</td></tr><tr><td><span class="label">Exposure</span><br>'+exifExposure+'</td><td><span class="label">Focal Length</span><br>'+exifFocal+'</td></tr></table><span class="arrow-down"></span>';
                        
                            $(this).find('.info').append('<div class="pxu-data">'+exifData+'</div>');            

                            $(this).find('span.info').css('display','block');
                        }            
                 
                    });

                } // end EXIF

                // Roll through caption data ONLY
                else if( options.captions == true ) {

                    $this.find(options.photoWrap).each(function() {
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
                if( options.highRes == true ) {
                    $this.find(options.photoWrap).each(function() {
                        var
                            thisImage = $(this).find('.photo img')
                            bigOne    = thisImage.data('highres');

                        thisImage.attr('src', bigOne);
                    });
                } // end HIGH RES

                // Round the corners on the top and bottom rows
                if( options.rounded == 'corners' ) {

                    var
                        rows = $this.find('.row'),
                        rowCount = $this.find('.row').size(),
                        lastRow = ($this.find('.row').size()) - 1;

                    if( rowCount == 1 ) {
                        rows.find(options.photoWrap + ':first-child ' + options.photo).css({
                            borderRadius: options.borderRadius + ' 0 0 ' + options.borderRadius
                        });
                        rows.find(options.photoWrap + ':last-child ' + options.photo).css({
                            borderRadius: '0 '+ options.borderRadius + ' ' + options.borderRadius + ' 0'
                        });
                    } else {

                        for (var i = 0; i < rows.length; i++) {
                                
                            if( i == 0 ) {
                                count = rows.eq(i).find(options.photo).size();
                                if( count == 1 ) {
                                    rows.eq(i).find(options.photo).css({
                                        borderRadius: options.borderRadius + ' ' + options.borderRadius + ' 0 0'
                                    })
                                } else if ( count == 2 || count == 3 ) {
                                    rows.eq(i).find(options.photoWrap + ':first-child ' + options.photo).css({
                                        borderRadius: options.borderRadius + ' 0 0 0'
                                    });
                                    rows.eq(i).find(options.photoWrap + ':last-child ' + options.photo).css({
                                        borderRadius: '0 '+options.borderRadius +' 0 0'
                                    })
                                } 
                            }

                            if( i == lastRow) {
                                count = rows.eq(i).find(options.photo).size();
                                if( count == 1 ) {
                                    rows.eq(i).find(options.photo).css({
                                        borderRadius: '0 0 '+options.borderRadius +' '+options.borderRadius
                                    })
                                } else if ( count == 2 || count == 3 ) {
                                    rows.eq(i).find(options.photoWrap + ':first-child ' + options.photo).css({
                                        borderRadius: '0 0 0 '+options.borderRadius
                                    });
                                    rows.eq(i).find(options.photoWrap + ':last-child ' + options.photo).css({
                                        borderRadius: '0 0 '+options.borderRadius +' 0'
                                    })
                                }
                            } // end last row

                        } // end for loop

                    } // end else
                
                } // end ROUNDED

                // Round the corners on the top and bottom rows
                if( options.rounded == 'all' ) {

                    $this.find(options.photo).css({ borderRadius: options.borderRadius });
                
                } // end ROUNDED

                // Round the corners on the top and bottom rows
                if( options.rounded == false ) {

                    $this.find(options.photo).css({ borderRadius: 0 });
                
                } // end ROUNDED

                // We're done! Add a 'processed' class so people can tie other processes into it

                $this.addClass('processed');

                // callback if provided
                if (typeof callback == 'function') { // make sure the callback is a function
                        callback.call(this);
                }

            }); // end imagesLoaded

            // opacity change on icons
            $(options.photoWrap)
            .live("mouseenter", function() { $(this).find('.icons').css("visibility", "visible"); } )
            .live("mouseleave", function() { $(this).find('.icons').css("visibility", "hidden"); } );

            // display photo info
            $("span.info")
            .live("mouseenter", function() {
                var 
                    toggle = $(this)
                    exifData = toggle.children('.pxu-data');
                exifData.css('display','block').stop(true, false).animate({opacity: 1}, 200);        
            });
            $("span.info")
            .live("mouseleave", function() {
                var 
                    toggle = $(this)
                    exifData = toggle.children('.pxu-data');
                exifData.stop(true, false).animate({opacity: 0}, 200, function() {
                    $(this).css('display','none');
                });        
            });

        }); // end return each
    
    }; // end PXU Photoset Extended

})( jQuery );
