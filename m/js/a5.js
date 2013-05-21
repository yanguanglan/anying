(function() {
    function l(a) {
        return (a + "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\s+/g, "&nbsp;")
    }
    function g(a) {
        a.stopPropagation();
        a.preventDefault();
        return ! 1
    }
    function t() {
        var a = $("#search-result");
        a.length || (a = $('<div id="search-result"/>').insertBefore("#search").css({
            width: $("#search").outerWidth(),
            top: $("#search").offset().top + $("#search").outerHeight() - 7
        }).click(function(a) {
            a.stopPropagation()
        }), $("#q").click(function(b) {
            var c = $.trim($("#q").val());
            c && n[c] && a.show();
            b.stopPropagation()
        }), $(document).click(function() {
            a.hide().find("li").removeClass("focused")
        }));
        return a
    }
    var c = {},
    e = this,
    u = "localhost" == e.location.host,
    v = !!(e.navigator.userAgent + "").match(/(?:android|iphone|ipod|ipad|ios)/i),
    s = swfobject.hasFlashPlayerVersion("10"); (e.navigator.userAgent + "").match(/(?:chrome)/i);
    c.maskId = "x2yun_mask_" + $.now();
    c.drop = {
        init: function() {
            function a() {
                b.css({
                    width: $(e).width(),
                    height: $(e).height()
                })
            }
            if (e.FileReader) {
                $.event.props.push("dataTransfer");
                var b = $("#" + c.maskId),
                d = $("#dropTip");
                b.length || (b = $('<div id="' + c.maskId + '" class="mask"></div>').appendTo("body").on("click", 
                function() {
                    b.hide();
                    d.hide()
                }));
                d.length || (d = $('<div id="dropTip">Drop to play</div>').appendTo("body"));
                $(e).on("scroll", a);
                $("*").on("drop", g);
                $("*").on("dragstart", g);
                $("body").on({
                    dragenter: function(c) {
                        c.stopPropagation();
                        c.preventDefault();
                        a();
                        b.show();
                        d.show();
                        return ! 1
                    },
                    dragover: g,
                    dragleave: g,
                    drop: g
                });
                $(b).on({
                    dragenter: g,
                    dragover: g,
                    dragleave: function(a) {
                        a.stopPropagation();
                        a.preventDefault();
                        b.hide();
                        d.hide();
                        return ! 1
                    },
                    drop: function(a) {
                        a.stopPropagation();
                        a.preventDefault();
                        b.hide();
                        d.hide();
                        a = a.dataTransfer || a.target || {};
                        var h = a.files || [];
                        $.each(h, 
                        function(a, b) {
                            var f = b.name;
                            if (f.match(/\.url$/)) return c.drop.playUrl(b),
                            !0;
                            if (f.match(/\.torrent$/)) return c.drop.playTorrent(b),
                            !0
                        });
                        if (!h.length) try {
                            var f = a.getData("Url") || a.getData("text/uri-list") || a.getData("Text");
                            f && ($("#u").val(l(f)), c.cleanUrl())
                        } catch(w) {}
                        return ! 1
                    }
                })
            }
        },
        playTorrent: function(a) {
            var b = new FileReader;
            b.readAsBinaryString(a);
            b.onloadend = function(a) {
                c.message("info", "开始播放拖放的种子文件。");
                var b = (a.currentTarget || a.target || {}).result || "";
                b ? ($.ajaxSetup({
                    cache: !0
                }), $.getScript("//x2dsj.b0.upaiyun.com/lib/bdecode.sha1.js", 
                function() {
                    for (var a = b, f = null; - 1 != a.indexOf("e");) {
                        a = a.substr(0, a.lastIndexOf("e"));
                        try {
                            f = bdecode(a + "e")
                        } catch(d) {}
                        if (f && f.info) break
                    }
                    f ? (a = SHA1.hex_sha1(bencode(f.info)).toUpperCase(), $("#u").val(l("magnet:?xt=urn:btih:" + a)), c.cleanUrl()) : c.message("error", "无效的种子文件。")
                }), $.ajaxSetup({
                    cache: !1
                })) : c.message("error", "无效的种子文件。")
            }
        },
        playUrl: function(a) {
            c.message("info", "开始播放拖放的快捷方式。");
            var b = new FileReader;
            b.readAsText(a, "GBK");
            b.onloadend = function(a) {
                try {
                    var b = ((a.currentTarget || a.target || {}).result || "").match(/\r\nURL=(.*?)\r\n/)[1];
                    $("#u").val(l(b));
                    c.cleanUrl()
                } catch(h) {
                    c.message("error", "无效的快捷方式。")
                }
            }
        }
    };
    c.uploader = {
        uploadFile: function() {
            if (c.uploader.uploader && c.uploader.uploader.x2_uploader_uploadFile) return c.uploader.uploader.x2_uploader_uploadFile()
        },
        setStyle: function(a) {
            if (c.uploader.uploader && c.uploader.uploader.x2_uploader_setStyle) return c.uploader.uploader.x2_uploader_setStyle(a)
        },
        uploadError: function(a, b) {
            alert(6 == a ? "BT文件上传超时，请稍候重试": 5 == a ? "BT文件大小超过6M，请选择其他BT文件": "BT文件上传失败，请稍候重试")
        },
        browser: function() {},
        uploadSuccess: function(a) {
            if (a = jQuery.parseJSON(a)) {
                var b = a.ret;
                0 == b && 40 == a.infohash.length ? ($("#u").val("magnet:?xt=urn:btih:" + a.infohash), c.cleanUrl()) : c.message("error", 2 == b ? "请求参数有误，请检查后重新添加": 6 == b ? "该种子文件解析失败，请稍后再试": "BT文件上传失败，请稍候重试")
            }
        },
        uploadProgress: function(a, b) {
            c.message("info", "正在上传 " + l(b) + " " + parseInt(100 * a, 10) + "%")
        },
        setFilename: function(a) {
            c.message("info", "开始上传 " + l(a))
        },
        init: function() {
            var a = $("#upload-button");
            if (a.length) if (s) {
                var b = a.outerHeight(),
                d = a.outerWidth();
                $('<div id="uploader"><div id="_uploader"></div></div>').css({
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: d,
                    height: b,
                    cursor: "pointer"
                }).appendTo(a.css({
                    position: "relative"
                }).off("click"));
                swfobject.embedSWF("//vod.xunlei.com/media/fileUploader.swf", "_uploader", d, b, "10.0.0", "//vod.xunlei.com/library/expressInstall.swf", {
                    description: "请选择BT种子文件(*.torrent)",
                    extension: "*.torrent",
                    timeOut: 10,
                    url: "http://dynamic.vod.lixian.xunlei.com/interface/upload_bt",
                    label: "",
                    limitSize: 6442450944,
                    jsPrefix: "x2.uploader.",
                    asPrefix: "x2_uploader_",
                    isImmediately: !0
                },
                {
                    wmode: "transparent",
                    allowScriptAccess: "always"
                },
                {
                    id: "_uploader",
                    name: "_uploader"
                },
                function(b) {
                    b.success && (c.uploader.uploader = ( - 1 != e.navigator.appName.indexOf("Microsoft") ? e: document)._uploader, a.prop("disabled", !1))
                })
            } else a.hide()
        }
    };
    c.playerId = "x2yun_" + $.now();
    c.player = {
        init: function(a) {
            e.location.hash = "!u=" + encodeURIComponent(a.url);
            c.player.playByX2(a)
        },
        playByX2: function(a) {
            var b = $.extend({},
            a);
            b.url = c.encode_uri(b.url);
            b.name = c.encode_uri(b.name);
            b = $.extend(b, {
                encode: "x2_encode",
                ver: 3,
                method: "getVideoInfo"
            });
            $.getJSON("//proxy.fengboting.com/?callback=?&" + $.param(b), 
            function(b) {
                b.filename && c.setVideoData({
                    name: decodeURIComponent(b.filename)
                });
                b = b.file && b.file.xuanfeng && b.video && b.video.xuanfeng;
                if (s && b) return c.player.playXuanfeng(b);
                $.ajaxSetup({
                    cache: !0
                });
                $.getScript("//x2dsj.b0.upaiyun.com/x2tv/js/xunlei.lixian.player.v5.js", 
                function() {
                    $.getScript("http://dynamic.vod.lixian.xunlei.com/fx", 
                    function() {
                        new xunleiLixianPlayerV5(a, {
                            play: !0,
                            debug: !u,
                            mobile: v,
                            api: "//xunlei.fengboting.com/?ver=3&method=getXunleiInfo",
                            encode: {
                                name: "x2_encode",
                                method: c.encode_uri
                            },
                            autoPlay: !0,
                            container: "player",
                            player: c.playerId,
                            callback: c.setVideoData,
                            complete: function() {},
                            messager: c.message
                        })
                    })
                });
                $.ajaxSetup({
                    cache: !1
                })
            })
        },
        playXuanfeng: function(a) {
            a.w = $("#player").width();
            a.h = $("#player").height();
            a = "//x2dsj.b0.upaiyun.com/x2yun.v2/xf.cloudplayer.html?" + $.param(a);
            $("#player").html('<iframe style="width:100%;height:100%;" marginWidth="0" marginHeight="0" scrolling="no" frameBorder="0" src="' + a + '" allowtransparency="true"></iframe>')
        },
        playFlv: function(a) {
            flashvars = {
                src: encodeURIComponent(a),
                autoPlay: !0
            };
            $("#player").html('<div id="' + c.playerId + '"/>');
            swfobject.embedSWF("//fpdownload.adobe.com/strobe/FlashMediaPlayback.swf", c.playerId, "100%", "100%", "10.0.0", "//vod.xunlei.com/library/expressInstall.swf", flashvars, {
                allowFullScreen: !0,
                allowScriptAccess: "never",
                bgcolor: "#000000",
                wmode: "opaque",
                quality: "high",
                menu: !1
            },
            {
                id: c.playerId,
                name: c.playerId
            })
        },
        playMp4: function(a, b) {
            $('<video id="' + c.playerId + '"/>').attr({
                src: b,
                type: "video/mp4; codecs='avc1.42E01E, mp4a.40.2'"
            }).prop({
                autoplay: !0,
                preload: !0,
                controls: !0
            }).css({
                width: $("#player").width(),
                height: $("#player").height(),
                background: "#000"
            }).appendTo($("#player").html(""))
        },
        getTrialCookie: function() {
            return $.getScript("//dynamic.vod.lixian.xunlei.com/fx")
        },
        playByVip: function(a, b) {
            var c = "//vod.xunlei.com/client/cplayer.html?" + $.param({
                uvs: [b.userid, b.isvip, b.sessionid].join("_"),
                url: a.url
            });
            $("#player").html('<iframe style="width:100%;height:100%;" marginWidth="0" marginHeight="0" scrolling="no" frameBorder="0" src="' + c + '"></iframe>')
        },
        getXlCookie: function(a) {
            $.getJSON("//dynamic.vod.lixian.xunlei.com/interface/getXlCookie?jsonp=?", a)
        }
    };
    c.play = c.player.init;
    var p = $("#filename"),
    m = [];
    c.showFiles = function(a) {
        function b(a) {
            var b = [];
            $.each(a, 
            function(a, c) {
                var d = decodeURIComponent(c.name),
                d = d.slice(d.lastIndexOf("/") + 1);
                b.push('<option value="' + c.index + '">');
                b.push(l(d));
                b.push("</option>")
            });
            return b.join("")
        }
        function d(a) {
            if (1 == a.length) return decodeURIComponent(a[0].name);
            var c = [],
            d = {};
            $.each(a, 
            function(a, b) {
                var k = decodeURIComponent(b.name);
                0 < k.indexOf("/") ? (k = k.slice(0, k.lastIndexOf("/")), d[k] = d[k] ? d[k] : [], d[k].push(b)) : c.push(b)
            });
            var k = ["<select>"];
            k.push(b(c));
            $.each(d, 
            function(a, c) {
                c = d[a];
                k.push('<optgroup label="' + l(a) + '">');
                k.push(b(c));
                k.push("</optgroup>")
            });
            k.push("</select>");
            return k.join("") + " 该链接包含多个视频，请选择播放。"
        }
        function e() {
            var b = p.find("select").val(),
            f = {};
            $.each(m, 
            function(a, c) {
                if (c.index == b) return f = c,
                !0
            });
            c.play({
                url: "bt://" + a + "/" + f.index,
                name: decodeURIComponent(f.name),
                hash: a,
                index: f.index,
                gcid: f.gcid,
                cid: f.cid,
                filesize: f.file_size,
                url_hash: f.url_hash,
                duration: 0
            })
        }
        a = a.toUpperCase();
        if (a.match(/^[A-Z0-9]{40}$/)) return c.message("info", "分析磁力链或种子视频..."),
        $.getJSON("http://i.vod.xunlei.com/req_subBT/info_hash/" + a + "/req_num/2000/req_offset/0/?jsonp=?", 
        function(a) { ! a || !a.resp ? c.message("warning", "分析磁力链或种子视频失败。") : (m = a.resp.subfile_list || [], m.length && (a = d(m), p.html(a).show().find("select").change(e).find("option").click(e)))
        }).error(function() {
            c.message("error", "获取磁力链或种子视频失败。")
        })
    };
    c.setVideoData = function(a) {
        try {
            a.name = decodeURIComponent(a.name)
        } catch(b) {}
        document.title = a.name ? "Hello Movie - " + l(a.name) : "";
        p.html() || p.html(l(a.name));
        try {
            e.bdShare.fn.conf.bdText = "#Hello Movie#" + (a.name ? " " + a.name: "")
        } catch(c) {}
    };
    c.initMessageBox = function() {
        function a() {
            b.css({
                top: $(e).scrollTop(),
                left: ($(e).width() - b.width()) / 2 + $(e).scrollLeft()
            })
        }
        if (!$("#message").length) {
            var b = $('<div id="message"><div id="message-inner"><div id="message-close">&times;</div><div id="message-body">&nbsp;</div></div></div>').appendTo("body").on("mouseover", 
            function() {
                $(this).stop().css({
                    opacity: 1
                })
            });
            $(e).on({
                resize: a,
                scroll: a
            });
            a();
            b.find("#message-close").click(function() {
                $("#message").hide()
            })
        }
    };
    c.message = function(a, b) {
        c.initMessageBox();
        if (!a || !b) return $("#message").hide();
        $("#message-body").html(b).attr("class", a);
        $("#message-close").attr("class", a);
        $("#message").show().stop().css({
            opacity: 1
        });
        "error" == a ? alert(b) : $("#message").fadeOut(8E3);
        $(e).resize()
    };
    c.encode_uri = function(a) {
        var b = [],
        c = "",
        e = "";
        a = (a + "").split("");
        for (var h = 0, f = a.length; h < f; h++) c = a[h],
        e = encodeURIComponent(c),
        e == c && (e = c.charCodeAt(0).toString(16), e = ("00" + e).slice( - 2)),
        b.push(e);
        return b.join("").replace(/%/g, "").toUpperCase()
    };
    c.decode_uri = function(a) {
        var b = [];
        a = a.split("");
        for (var c = 0, e = a.length; c < e; c += 2) b.push("%" + a[c] + a[c + 1]);
        return decodeURIComponent(b.join(""))
    };
    c.cleanUrl = function() {
        function a(a) {
            a.error ? (c.message("error", a.error), $("#u").focus()) : !a.hash && !a.url ? (c.message("error", "无效的文件链接。"), $("#u").focus()) : (document.title = "Hello Movie", p.html(""), m = [], a.hash ? c.showFiles(a.hash).done(function() {
                if (m.length) {
                    var b = "index" in a && -1 != a.index ? a.index: m[0].index;
                    p.find("select").val(b);
                    var d = {};
                    $.each(m, 
                    function(a, c) {
                        if (c.index == b) return d = c,
                        !0
                    });
                    c.play({
                        url: "bt://" + a.hash + "/" + d.index,
                        name: decodeURIComponent(d.name),
                        hash: a.hash,
                        index: d.index,
                        gcid: d.gcid,
                        cid: d.cid,
                        filesize: d.file_size,
                        url_hash: d.url_hash,
                        duration: 0
                    })
                } else c.message("error", "该磁力链或种子不包含视频文件。")
            }) : c.play({
                url: a.url
            }))
        }
        var b = $.trim($("#u").val());
        b.match(/^[A-F0-9]{40}$/i) && (b = "magnet:?xt=urn:btih:" + b.toUpperCase());
        if (b.match(/^(?:http|https|ftp|thunder|mms|qqdl|rtsp|magnet|flashget|ed2k|bt|xlpan):/i)) {
            var d = (b + "&").match(/^(magnet:\?xt=urn:btih:([A-F0-9]{40}))&/) || (b + "/").match(/^(bt:\/\/([A-F0-9]{40})\/(\d+))\//) || (b + "/").match(/^(bt:\/\/([A-F0-9]{40}))\//) || b.match(/^(xlpan:\/\/(?:.*?))$/),
            e = /^http:\/\/f\.xunlei\.com\/(\d+)\/file\/([a-f0-9\-]+?)\//,
            h = c.encode_uri(b);
            d ? a({
                index: d[3] ? parseInt(d[3], 10) : -1,
                hash: d[2] ? d[2] : "",
                url: d[1]
            }) : b.match(/^http:\/\/(?:.*?)\.torrent$/) ? (c.message("info", "下载种子..."), $.getJSON("api.php?callback=?&method=downloadTorrent&u=" + encodeURIComponent(h) + "&encode=x2.encode_uri", a)) : (b + "/").match(e) ? (c.message("info", "获取迅雷盘资源..."), b = (b + "/").match(e), $.getJSON("//svr.f.xunlei.com/fileContent/getFile?callback=?&node=" + encodeURIComponent(b[1] + ":" + b[2]), 
            function(b) { ! b || b.rtn || !b.data || !b.data.file ? c.message("error", "无效的迅雷盘链接...") : (b = b.data.file, !b.vodCode || !b.path ? c.message("error", "无效的迅雷盘链接...") : a({
                    url: "xlpan://" + b.vodCode + b.path
                }))
            })) : (c.message("info", "解析播放地址..."), $.getJSON("api.php?callback=?&method=cleanurl&u=" + encodeURIComponent(h) + "&encode=x2.encode_uri", a))
        } else c.message("error", "无效的播放地址。"),
        $("#u").focus()
    };
    var n = {},
    q = null,
    r = null;
    c.search = function(a, b) {
        function d(a) {
            var b = [];
            a.page && (a.page.total && 1 < a.page.total) && (b.push('<div class="pagination">'), a.page.total > a.page.current && b.push('<a href="javascript://" data-page="' + (a.page.current + 1) + '" title="下一页">&rArr;</a>'), 1 < a.page.current && b.push('<a href="javascript://" data-page="' + (a.page.current - 1) + '" title="上一页">&lArr;</a>'), b.push("<span>" + a.page.current + "/" + a.page.total + "</span>"), b.push("</div>"));
            b.push("<ul>");
            $.each(a.links, 
            function(a, c) {
                a = a.toUpperCase();
                b.push('<li><a href="#!u=bt://' + a + '" data-hash="' + a + '">' + l(c) + "</a></li>")
            });
            b.push("</ul>");
            g.show().html(b.join("")).css({
                height: g.find("ul").height()
            }).find("ul>li>a").on("click", 
            function() {
                $("#u").val("magnet:?xt=urn:btih:" + $(this).data("hash"));
                c.cleanUrl()
            });
            a = g.find(".pagination");
            a.css({
                opacity: 0.7,
                width: 40 * a.find("a").length + a.find("span").width() + 5
            }).find("a").on("click", 
            function() {
                c.search(null, $(this).data("page"))
            })
        }
        var g = t();
        a = a || {};
        if ("submit" == a.type) {
            var h = g.not(":hidden").find("ul>li.focused a");
            if (h.data("hash")) {
                h.click();
                return
            }
        }
        "click" == a.type && a.stopPropagation();
        b = parseInt(b, 10) || 1;
        var f = $.trim($("#q").val());
        f || (alert("请输入关键词。"), $("#q").focus());
        q && (q.abort(), q = null);
        r && (e.clearTimeout(r), r = null);
        n[f] = n[f] || {};
        n[f][b] ? d(n[f][b]) : ($.now(), g.show().html('<div class="loading">loading..</div>').css({
            height: 200
        }), h = {
            encode: "x2_encode",
            ver: 3,
            q: c.encode_uri(f),
            method: "search",
            page: b
        },
        q = $.getJSON("//proxy.fengboting.com/?callback=?&" + $.param(h), 
        function(a) {
            a.error || !a.links ? (g.hide(), alert(a.error || "没有搜索到任何链接。")) : (n[f][b] = a, d(a))
        }))
    };
    c.hashQuery = function(a) {
        var b = {},
        c = e.location.hash + "";
        if (0 == c.indexOf("#%21")) try {
            c = decodeURIComponent(c)
        } catch(g) {
            c = c.replace("#%21", "#!")
        }
        $.each(c.replace(/^#!/, "").split("&"), 
        function(a, c) {
            var d = c.match(/^(.*?)=(.*?)$/);
            if (d) {
                var e = d[2];
                try {
                    e = decodeURIComponent(e)
                } catch(g) {}
                b[d[1]] = e
            }
        });
        return a ? b[a] : b
    };
    $(document).ready(function() { ("." + e.location.host).match(/\.(?:xiaoer\.tv|x2yun\.com|localhost|x2y2\.com|xiaoyemian\.com)$/) || (e.location.href = "//www.x2yun.com/?from=js&host=" + encodeURIComponent(e.location.host) + "&" + (e.location.search + "").replace("?", "&") + e.location.hash);
        $("#search-btn").click(c.search);
        $("#search").submit(c.search);
        $("#play-button").click(function(a) {
            g(a);
            c.cleanUrl()
        });
        c.initMessageBox();
        c.uploader.init();
        c.drop.init(); ! $("#u").val() && c.hashQuery("u") && $("#u").val(c.hashQuery("u").split("#")[0]);
        $("#u").val() && c.cleanUrl()
    });
    e.x2 = c
})();