var s,
FlickrGallery = {

    settings: {
        imagesPerGallery: 4,
        gallery: $('.gallery'),
        addButton: $('#add-button'),
        container: $('.container'),
        input: $('.edit-block').find('input'),
        list: $('.list')
    },

    init: function() {
        s = this.settings;
        this.bindUIActions();
    },

    bindUIActions: function() {
        s.input.keyup(function(){
            $('.error').hide()
        });

        $('.remove-all').on('click', function(){
            $('.gallery').add('.list li').remove();
        });

        s.container.on('click', '.remove-one',  function(){
            FlickrGallery.removeGallery($(this).closest('li').attr('data-tag'));
        });

        s.addButton.on('click', function() {
            FlickrGallery.addGallery(s.input.val());
        });

        s.container.on('click', '.sorting-block a',  function(event){
            event.preventDefault();
            FlickrGallery.sortImages($(this).attr('class'), $(this).closest('.gallery').attr('data-tag'));
        });
    },

    addGallery: function(tag) {
        var imgDiv;
        s.input.val('');

        if(!tag){
            $('.error').show();
            return false
        }

        if(tag.indexOf(' ') >= 0)
            tag = tag.replace(/\s/g, '');

        $('.loader').show();
        s.container.hide();

        s.container.append('<div class="gallery" data-tag="' + tag + '"><div><span>tag: ' + tag + '</span><div class="sorting-block">Sort by: <a href="#" class="published">date published</a>&nbsp;&nbsp;<a href="#" class="taken">date taken</a></div></div></div>');
        s.list.append('<li data-tag="' + tag + '">' + tag + '&nbsp;&nbsp;<a href="#" class="remove-one">Remove</a></li>');

        imgDiv = '';
        $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?", {
                tags: tag,
                format: "json"
            },

            function (data) {
                console.log(data);
                if(data.items.length == 0)
                    $('.gallery[data-tag=' + tag + ']').append('<h3>There are no such images with this tag</h3>');

                $.each(data.items, function (i, item) {
                    if (i == s.imagesPerGallery) return false;
                    imgDiv += '<a href=' + item.link + ' target="_blank" data-published=' + item.published.split('T')[0] + ' data-taken=' + item.date_taken.split('T')[0] + '><div class="date-info">'+item.date_taken.split('T')[0]+' - taken'+ '</div><div class="date-info">'+item.published.split('T')[0]+' - published'+'</div>'+'<img data-tag="' + tag + ' "src="' + item.media.m + '" /></a>';
                });

                $('.gallery[data-tag=' + tag + ']').append(imgDiv);
                $('.loader').hide();
                s.container.show();

            });

    },

    removeGallery: function(tag) {
        $('.gallery[data-tag=' + tag + ']').add('.list li[data-tag=' + tag + ']').remove()
    },

    sortImages: function(sortType, tag) {
        var html;
        html = '';
        var arr = [];
        $('.gallery[data-tag=' + tag + '] > a').each(function() {
            var obj = {},
                $el = $(this),
                time = $el.attr('data-' + sortType),
                date = new Date($.trim(time)),
                timestamp = date.getTime();

            obj.html = $el[0].outerHTML;
            obj.time = timestamp;

            arr.push(obj);
        });

        var sorted = arr.sort(function( a, b ) {
            return a.time > b.time;
        });

        for( var i = 0; i < sorted.length; ++i ) {
            html += sorted[i].html;
        }
        $('.gallery[data-tag=' + tag + '] > a').remove();
        $('.gallery[data-tag=' + tag + ']').append(html);

    }
};


$(function(){
    FlickrGallery.init();
});


