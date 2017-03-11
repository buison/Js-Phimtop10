(function ($) {
    var bodyTag = $('body'), mySlidebars;
    $.fn.bootstrapButton = $.fn.button;
    $.fn.bootstrapTooltip = $.fn.tooltip;
    BootstrapDialog.defaultOptions.nl2br = false;
    BootstrapDialog.defaultOptions.type = BootstrapDialog.TYPE_DEFAULT;
    var _setIntervalProgress;
    var blockUiConfig = {
        message: 'Loading...',
        css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .5,
            color: '#fff'
        }
    };
    window.add_query_var = function (uri, key, value) {
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        }
        else {
            return uri + separator + key + "=" + value;
        }
    };
    window.show_loading_page = function (id) {
        if (loadedShowLoadingPage) {
            return;
        }
        var progressBar = $('#progress-content-ajax', bodyTag);
        progressBar.removeClass('done').css({
            width: '100%'
        });
        var _timeProgress = 0;
        if (!_setIntervalProgress) {
            _setIntervalProgress = setInterval(function () {
                _timeProgress += 10;
                if (_timeProgress >= 100) {
                    clearInterval(_setIntervalProgress);
                    _setIntervalProgress = 0;
                    progressBar.addClass('done').css({
                        width: '0%'
                    });
                }
            }, 50);
        }
        loadedShowLoadingPage = true;

        $('.ajax-overlay').removeClass('hidden');
        $('.ajax-loading-box').removeClass('hidden');
        $('[type="submit"]').each(function () {
            if (!$(this).attr('data-loading-text')) {
                $(this).attr('data-loading-text', 'Loading...');
            }
        });
        $('input[type="submit"][data-loading-text], button[type="submit"][data-loading-text]').each(function () {
            $(this).button('loading');
        });
        setTimeout(function () {
            hide_loading_page();
        }, 7000);
    };
    window.hide_loading_page = function (id, data) {
        if (!loadedShowLoadingPage) {
            return false;
        }

        loadedShowLoadingPage = false;
        $('.ajax-overlay').addClass('hidden');
        $('.ajax-loading-box').addClass('hidden');
        $('input[type="submit"][data-loading-text], button[type="submit"][data-loading-text]').each(function () {
            $(this).button('reset');
        });
    };
    window.showAlert = function (_message, callback, title, options) {
        $.each(BootstrapDialog.dialogs, function (id, dialog) {
            dialog.close();
        });
        if (typeof title == 'undefined') {
            title = 'Information';
        }
        if (typeof options == 'undefined') {
            options = {};
        }

        options = $.extend(true, {
            title: title,
            message: _message,
            type: BootstrapDialog.TYPE_DEFAULT,
            callback: callback,
            buttonLabel: 'Close!'
        }, options);
        BootstrapDialog.alert(options);
    };
    var loadedShowLoadingPage = false,
        bodyTag = $('body'),
        scrollTrigger = 100,
        loadLazyLoad = function () {
            $('.lazyload-image', bodyTag).lazyLoadXT();
        },

        afterAjaxLoad = function () {
            bodyTag = $('body');
            $('[data-toggle="tooltip"]', bodyTag).tooltip();
            $('[data-toggle="dropdown"]', bodyTag).dropdown();
            $('input[data-type]', bodyTag).each(function () {
                $(this).attr('type', $(this).data('type'));
            });
            $('select.select2', bodyTag).each(function () {
                if (!$(this).data('select2')) {
                    var ob_config = $(this).data();
                    ob_config.with = '100%';
                    $(this).select2(ob_config);
                }

            });
            loadBackToTop();
            loadLazyLoad();
            if (typeof FB != 'undefined' && typeof FB.XFBML != 'undefined') {
                FB.XFBML.parse();
            }
            if ($("#slider-container", bodyTag).length > 0) {
                $("#slider-container", bodyTag).wowSlider({
                    effect: "louvers",
                    duration: 20 * 100,
                    delay: 20 * 100,
                    width: 960,
                    height: 360,
                    autoPlay: true,
                    autoPlayVideo: false,
                    playPause: true,
                    stopOnHover: false,
                    loop: false,
                    bullets: 1,
                    caption: true,
                    captionEffect: "parallax",
                    controls: true,
                    controlsThumb: false,
                    responsive: 2,
                    fullScreen: false,
                    gestures: 2,
                    onBeforeStep: 0,
                    images: 0
                });
            }

            $('.has-slide .block-items').each(function () {
                $(this).owlCarousel({
                    loop: true,
                    margin: 10,
                    dots: false,
                    items: 4,
                    nav: true,
                    responsive: {
                        0: {items: 4},
                        299: {items: 2},
                        319: {items: 2},
                        479: {items: 3},
                        767: {items: 3},
                        992: {items: 3},
                        993: {items: 4}
                    }
                });
            });

            if ($('.list-servers .list-episodes .episodes', bodyTag).length) {
                $('.list-servers .list-episodes .episodes', bodyTag).css({
                    overflow: 'hidden'
                }).mCustomScrollbar({
                    scrollButtons: {enable: true},
                    theme: "light-thin"
                }).mCustomScrollbar('scrollTo', '.list-servers .list-episodes a.btn-brown');
            }

            if ($('.list-actor .items', bodyTag).length) {
                $('.list-actor .items', bodyTag).css({
                    overflow: 'hidden'
                }).mCustomScrollbar({
                    scrollButtons: {enable: true},
                    theme: "light-thin"
                });
            }

            $('.rating-bar input', bodyTag).each(function () {
                var current_val_rating = $(this).val();
                var current_film_id = $(this).data('id');
                var current_this_rate = $(this);
                $(this).val((current_val_rating / 5).toFixed(1) * 5);
                $(this).rating({
                    showClear: false,
                    showCaptions: true,
                    hoverOnClear: false,
                    size: 'xs',
                    theme: 'krajee-fa',
                    min: 1,
                    max: 5,
                    step: 0.5,
                    filledStar: '<i class="fa fa-star"></i>',
                    emptyStar: '<i class="fa fa-star-o"></i>'
                }).on("rating.change", function (event, value, caption) {
                    var data_post = {id: current_film_id, value: parseInt(value)};
                    $.ajax({
                        type: 'POST',
                        url: MAIN_URL + '/ajax',
                        data: data_post,
                        dataType: 'json',
                        success: function (response) {
                            showAlert(response.message);
                            if (response.status == 'success') {
                                current_this_rate.rating('update', (response.data.rating_avg / 5).toFixed(1) * 5);
                            }
                        }
                    });
                });
            });


            $('.with-tabs .box-asian-tabs, .box-asian-tabs.tab-remote', bodyTag).each(function () {
                var _block_element, _block_content_element, $isBlock = true;
                if ($(this).hasClass('tab-remote')) {
                    $isBlock = false;
                }
                if ($isBlock) {
                    _block_element = $(this).parents('.block');
                    _block_content_element = $('>.block-content', _block_element);
                } else {
                    _block_element = $(this);
                    _block_content_element = $('>.tab-content', _block_element);
                }
                var nav_tabs = $(".nav-tabs", $(this));
                $('a', nav_tabs).on('click', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $('li', nav_tabs).removeClass('active');
                    $(this).parent('li').addClass('active');
                    var _blockID = $(this).data('block');
                    var _currentElm = $('> .' + _blockID, _block_content_element);
                    if (!_currentElm.length) {
                        $('<div class="' + _blockID + ' hidden"></div>').appendTo(_block_content_element);
                        _currentElm = $('> .' + _blockID, _block_content_element);
                    }
                    if (_currentElm.length > 0) {
                        if ($.trim(_currentElm.html())) {
                            $('> div', _block_content_element).addClass('hidden');
                            _currentElm.removeClass('hidden');
                        } else {
                            _block_content_element.block(blockUiConfig);
                            $.ajax({
                                type: 'POST',
                                url: MAIN_URL+'/load/item',
                                data: {
                                    widget: 'list-film',
                                    type: _blockID
                                },
                                success: function (html) {
                                    $('> div', _block_content_element).addClass('hidden');
                                    _currentElm.html(html).removeClass('hidden');
                                    _block_content_element.unblock();
                                },
                                error: function () {
                                    _block_content_element.unblock();
                                }
                            });
                        }
                    }
                    return false;
                });
            });
            var templatePartDefaultSearch = '<a class="clearfix" href="__LINK__"><div class="thumbnail"><img src="__IMAGE__" /></div><div class="meta-item"><div class="name-1">__NAME__</div><h4 class="name-2">__NAME_ORIGINAL__</h4></div></a>';
            $('.input-search', bodyTag).each(function () {
                var form_search = $(this).parents('.form-search');
                var search_options = {
                    width: form_search.width(),
                    maxHeight: 500,
                    deferRequestBy: 1000,
                    type: 'POST',
                    serviceUrl: MAIN_URL + '/load/search',
                    dataType: 'json',
                    formatResult: function (suggestion, currentValue) {
                        return suggestion.html;
                    },
                    onSearchStart: function () {
                        $(".btn-search", form_search).html($("<i></i>").addClass("fa fa-spin fa-spinner"));
                    },
                    onSearchComplete: function () {
                        $(".btn-search", form_search).html('<i class="fa fa-search"></i>');
                    },
                    onSelect: function (suggestion) {
                        window.location.href = suggestion.data;
                    },
                    transformResult: function (response) {
                        return {
                            suggestions: $.map(response.suggestions, function (data) {
                                var templatePart = templatePartDefaultSearch;
                                templatePart = templatePart.split("__LINK__").join(data.link);
                                templatePart = templatePart.split("__NAME_ORIGINAL__").join(data.english + data.year);
                                templatePart = templatePart.split("__NAME__").join(data.vietnam);
                                templatePart = templatePart.split("__IMAGE__").join(data.image);
                                return {value: data.vietnam, html: templatePart, data: data.link};
                            })
                        }
                    },
                    ajaxSettings: {
                        global: false
                    }
                };
                $(this).autocomplete(search_options);
            });


        },
        backToTop = function () {
            if ($('#back-to-top').length > 0) {
                var scrollTop = $(window).scrollTop();
                if (scrollTop > scrollTrigger) {
                    $('#back-to-top').addClass('show');
                } else {
                    $('#back-to-top').removeClass('show');
                }
            }
        },
        loadBackToTop = function () {
            setTimeout(function () {
                if ($('#back-to-top').length < 1) {
                    bodyTag.append('<span id="back-to-top">&uarr;</span>');
                    backToTop();
                }
            }, 1000);
        },
		PhimLeTVPlayer = function (playerid,playlist,filmId,currentid,nextid,playTech,link) {
		if(playTech == "flash"){
		    plplayer.key = "dWwDdbLI0ul1clbtlw+4/UHPxlYmLoE9Ii9QEw==";
		    var Player = plplayer(playerid);
                Player.setup({
                    height: "100%",autostart: true,playlist: playlist,stretching: "uniform",allowfullscreen: true,primary: "html5",width: "100%"
                });
				Player.on("adBlock", function() {
                    showAlert("B\u1ea1n c\u00f3 th\u1ec3 vui l\u00f2ng t\u1eaft AdBlock \u0111\u1ec3 \u1ee7ng h\u1ed9 website nh\u00e9!");
                });
				Player.on("complete", function() {
                    if (window.jQuery && nextid != false) {
                        console.log("Player autonexting...");
						$('.list-episodes a').removeClass('btn-brown').addClass('btn-dark');
                        $("a[data-id='"+nextid+"']").removeClass('btn-dark').addClass('btn-brown');
						ajaxLoadEpisode($('.list-episodes .episodes .btn-brown'), bodyTag);
                    }
                });
				Player.on("error", function(response) {
                    var value = response.message;
                    if (value.indexOf("RSS/JSON") > -1 || (value.indexOf("Error") > -1 || value.indexOf("Error loading") > -1)) {
                        /** @type {Array} */
						if(source == "gdrive"){
						    jQuery.post(MAIN_URL + '/load_player', {
                                CheckReasonDrive: 1,EpisodeID: currentid
                            }, function(datas) {
							    jQuery("#"+playerid).empty().html('<span style="vertical-align: middle;text-align: center;display: table-cell;font-style: normal;font-variant: normal;font-weight: normal;font-stretch: normal;font-size: 23px;line-height: 20px;">'+datas+'</span>');
							});
						} else {
                            jQuery("#"+playerid).empty().html('<span style="vertical-align: middle;text-align: center;display: table-cell;font-style: normal;font-variant: normal;font-weight: normal;font-stretch: normal;font-size: 23px;line-height: 20px;">Something wrong! Contact me: fb.com/pdnghia</span>');
						}
                    }
                });
		} else if(playTech == "iframe"){
		    $("#"+playerid).empty().html('<iframe src="'+link+'" width="100%" height="100%" style="border:none;" allowfullscreen></iframe>');
		}		
		},
        ajaxLoadEpisode = function (ob) {
            var player_element = $('.player-wrapper .embed-responsive-item', bodyTag);
            player_element.html('').block(blockUiConfig);
            $('.list-episodes a').removeClass('btn-brown').addClass('btn-dark');
            ob.removeClass('btn-dark').addClass('btn-brown');
            var current_id = ob.data('id');
            if (current_id) {
                var current_href = ob.attr('href');
                var current_title = ob.attr('title');
                var current_image = $('.list-episodes', bodyTag).data('image');
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: MAIN_URL + '/load_player',
                    data: {
                        episodeid: current_id,
                        filmid: filmInfo.filmID
                    },
                    success: function (response) {
                        if (response.status == 'success') {
                            var player_element = $('.player-wrapper .embed-responsive-item', bodyTag);
                            document.title = current_title;
                            window.history.pushState({path: current_href}, current_title, current_href);

                            player_element.html('<div id="player-content" style="width: 100%; height: 100%"></div>');
							
							var $tokenId = PHIMLE.enc(current_id, document['domain']+"console" + current_id);
				            var playlist = MAIN_URL+"/playlist/"+filmInfo.filmID+"/episode/"+current_id+"-"+$tokenId+".xml";
							
                            PhimLeTVPlayer("player-content",playlist,filmInfo.filmID,current_id,response.nextid,response.playTech,response.link);
							
                        } else {
                            showAlert(response.message);
                        }
                    }
                });
            }

        },
		fixKeyword = function(str) {
		    str = str.toLowerCase();
		    str = str.replace(/(<([^>]+)>)/gi, "");
		    str = str.replace(/[`~!@#$%^&*()_|\=?;:'",.<>\{\}\[\]\\\/]/gi, "");
		    str = str.split(" ").join("+");
		    return str;
	    },
		LightToggle = function() {
            if ($(".sixteen-nine").hasClass("fixLightOff")) {
                $(".sixteen-nine").removeClass("fixLightOff");
				$('.power-lamp').removeClass('off');
				$('.text-lamp').html($("#lightBtn").data("off"));
				$("#lightOff").hide();
				bodyTag.css({"overflow":"auto"});
            } else {
                $(".sixteen-nine").addClass("fixLightOff");
                $("#lightOff").show();
			    $('.power-lamp').addClass('off');
			    $('.text-lamp').html($("#lightBtn").data("on"));
				bodyTag.css({"overflow":"hidden"});
            }
        },
        updateCssMedia = function () {
            if (window.matchMedia('(max-width: 860px)').matches) {
                if ($('.movie-info-detail').length < 1) {
                    var movie_info = $('.movie-info .page-col-right.pull-left', bodyTag).clone();
                    movie_info.removeAttr('class');
                    movie_info.addClass('movie-info-detail');
                    movie_info.appendTo($('.movie-info-top', bodyTag));
                }
            }
            if (window.matchMedia('(max-width: 991px)').matches) {
                bodyTag.addClass('max-width-992');
            } else {
                bodyTag.removeClass('max-width-992');
            }
        };

    $(window).on('scroll', function () {
        backToTop();
    });
    $(window).resize(function () {
        updateCssMedia();
    });
    $(document).ready(function () {
        //loadUserInfo(afterAjaxLoad);
        mySlidebars = new $.slidebars();
        updateCssMedia();
        afterAjaxLoad();

        $("#nav-menu-mobile > li > a").on("click", function (e) {
            if ($(this).parent().has("ul")) {
                e.preventDefault();
            }

            if (!$(this).hasClass("open")) {
                // hide any open menus and remove all other classes
                $("#nav-menu-mobile li ul").slideUp(350);
                $("#nav-menu-mobile li a").removeClass("open");

                // open our new menu and add the open class
                $(this).next("ul").slideDown(350);
                $(this).addClass("open");
            }

            else if ($(this).hasClass("open")) {
                $(this).removeClass("open");
                $(this).next("ul").slideUp(350);
            }
        });
		jQuery('#form-search').submit(function() {
		var keywordObj = jQuery(this).find('input[name=search_term_string]')[0];
		if (typeof keywordObj != 'undefined' && keywordObj != null) {
			var keyword = jQuery(keywordObj).val();
			keyword = fixKeyword(keyword);
			keyword = jQuery.trim(keyword);
			if (keyword == '') {
				alert('Bạn chưa nhập từ khóa. (Không tính các ký tự đặc biệt vào độ dài từ khóa)');
				jQuery(keywordObj).focus();
				return false;
			}
			window.location.replace('/search/' + keyword + '/');
		}
		return false;
	    });
        if($("body").attr("data") == "FilmPlay") 
		    ajaxLoadEpisode($('.list-episodes .episodes .btn-brown'), bodyTag);
			
        bodyTag.on('click', '.open-search', function (e) {
            e.stopPropagation();
            e.preventDefault();
            if ($(this).data('openSearch')) {
                $(this).data('openSearch', false);
                $('#mobile-header .form-search', bodyTag).hide();
                $(this).html('<i class="fa fa-search"></i>');
            } else {
                $(this).data('openSearch', true);
                $('#mobile-header .form-search', bodyTag).show().find('input').focus();
                $(this).html('<i class="fa fa-remove"></i>');
            }
            return false;
        }).on('click', '.movie-banner .icon-play.is-license', function (e) {
            e.preventDefault();
            showAlert('<p>Sorry! This content has been removed</p>');
            return false;
        }).on('click', '.movie-banner .icon-play.no-episode', function (e) {
            e.preventDefault();
            showAlert('<p>Sorry! This content has been removed</p>');
            return false;
        }).on('click', '.row-trailer a', function (e) {
            e.preventDefault();
            if ($('.trailer #youtube-frame').length > 0) {
                $('.trailer #youtube-frame').remove();
            }
            var html_embed_youtube = '<div id="youtube-frame"><span class="close"><i class="fa fa-remove"></i></span><iframe width="100%" height="100%" src="https://www.youtube.com/embed/' + $(this).data('id') + '?rel=0&autoplay=1&modestbranding=1&autohide=1&showinfo=0&controls=0" scrolling="no" frameborder="0" allowfullscreen></iframe></div>';
            $('.trailer', bodyTag).append(html_embed_youtube);
            return false;
        }).on('click', '.row-trailer .trailer .close', function () {
            if ($('.trailer #youtube-frame').length > 0) {
                $('.trailer #youtube-frame').remove();
            }
        }).on('click', '#back-to-top', function (e) {
            e.preventDefault();
            $('html,body').animate({
                scrollTop: 0
            }, 700);
            return false;
        }).on('click', '.episodes a.btn-dark', function (e) {
            e.preventDefault();
            //AsianPlayer('destroy');
            ajaxLoadEpisode($(this));
            return false;
        }).on('click', '.change-server a[data-server-id]', function (e) {
            e.preventDefault();
            var current_list_server = $(this).parent('li');
            if (current_list_server.hasClass('active')) {
                return false;
            }
            var current_film_id = $(this).data('filmId');
            var current_episode_id = $.trim($('.list-episodes a.btn-brown').data("id"));
            var current_server_id = $(this).data('serverId');
            var current_server_name = $.trim($(this).text());
            var parent_list_server = $(this).parents('ul');
            $('.list-episodes', bodyTag).block(blockUiConfig);
            $.ajax({
                type: 'POST',
                url: MAIN_URL + '/load_player',
                data: {
                    server_id: current_server_id,
                    film_id: current_film_id,
                    episode_id: current_episode_id
                },
                success: function (html) {
                    if (html) {
                        $('li', parent_list_server).removeClass('active');
                        current_list_server.addClass('active');
                        $('.list-servers .server-name', bodyTag).html('<i class="sp-movie-icon-camera""></i> ' + current_server_name);
                        $('.list-episodes', bodyTag).html(html);
                        $('.list-episodes', bodyTag).mCustomScrollbar("destroy");
                        $('.list-episodes .episodes', bodyTag).mCustomScrollbar({
                            scrollButtons: {enable: true},
                            theme: "light-thin"
                        }).mCustomScrollbar('scrollTo', '.list-servers .list-episodes a.btn-brown');
                       // ajaxLoadEpisode($('.list-episodes .episodes .btn-brown', bodyTag));
                    } else {
                        showAlert('This server was not found in our system!');
                    }
                    $('.list-episodes', bodyTag).unblock();
                },
                error: function () {
                    $('.list-episodes', bodyTag).unblock();
                }
            });
            return false;
        }).on("click", "#lightBtn, #lightOff", function(e) {
		    e.preventDefault();
            LightToggle();
        }).on("click", "#errorBtn", function(e) {
		    e.preventDefault();
            var level = parseInt($(".list-episodes a.btn.btn-rounded.btn-brown").data("id"));
            jQuery.post(AjaxURL, {
                error: 1,
                film_id: filmInfo.filmID,
                episode_id: level
            }, function(dataAndEvents) {
                if (dataAndEvents == 1) {
                showAlert("Th\u00f4ng b\u00e1o c\u1ee7a b\u1ea1n \u0111\u00e3 \u0111\u01b0\u1ee3c g\u1eedi \u0111i, BQT s\u1ebd kh\u1eafc ph\u1ee5c trong th\u1eddi gian s\u1edbm nh\u1ea5t. Thank!");
                }
            });
            jQuery(this).remove();
        });
    });
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8&appId=341320802599196";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
})(jQuery);