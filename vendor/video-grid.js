var VideoGrid = (function() {

    // list of items
    var $grid = null,
    // the items
    $items = null,
    // current expanded item's index
    current = -1,
    // position (top) of the expanded item
    // used to know if the preview will expand in a different row
    previewPos = -1,
    // extra amount of pixels to scroll the window
    scrollExtra = 0,
    // extra margin when expanded (between preview overlay and the next items)
    marginExpanded = 10,
    $window = $( window ), winsize,
    $body = $( 'html, body' ),
    // transitionend events
    transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd',
      'MozTransition' : 'transitionend',
      'OTransition' : 'oTransitionEnd',
      'msTransition' : 'MSTransitionEnd',
      'transition' : 'transitionend'
    },
    transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
    // support for csstransitions
    support = Modernizr.csstransitions,
    // default settings
    settings = {
      maxHeight : 480,
      speed : 350,
      easing : 'ease'
    };

  function init( config ) {
    // Get the grid and items here because they are loaded after this library loads.
    $grid = $('.js-videos-grid');
    $items = $grid.children('li');

    // the settings..
    settings = $.extend( true, {}, settings, config );
    // save item´s size and offset
    saveItemInfo( true );
    // get window´s size
    getWinSize();
    // initialize some events
    initEvents();
  }

  // add more items to the grid.
  // the new items need to appended to the grid.
  // after that call Grid.addItems(theItems);
  function addItems( $newitems ) {

    $items = $items.add( $newitems );

    $newitems.each( function() {
      var $item = $( this );
      $item.data( {
        offsetTop : $item.offset().top,
        height : $item.height()
      } );
    } );

    initItemsEvents( $newitems );

  }

  // saves the item´s offset top and height (if saveheight is true)
  function saveItemInfo( saveheight ) {
    $items.each( function() {
      var $item = $( this );
      $item.data( 'offsetTop', $item.offset().top );
      if( saveheight ) {
        $item.data( 'height', $item.height() );
      }
    } );
  }

  function initEvents() {

    // when clicking an item, show the preview with the item´s info and large image.
    // close the item if already expanded.
    // also close if clicking on the item´s cross
    initItemsEvents( $items );

    // on window resize get the window´s size again
    // reset some values..
    $window.on( 'debouncedresize', function() {

      scrollExtra = 0;
      previewPos = -1;
      // save item´s offset
      saveItemInfo();
      getWinSize();
      var preview = $.data( this, 'preview' );
      if( typeof preview != 'undefined' ) {
        hidePreview();
      }

    } );

  }

  function initItemsEvents( $items ) {
    $items.on( 'click', 'span.video-grid-close', function() {
      hidePreview();
      return false;
    } ).children( 'a' ).on( 'click', function(e) {

      var $item = $( this ).parent();
      // check if item already opened
      current === $item.index() ? hidePreview() : showPreview( $item );
      return false;

    } );
  }

  function getWinSize() {
    winsize = { width : $window.width(), height : $window.height() };
  }

  function showPreview( $item ) {

    var preview = $.data( this, 'preview' ),
      // item´s offset top
      position = $item.data( 'offsetTop' );

    scrollExtra = 0;

    // if a preview exists and previewPos is different (different row) from item´s top then close it
    if( typeof preview != 'undefined' ) {

      // not in the same row
      if( previewPos !== position ) {
        // if position > previewPos then we need to take te current preview´s height in consideration when scrolling the window
        if( position > previewPos ) {
          scrollExtra = preview.height;
        }
        hidePreview();
      }
      // same row
      else {
        preview.update( $item );
        return false;
      }

    }

    // update previewPos
    previewPos = position;
    // initialize new preview for the clicked item
    preview = $.data( this, 'preview', new Preview( $item ) );
    // expand preview overlay
    preview.open();

  }

  function hidePreview() {
    current = -1;
    var preview = $.data( this, 'preview' );
    preview.close();
    $.removeData( this, 'preview' );
  }

  // the preview obj / overlay
  function Preview( $item ) {
    this.$item = $item;
    this.expandedIdx = this.$item.index();
    this.create();
    this.update();
  }

  Preview.prototype = {
    create : function() {
      // create Preview structure:
      this.$title = $( '<h3></h3>' );
      this.$description = $( '<p></p>' );
      this.$href = $( '<a href="#">Visit website</a>' );
      this.$details = $( '<div class="video-grid-details"></div>' ).append( this.$title, this.$description, this.$href );
      this.$video = $( '<video onclick="this.paused?this.play():this.pause();" class="video-grid-video" width="640" height="480" controls></video>' );
      this.$closePreview = $( '<span class="video-grid-close"></span>' );
      this.$previewInner = $( '<div class="video-grid-expander-inner"></div>' ).append( this.$closePreview, this.$video, this.$details );
      this.$previewEl = $( '<div class="video-grid-expander"></div>' ).append( this.$previewInner );
      // append preview element to the item
      this.$item.append( this.getEl() );
      // set the transitions for the preview and the item
      if( support ) {
        this.setTransition();
      }
    },
    update : function( $item ) {

      if( $item ) {
        this.$item = $item;
      }

      // if already expanded remove class "video-grid-expanded" from current item and add it to new item
      if( current !== -1 ) {
        var $currentItem = $items.eq( current );
        $currentItem.removeClass( 'video-grid-expanded' );
        this.$item.addClass( 'video-grid-expanded' );
        // position the preview correctly
        this.positionPreview();
      }

      // update current value
      current = this.$item.index();

      // update preview´s content
      var $itemEl = this.$item.children( 'a' ),
        eldata = {
          href : $itemEl.attr( 'href' ),
          webm : $itemEl.data( 'webm' ),
          ogg : $itemEl.data( 'ogg' ),
          mp4 : $itemEl.data( 'mp4' ),
          title : $itemEl.data( 'title' ),
          description : $itemEl.data( 'description' )
        };

      this.$title.html( eldata.title );
      this.$description.html( eldata.description );
      this.$href.attr( 'href', eldata.href );

      var self = this;

      // remove the current image in the preview
      if( typeof self.$webVideoSource != 'undefined' ) self.$webVideoSource.remove();
      if( typeof self.$oggVideoSource != 'undefined' ) self.$oggVideoSource.remove();
      if( typeof self.$mp4VideoSource != 'undefined' ) self.$mp4VideoSource.remove();

      // Display Video Preview
      if( self.$video.is( ':visible' ) ) {
        self.$video.find( 'source' ).remove();
        if (eldata.webm) {
          self.$webmVideoSource = $('<source src="' + eldata.webm + '" type="video/webm">')
          self.$video.append( self.$webmVideoSource );
        }
        if (eldata.ogg) {
          self.$oggVideoSource = $('<source src="' + eldata.ogg + '" type="video/ogg">')
          self.$video.append( self.$oggVideoSource );
        }
        if (eldata.mp4) {
          self.$mp4VideoSource = $('<source src="' + eldata.mp4 + '" type="video/mp4">')
          self.$video.append( self.$mp4VideoSource );
        }
      }

      self.$video.load();

    },
    open : function() {

      setTimeout( $.proxy( function() {
        // set the height for the preview and the item
        this.setHeights();
        // scroll to position the preview in the right place
        this.positionPreview();
      }, this ), 25 );

    },
    close : function() {

      var self = this,
        onEndFn = function() {
          if( support ) {
            $( this ).off( transEndEventName );
          }
          self.$item.removeClass( 'video-grid-expanded' );
          self.$previewEl.remove();
        };

      setTimeout( $.proxy( function() {
        // TODO: Do we need this?
        // if( typeof this.$video !== 'undefined' ) {
        //   this.$video.fadeOut( 'fast' );
        // }
        this.$previewEl.css( 'height', 0 );
        // the current expanded item (might be different from this.$item)
        var $expandedItem = $items.eq( this.expandedIdx );
        $expandedItem.css( 'height', $expandedItem.data( 'height' ) ).on( transEndEventName, onEndFn );

        if( !support ) {
          onEndFn.call();
        }

      }, this ), 25 );

      return false;

    },
    calcHeight : function() {

      var heightPreview = winsize.height - this.$item.data( 'height' ) - marginExpanded,
        itemHeight = winsize.height;

      if( heightPreview > settings.maxHeight ) {
        heightPreview = settings.maxHeight;
        itemHeight = settings.maxHeight + this.$item.data( 'height' ) + marginExpanded;
      }

      this.height = heightPreview;
      this.itemHeight = itemHeight;
    },
    setHeights : function() {

      var self = this,
        onEndFn = function() {
          if( support ) {
            self.$item.off( transEndEventName );
          }
          self.$item.addClass( 'video-grid-expanded' );
        };

      this.calcHeight();
      this.$previewEl.css( 'height', this.height );
      this.$item.css( 'height', this.itemHeight ).on( transEndEventName, onEndFn );

      if( !support ) {
        onEndFn.call();
      }

    },
    positionPreview : function() {

      // scroll page
      // case 1 : preview height + item height fits in window´s height
      // case 2 : preview height + item height does not fit in window´s height and preview height is smaller than window´s height
      // case 3 : preview height + item height does not fit in window´s height and preview height is bigger than window´s height
      var position = this.$item.data( 'offsetTop' ),
        previewOffsetT = this.$previewEl.offset().top - scrollExtra,
        scrollVal = this.height + this.$item.data( 'height' ) + marginExpanded <= winsize.height ? position : this.height < winsize.height ? previewOffsetT - ( winsize.height - this.height ) : previewOffsetT;

      $body.animate( { scrollTop : scrollVal }, settings.speed );

    },
    setTransition  : function() {
      this.$previewEl.css( 'transition', 'height ' + settings.speed + 'ms ' + settings.easing );
      this.$item.css( 'transition', 'height ' + settings.speed + 'ms ' + settings.easing );
    },
    getEl : function() {
      return this.$previewEl;
    }
  }

  return {
    init : init,
    addItems : addItems
  };

})();