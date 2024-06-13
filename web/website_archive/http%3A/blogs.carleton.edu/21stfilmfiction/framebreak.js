(function($) {
    $(document).ready(function() {
        $(".msreader-posts").on("click", ".msreader-post-actions button.featured-posts-control", function(event) {
            event.preventDefault();

            var button = $(this);
            var blog_id = button.parents(".msreader-post").attr("data-blog_id");
            var post_id = button.parents(".msreader-post").attr("data-post_id");

            featured_posts_control(blog_id, post_id, button, 0)
        });
        $(".msreader-post-overlay").on("click", ".msreader-post-header-navigation .links .featured-posts-control", function(event) {
            event.preventDefault();

            var button = $(this);
            var blog_id = msreader_main_query.current_post.attr("data-blog_id");
            var post_id = msreader_main_query.current_post.attr("data-post_id");

            featured_posts_control(blog_id, post_id, button, 0);
        });

        $("body").on("click", ".featured-posts-control", function(event) {
            event.preventDefault();

            var button = $(this);
            var blog_id = button.attr("data-blog_id");
            var post_id = button.attr("data-post_id");  

            featured_posts_control(blog_id, post_id, button, 1)      
        });
    });

    function featured_posts_control(blog_id, post_id, button, frontend) {
        if(blog_id && post_id) {
            if(!frontend)
                $(".msreader-post-header-navigation .spinner, .msreader-post[data-blog_id='"+blog_id+"'][data-post_id='"+post_id+"'] .spinner").show();
            else
                button.text(msreader_featured_posts.saving)

            feature_details = {
                blog_id: blog_id,
                post_id: post_id
            }
            args = {
                source: "msreader",
                module: "featured_posts",
                action: "dashboard_feature_post",
                args: feature_details
            };

            $.post(ajaxurl, args, function(response) {
                if(!frontend)
                    $(".msreader-post-header-navigation .spinner, .msreader-post[data-blog_id='"+blog_id+"'][data-post_id='"+post_id+"'] .spinner").fadeOut(200, function() {$(this).hide()});

                if(response && response != 0) {
                    if(!frontend)
                        $(".msreader-post-header-navigation .featured-posts-control, .msreader-post[data-blog_id='"+blog_id+"'][data-post_id='"+post_id+"'] .msreader-post-actions .featured-posts-control").text(msreader_featured_posts[response]);
                    else
                        button.text(msreader_featured_posts[response]);

                    if(!frontend) {
                        if(response == 'unfeature') {
                            var featured_post_indicator = $(".msreader-post[data-blog_id='"+blog_id+"'][data-post_id='"+post_id+"'] .msreader-post-indicator.featured-post");
                            if(featured_post_indicator.length)
                                featured_post_indicator.show();
                            else
                                $(".msreader-post[data-blog_id='"+blog_id+"'][data-post_id='"+post_id+"'] h2").prepend('<div class="msreader-post-indicator dashicons dashicons-star-filled featured-post" title="'+msreader_featured_posts.post_featured+'"></div>');
                            if($('.msreader_module_featured_posts').length)
                                msreader.add_post_to_list(blog_id, post_id);
                        }
                        else {
                            if(response == 'feature') {
                                $(".msreader-post[data-blog_id='"+blog_id+"'][data-post_id='"+post_id+"'] .msreader-post-indicator.featured-post").hide();
                            }
                            if($('.msreader_module_featured_posts').length)
                                msreader.remove_post_from_list(blog_id, post_id);
                        }
                    }
                }
            });
        }
    }
})(jQuery);