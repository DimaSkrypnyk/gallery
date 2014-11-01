$(document).ready(function(){
    var container = $(".container");
    var editBlock = $(".edit-block");
    var gallery = $(".gallery");
    var btn = editBlock.find('button');
    var input = editBlock.find('input');
    var tag, galleryDiv, imgDiv, currentGallery;

    input.keyup(function(){
        $(".error").hide()
    });

    editBlock.find('a').click(function(){
        gallery.remove();
    });


    function addGallery(tag){
        if(!tag){
            $(".error").show();
            return false
        }

        if(tag.indexOf(' ') >= 0)
            tag = tag.replace(/\s/g, '');

        $('.windows8').show();
        container.hide();

        imgDiv = '';
        galleryDiv = '<div class="gallery" data-tag="' + tag + '"><h3>tag: ' + tag + '</h3></div>';
        $(container).append(galleryDiv);
        $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?", {
                tags: tag,
                format: "json"
            },

        function (data) {
            console.log(data);
            if(data.items.length == 0){
                $('.gallery[data-tag=' + tag + ']').append('<h3>There are no such images with this tag</h3>');

            }
            $.each(data.items, function (i, item) {
                if (i == 4) return false;
                imgDiv += '<a href=' + item.link + ' target="_blank"><img data-tag="' + tag + ' "src="' + item.media.m + '" /></a>';
            });

            $('.gallery[data-tag=' + tag + ']').append(imgDiv);
            $('.windows8').hide();
            container.show();

        });
    }

    btn.on('click', function(){
        addGallery(input.val())
    });
});
