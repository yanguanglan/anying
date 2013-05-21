function xunleiLixianPlayerV5(l, m) {
    function f() {
        $.each(arguments, 
        function(b, c) {
            try {
                c()
            } catch(e) {
                a.config.debug && console.log(e)
            }
        })
    }
    var a = this,
    h = function() {};
    a.data = $.extend({
        url: "",
        name: "",
        hash: "",
        index: 0,
        gcid: "",
        cid: "",
        filesize: 0,
        url_hash: "",
        duration: 0
    },
    l || {});
    a.config = $.extend({
        debug: !1,
        play: !1,
        autoPlay: !0,
        mobile: !1,
        user: 2,
        session: "",
        vip: 6,
        from: "xlpan_web",
        api: "//i.vod.xunlei.com/req_try_vod",
        swf: "//vod.lixian.xunlei.com/media/vodPlayer_2.8.swf?_=" + $.now(),
        player: "x2yun_" + $.now(),
        container: "player",
        complete: h,
        callback: h,
        encode: {},
        messager: function(a, c) {
            "error" == a && alert(c)
        }
    },
    m || {});
    a.getPlayer = function() {
        return a.config.mobile ? $("#" + a.config.player)[0] : ( - 1 != window.navigator.appName.indexOf("Microsoft") ? window: document)[a.config.player]
    };
    a.outputPlayer = function() {
        a.getPlayer() || (a.config.messager("info", "输出播放器..."), a.config.mobile ? $('<video id="' + a.config.player + '" controls="controls"></video>').css({
            width: "100%",
            height: "100%"
        }).appendTo($("#" + a.config.container)) : ($("#" + a.config.container).html('<div id="' + 
        a.config.player + '"/>'), swfobject.embedSWF(a.config.swf, a.config.player, "100%", "100%", "10.0.0", "//vod.lixian.xunlei.com/library/expressInstall.swf", {
            movieType: "movie",
            windowMode: "browser"
        },
        {
            allowFullScreen: !0,
            allowScriptAccess: "always",
            bgcolor: "#000000",
            wmode: "opaque",
            quality: "high",
            menu: !1
        },
        {
            id: a.config.player,
            name: a.config.player
        })));
        return a.initPlayer()
    };
    a.ready = function() {
        return a.config.mobile ? !!$("#" + a.id).length: a.getPlayer() && a.getPlayer().flv_setPlayeUrl
    };
    a.player = null;
    a.initPlayer = function() {
        if (!a.player) return a.ready() ? 
        (a.config.messager("info", "初始化播放器..."), a.player = a.getPlayer(), f(function() {
            a.player.flv_setBarAvailable(!0)
        },
        function() {
            a.player.flv_setToolBarEnable({
                enableShare: !0,
                enableFileList: !1,
                enableDownload: !1,
                enableSet: !0,
                enableCaption: !0,
                enableOpenWindow: !1,
                enableTopBar: !1,
                enableFeedback: !1
            })
        })) : window.setTimeout(a.initPlayer, 100),
        a
    };
    a.video = null;
    a.user = null;
    a.getData = function() {
        function b(d) {
            if (d && d.resp) {
                a.video = d.resp;
                a.user = $.extend({
                    user: a.config.user,
                    vip: a.config.vip,
                    session: a.config.session
                },
                d.user || 
                {});
                if (d.error) d = d.error;
                else {
                    d = d.resp;
                    var b = "";
                    switch (d.ret) {
                    case 2:
                        b = d.error_msg || "无效链接。";
                        break;
                    case 6:
                        b = "该视频下载链接有误，无法播放。";
                        break;
                    case 8:
                        b = "该下载链接不含视频，无法播放。";
                        break;
                    case 11:
                        b = "点播权限存在问题。";
                        break;
                    case 14:
                    case 15:
                        b = "未知错误[" + d.ret + "]。";
                        break;
                    default:
                        "undefined" !== typeof d.status && (2 == d.status && d.trans_wait) && (b = 0 < d.trans_wait && 60 > d.trans_wait ? "转码未完成，预计还需 " + d.trans_wait + " 秒。": -1 == d.trans_wait ? "转码未完成，该资源转码需要较长时间。": -2 == d.trans_wait ? "转码失败。": "转码未完成，预计还需 " + parseInt(d.trans_wait / 60) + " 分钟。"),
                        "undefined" != typeof d.status && 
                        1 == d.status && (b = "该资源云端下载与转码需要较长时间。")
                    } ! b && !d.duration && (b = "迅雷服务器转码错误。");
                    d = b
                }
                d ? (a.video = {},
                a.showError(d)) : (a.data.name = decodeURIComponent(a.video.src_info.file_name || "").replace(/^[#]+$/g, "") || a.data.name, a.data.gcid = a.video.src_info.gcid || a.data.gcid, a.data.cid = a.video.src_info.cid || a.data.cid, a.data.filesize = a.video.src_info.file_size || a.data.filesize, a.data.duration = a.video.duration || a.data.duration, a.data.url_hash = a.video.url_hash, a.config.callback(a.data))
            } else a.video = {},
            a.config.messager("error", 
            "连接迅雷服务器失败。")
        }
        if (!a.ready()) return window.setTimeout(a.getData, 100),
        a;
        a.video = null;
        var c = {
            url: a.data.url,
            video_name: a.data.name,
            platform: +a.config.mobile,
            userid: a.config.user,
            vip: a.config.vip,
            sessionid: a.config.session,
            gcid: a.data.gcid,
            cid: a.data.cid,
            filesize: a.data.filesize,
            url_hash: a.data.url_hash,
            from: a.config.from
        };
        $.each(c, 
        function(a, b) {
            "" === b && delete c[a]
        });
        a.config.encode && (a.config.encode.name && a.config.encode.method) && ($.each(c, 
        function(b, e) {
            c[b] = a.config.encode.method(e)
        }), c.encode = a.config.encode.name);
        var e = a.config.api,
        e = e + ( - 1 < e.indexOf("?") ? "&": "?"),
        g = /adobeair/.test(window.navigator.userAgent.toLowerCase()) && !!window.nativeWindow,
        f = g ? "jQuery" + (jQuery.fn.jquery + Math.random()).replace(/\D/g, "") + "_" + jQuery.now() : "?",
        e = e + ("callback=" + f) + ("&" + $.param(c));
        window.XL_CLOUD_FX_INSTANCEqueryBack = b;
        f = /\/\/([a-z0-9\-\.]+)\//.exec(a.config.api) ? RegExp.$1: window.location.host;
        a.config.messager("info", "连接数据服务器[" + f + "]...");
        g ? $.ajax({
            url: e,
            dataType: "json",
            dataFilter: function(a) {
                return a.slice(a.indexOf("(") + 1, 
                a.lastIndexOf(")"))
            },
            success: b
        }) : $.getJSON(e, function(data){console.info(data)});
        return a
    };
    a.showError = function(b) {
        a.config.messager("error", b);
        f(function() {
            a.player.flv_setNoticeMsg(b, !0)
        });
        return a
    };
    a.open = function(b, c, e) {
        b = b || a.format || "p";
        e = e || {};
        c = a.video.vodinfo_list["pgcy".indexOf(b)];
        if (!c || !c.spec_id || !c.vod_url) return a.showError("播放失败。");
        a.config.messager("success", "开始播放 " + a.data.name);
        if (a.mobile) return a.player.attr("src", c.vod_url)[0].play(),
        a;
        var g = parseInt(/&s=(\d+)&/.exec(c.vod_url + "&")[1], 10);
        if (!g) return a.showError("视频播放链接错误。");
        var k = a.seekPoint || 0,
        d = parseInt(a.video.duration / 1E6, 10);
        k >= d && (k = 0);
        var h = [{
            url: c.vod_url,
            start: k,
            autoplay: +a.config.autoPlay,
            quality: c.spec_id,
            qualitystr: "000",
            qualitytype: 0,
            subStart: 0,
            subEnd: 0,
            title: a.data.name,
            vcut: 0,
            submovieid: 0,
            skipMovieHeadTime: 0,
            skipMovieEndTime: 0,
            streamtype: 1,
            posterUrl: "",
            totalByte: g,
            totleByte: g,
            totalTime: d,
            totleTime: d,
            sliceTime: d,
            sliceType: 0,
            format: b,
            packageUrl: ""
        }];
        a.stop();
        e.firstPlay ? f(function() {
            a.player.flv_closeNotice()
        },
        function() {
            a.player.cancelSubTitle()
        },
        function() {
            a.player.flv_setShareLink(document.title, 
            window.location.href)
        },
        function() {
            a.player.flv_setCaptionParam({
                description: "请选择字幕文件(*.srt,*.ass)",
                extension: "*.srt;*.ass",
                limitSize: 5242880,
                uploadURL: "http://dynamic.vod.lixian.xunlei.com/interface/upload_file/?cid=" + a.video.src_info.cid,
                timeOut: 30
            })
        },
        function() {
            a.player.flv_setFeeParam({
                sessionid: a.user.session,
                userid: a.user.user,
                isvip: a.user.vip,
                gcid: a.data.gcid,
                cid: a.data.cid,
                name: a.data.name,
                url_hash: a.video.url_hash,
                from: a.config.from,
                url: decodeURIComponent(a.data.url),
                index: a.data.index,
                ygcid: a.data.gcid,
                ycid: a.data.cid,
                filesize: a.data.filesize,
                info_hash: a.data.hash
            })
        },
        function() {
            a.player.flv_setPlayeUrl(h)
        }) : (a.config.messager("success", "切换视频清晰度..."), f(function() {
            a.player.flv_setIsChangeQuality(!0)
        },
        function() {
            a.player.flv_setPlayeUrl(h)
        }));
        a.showFormats(b);
        return a
    };
    a.stop = function() {
        f(function() {
            a.player.flv_closeNetConnection()
        },
        function() {
            a.player.flv_stop()
        },
        function() {
            a.player.flv_close()
        },
        function() {
            a.player.stop()
        })
    };
    a.showFormats = function(b) {
        b = b || "p";
        var c = [[0, 0], [0, 0], [0, 0], [0, 0]];
        $.each(a.video.vodinfo_list, 
        function(a, b) {
            c[a][1] = 1
        });
        c["pgcy".indexOf(b)][0] = 1;
        f(function() {
            a.player.flv_showFormats(function(a) {
                var b = {};
                $.each(["p", "g", "c", "y"], 
                function(c, d) {
                    b[d] = {
                        checked: !!a[c][0],
                        enable: !!a[c][1]
                    }
                });
                return b
            } (c))
        })
    };
    a.errorCounter = {};
    a.seekPoint = 0;
    a.format = "p";
    a.init = function() {
        a.outputPlayer();
        a.config.play && a.getData().play();
        if (a.mobile) return a;
        window.console || (window.console = {
            log: function() {}
        });
        $.extend(window, {
            G_PLAYER_INSTANCE: {
                getParamInfo: function(b) {
                    switch (b) {
                    case "sessionid":
                        return a.user.session;
                        case "oriCookie":
                        return b = [],
                        b.push("userid=" + a.user.user + ";"),
                        b.push("isvip=" + a.user.vip + ";"),
                        b.push("sessionid=" + a.user.session + ";"),
                        b.join(" ");
                    case "referer":
                        return "http://f.xunlei.com/"
                    }
                },
                trace: function(b) {
                    a.config.debug && console.log(b)
                },
                windowOpen: function(a) {
                    window.open(a)
                },
                getFormats: a.showFormats,
                setFormatsCallback: a.open
            },
            flv_playerEvent: function(b, c) {
                a.config.debug && "onProgress" != b && console.log(arguments);
                "autoChangeQulity" == b && f(function() {
                    a.player.flv_setNoticeMsg("智能切换清晰度已完成.")
                });
                "onRePlay" == 
                b && a.getData().play();
                "onSeek" == b && (c >= a.video.duration / 1E6 ? (f(function() {
                    a.format = a.player.flv_getDefaultFormat() || "p"
                }), a.getData().play()) : a.seekTime = c);
                "onplaying" == b && (a.seekTime = 0);
                if ("onErrorInfo" == b) {
                    var e = 0;
                    f(function() {
                        e = a.player.getPlayProgress(!0)
                    },
                    function() {
                        a.format = a.player.flv_getDefaultFormat() || "p"
                    });
                    0 < e && (a.seekPoint = a.seekTime ? a.seekTime: e);
                    a.config.debug && console.log("onErrorInfo : value:" + c + " , 断点:" + a.seekPoint);
                    var g = parseInt($.now() / 60 / 1E3, 10);
                    a.errorCounter[g] = a.errorCounter[g] || 
                    0;
                    a.errorCounter[g]++;
                    3 < a.errorCounter[g] ? (a.stop(), f(function() {
                        a.player.flv_showErrorInfo()
                    }), a.showError("视频连接中断，已重试3次但仍然连接失败,请刷新本页面或稍后再试。")) : (a.config.messager("warning", "视频连接中断，尝试重新播放。"), "204" != c && (a.video = null, a.getData().play()))
                }
                "onEnd" == b && a.config.complete()
            }
        });
        return a
    };
    a.play = function(b, c) { ! a.ready() || !a.video ? window.setTimeout(arguments.length ? 
        function() {
            return a.play(b, c)
        }: a.play, 100) : a.video.vodinfo_list && (arguments.length || (c = {
            firstPlay: !0
        }), a.open(b, !0, c));
        return a
    };
    a.init()
};