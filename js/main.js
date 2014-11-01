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

            $('body').on('click', '.remove-one',  function(){
                FlickrGallery.removeGallery($(this).closest('li').attr('data-tag'));
            });

            s.addButton.on('click', function() {
                FlickrGallery.addGallery(s.imagesPerGallery, s.input.val());
            });
        },

        addGallery: function(imagesPerGallery, tag) {
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

            s.container.append('<div class="gallery" data-tag="' + tag + '"><h3>tag: ' + tag + '</h3></div>');
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
                        imgDiv += '<a href=' + item.link + ' target="_blank"><img data-tag="' + tag + ' "src="' + item.media.m + '" /></a>';
                    });

                    $('.gallery[data-tag=' + tag + ']').append(imgDiv);
                    $('.loader').hide();
                    s.container.show();

                });

        },
        removeGallery: function(tag) {
            $('.gallery[data-tag=' + tag + ']').add('.list li[data-tag=' + tag + ']').remove()
        }
    };


$(function(){
    FlickrGallery.init();
});


