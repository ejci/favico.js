/**
 * @license MIT
 * @fileOverview Favico animations
 * @author Miroslav Magda, http://blog.ejci.net
 * @version .4.0
 */

/**
 * Create new favico instance
 * @param {Object} Options
 * @return {Object} Favico object
 * @example
 * var favico = new Favico({
 *    bgColor : '#d00',
 *    textColor : '#fff',
 *    fontFamily : 'sans-serif',
 *    fontStyle : 'bold',
 *    position : 'down',
 *    type : 'circle',
 *    animation : 'slide',
 * });
 */
(function() {

    var Favico = (function(params) {'use strict';
        var VERSION = '.4.0';
        var defaultParams = {
            bgColor : '#d00',
            textColor : '#fff',
            fontFamily : 'sans-serif', //Arial,Verdana,Times New Roman,serif,sans-serif,...
            fontStyle : 'bold', //normal,italic,oblique,bold,bolder,lighter,100,200,300,400,500,600,700,800,900
            type : 'circle',
            position : 'down', // down, up, left, leftup (upleft)
            animation : 'slide',
            fallbackUrl : '//favico.jit.su/image',
            elementId : false
        };
        var element, height, width, canvas, ctx, tempImg, isReady, isLastFrame, isRunning, isReadyCb, stop, browser, animationTimer, drawTimer;

        var queue = [];

        params = (params) ? params : {};
        isReadyCb = function() {
        };
        isReady = stop = false;

        browser = {};
        browser.ff = (/firefox/i.test(navigator.userAgent.toLowerCase()));
        browser.chrome = (/chrome/i.test(navigator.userAgent.toLowerCase()));
        browser.opera = (/opera/i.test(navigator.userAgent.toLowerCase()));
        browser.ie = (/msie/i.test(navigator.userAgent.toLowerCase())) || (/trident/i.test(navigator.userAgent.toLowerCase()));
        browser.safari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
        browser.supported = (browser.chrome || browser.ff || browser.opera);

        /**
         * Initialize favico
         */
        var init = function() {
            //merge initial options
            params = merge(defaultParams, params);

            params.position = params.position.toLowerCase();
            params.animation = (animation.types['' + params.animation]) ? params.animation : defaultParams.animation;

            var isUp = params.position.indexOf('up') > -1;
            var isLeft = params.position.indexOf('left') > -1;

            //transform animation frames coordinates (default)
            if (isUp || isLeft) {
                for (var i = 0; i < animation.types['' + params.animation].length; i++) {
                    var frame = animation.types['' + params.animation][i];
                    if (isUp) {
                        if (frame.y < .6) {
                            frame.y = frame.y - .4;
                        } else {
                            frame.y = frame.y - 2 * frame.y + (1 - frame.w);
                        }
                    }
                    if (isLeft) {
                        if (frame.x < .6) {
                            frame.x = frame.x - .4;
                        } else {
                            frame.x = frame.x - 2 * frame.x + (1 - frame.h);
                        }
                    }
                    animation.types['' + params.animation][i] = frame;
                }
            }
            params.type = (type['' + params.type]) ? params.type : defaultParams.type;

            try {
                element = link.getIcon();
                if (browser.supported) {
                    /**
                     * Create temporary elements
                     */
                    canvas = document.createElement('canvas');
                    tempImg = document.createElement('img');
                    if (element.hasAttribute('href')) {
                        tempImg.setAttribute('src', element.getAttribute('href'));
                        /**
                         * Get width and height of image
                         */
                        tempImg.onload = function() {
                            height = (tempImg.height > 0) ? tempImg.height : 32;
                            width = (tempImg.width > 0) ? tempImg.width : 32;
                            canvas.height = height;
                            canvas.width = width;
                            ctx = canvas.getContext('2d');
                            icon.ready();
                        };
                    } else {
                        /**
                         * Create default empty image
                         */
                        tempImg.setAttribute('src', '');
                        height = 32;
                        width = 32;
                        tempImg.height = height;
                        tempImg.width = width;
                        canvas.height = height;
                        canvas.width = width;
                        ctx = canvas.getContext('2d');
                        icon.ready();
                    }
                } else {
                    /**
                     * Fallback
                     */
                    icon.ready();
                }
            } catch(e) {
                throw 'Error initializing favico. Message: ' + e.message;
            }

        };
        /**
         * Icon namespace
         */
        var icon = {};
        /**
         * Icon is ready (reset icon) and start animation (if ther is any)
         */
        icon.ready = function() {
            isReady = true;
            icon.reset();
            isReadyCb();
        };

        /**
         * Reset icon to default state
         */
        icon.reset = function() {
            queue = [];
            isRunning = false;
            isLastFrame = false;
            if (browser.supported) {
                ctx.clearRect(0, 0, width, height);
                ctx.drawImage(tempImg, 0, 0, width, height);
                link.setIcon(canvas);
            } else {
                link.setIcon();
            }
            window.clearTimeout(animationTimer);
            window.clearTimeout(drawTimer);
        };
        /**
         * Start animation
         */
        icon.start = function() {
            if (!isReady || isRunning) {
                return;
            }
            var finished = function() {
                isLastFrame = queue[0];
                isRunning = false;
                if (queue.length > 0) {
                    queue.shift();
                    icon.start();
                } else {

                }
            };
            if (queue.length > 0) {
                isRunning = true;
                var run = function() {
                    animation.run(queue[0].options, function() {
                        finished();
                    }, false);
                };
                if (isLastFrame) {
                    animation.run(isLastFrame.options, function() {
                        run();
                    }, true);
                } else {
                    run();
                }
            }
        };

        /**
         * Badge types
         */
        var type = {};
        var options = function(opt) {
            opt.n = (( typeof opt.n) === 'number') ? Math.abs(opt.n | 0) : opt.n;
            opt.x = width * opt.x;
            opt.y = height * opt.y;
            opt.w = width * opt.w;
            opt.h = height * opt.h;
            opt.len = ("" + opt.n).length;
            return opt;
        };
        /**
         * Generate circle
         * @param {Object} opt Badge options
         */
        type.circle = function(opt) {
            opt = options(opt);
            var badgeParams = merge(params,opt);
            var more = false;
            if (opt.len === 2) {
                opt.x = opt.x - opt.w * .4;
                opt.w = opt.w * 1.4;
                more = true;
            } else if (opt.len >= 3) {
                opt.x = opt.x - opt.w * .65;
                opt.w = opt.w * 1.65;
                more = true;
            }
            var bgColor = hexToRgb(badgeParams.bgColor);
            var textColor = hexToRgb(badgeParams.textColor);

            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(tempImg, 0, 0, width, height);
            ctx.beginPath();
            ctx.font = badgeParams.fontStyle + " " + Math.floor(opt.h * (opt.n > 99 ? .85 : 1)) + "px " + badgeParams.fontFamily;
            ctx.textAlign = 'center';
            if (more) {
                ctx.moveTo(opt.x + opt.w / 2, opt.y);
                ctx.lineTo(opt.x + opt.w - opt.h / 2, opt.y);
                ctx.quadraticCurveTo(opt.x + opt.w, opt.y, opt.x + opt.w, opt.y + opt.h / 2);
                ctx.lineTo(opt.x + opt.w, opt.y + opt.h - opt.h / 2);
                ctx.quadraticCurveTo(opt.x + opt.w, opt.y + opt.h, opt.x + opt.w - opt.h / 2, opt.y + opt.h);
                ctx.lineTo(opt.x + opt.h / 2, opt.y + opt.h);
                ctx.quadraticCurveTo(opt.x, opt.y + opt.h, opt.x, opt.y + opt.h - opt.h / 2);
                ctx.lineTo(opt.x, opt.y + opt.h / 2);
                ctx.quadraticCurveTo(opt.x, opt.y, opt.x + opt.h / 2, opt.y);
            } else {
                ctx.arc(opt.x + opt.w / 2, opt.y + opt.h / 2, opt.h / 2, 0, 2 * Math.PI);
            }
            ctx.fillStyle = 'rgba(' + bgColor.r + ',' + bgColor.g + ',' + bgColor.b + ',' + opt.o + ')';
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.stroke();
            ctx.fillStyle = 'rgba(' + textColor.r + ',' + textColor.g + ',' + textColor.b + ',' + opt.o + ')';
            if (( typeof opt.n) === 'number' && opt.n > 999) {
                ctx.fillText(((opt.n > 9999) ? 9 : Math.floor(opt.n / 1000) ) + 'k+', Math.floor(opt.x + opt.w / 2), Math.floor(opt.y + opt.h - opt.h * .2));
            } else {
                ctx.fillText(opt.n, Math.floor(opt.x + opt.w / 2), Math.floor(opt.y + opt.h - opt.h * .15));
            }
            ctx.closePath();
        };
        /**
         * Generate rectangle
         * @param {Object} opt Badge options
         */
        type.rectangle = function(opt) {
            opt = options(opt);
            var badgeParams = merge(params,opt);
            
            var more = false;
            if (opt.len === 2) {
                opt.x = opt.x - opt.w * .4;
                opt.w = opt.w * 1.4;
                more = true;
            } else if (opt.len >= 3) {
                opt.x = opt.x - opt.w * .65;
                opt.w = opt.w * 1.65;
                more = true;
            }
            var bgColor = hexToRgb(badgeParams.bgColor);
            var textColor = hexToRgb(badgeParams.textColor);

            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(tempImg, 0, 0, width, height);
            ctx.beginPath();
            ctx.font = badgeParams.fontStyle + " " + Math.floor(opt.h * (opt.n > 99 ? .9 : 1)) + "px " + badgeParams.fontFamily;
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(' + bgColor.r + ',' + bgColor.g + ',' + bgColor.b + ',' + opt.o + ')';
            ctx.fillRect(opt.x, opt.y, opt.w, opt.h);
            ctx.fillStyle = 'rgba(' + textColor.r + ',' + textColor.g + ',' + textColor.b + ',' + opt.o + ')';
            if (( typeof opt.n) === 'number' && opt.n > 999) {
                ctx.fillText(((opt.n > 9999) ? 9 : Math.floor(opt.n / 1000) ) + 'k+', Math.floor(opt.x + opt.w / 2), Math.floor(opt.y + opt.h - opt.h * .2));
            } else {
                ctx.fillText(opt.n, Math.floor(opt.x + opt.w / 2), Math.floor(opt.y + opt.h - opt.h * .15));
            }
            ctx.closePath();
        };

        /**
         * Set badge
         */
        var badge = function(number, opts) {
            opts = (( typeof opts) === 'string' ? {
                animation : opts
            } : opts) || {};
            isReadyCb = function() {
                try {
                    if ( typeof (number) === 'number' ? (number > 0) : (number !== '')) {
                        var q = {
                            type : 'badge',
                            options : {
                            }
                        };
                        q.options = merge(params, opts);
                        q.options.n=number;
                        queue.push(q);
                        if (queue.length > 100) {
                            throw 'Too many badges requests in queue.';
                        }
                        icon.start();
                    } else {
                        icon.reset();
                    }
                } catch(e) {
                    throw 'Error setting badge. Message: ' + e.message;
                }
            };
            if (browser.supported) {
                if (isReady) {
                    isReadyCb();
                }
            } else {
                var badgeParams = params;
                badgeParams.url = element.getAttribute('x-orig-src');
                badgeParams.badge = number;
                badgeParams = merge(params, opts);
                element.href = params.fallbackUrl + '?options=' + encodeURIComponent(JSON.stringify(badgeParams)) + '&v=' + VERSION;
                element.src = element.href;
            }
        };

        /**
         * Set image as icon
         */
        var image = function(imageElement) {
            isReadyCb = function() {
                try {
                    var w = imageElement.width;
                    var h = imageElement.height;
                    var newImg = document.createElement('img');
                    var ratio = (w / width < h / height) ? (w / width) : (h / height);
                    newImg.setAttribute('src', imageElement.getAttribute('src'));
                    newImg.height = (h / ratio);
                    newImg.width = (w / ratio);
                    ctx.clearRect(0, 0, width, height);
                    ctx.drawImage(newImg, 0, 0, width, height);
                    link.setIcon(canvas);
                } catch(e) {
                    throw 'Error setting image. Message: ' + e.message;
                }
            };
            if (browser.supported) {
                if (isReady) {
                    isReadyCb();
                }
            } else {
                params.url = element.getAttribute('x-orig-src');
                params.badge = number;
                merge(params, opt);
                imageElement.src = params.fallbackUrl + '?options=' + encodeURIComponent(JSON.stringify(params)) + '&v=' + VERSION;
            }
        };
        /**
         * Set video as icon
         */
        var video = function(videoElement) {
            if (browser.supported) {
                isReadyCb = function() {
                    try {
                        if (videoElement === 'stop') {
                            stop = true;
                            icon.reset();
                            stop = false;
                            return;
                        }

                        videoElement.addEventListener('play', function() {
                            drawVideo(this);
                        }, false);

                    } catch(e) {
                        throw 'Error setting video. Message: ' + e.message;
                    }
                };
                if (isReady) {
                    isReadyCb();
                }
            }
        };
        /**
         * Set video as icon
         */
        var webcam = function(action) {
            if (browser.supported) {
                var newVideo = false;
                if (!window.URL || !window.URL.createObjectURL) {
                    window.URL = window.URL || {};
                    window.URL.createObjectURL = function(obj) {
                        return obj;
                    };
                }
                navigator.getUserMedia = navigator.getUserMedia || navigator.oGetUserMedia || navigator.msGetUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
                isReadyCb = function() {
                    try {
                        if (action === 'stop') {
                            stop = true;
                            icon.reset();
                            stop = false;
                            return;
                        }
                        newVideo = document.createElement('video');
                        newVideo.width = width;
                        newVideo.height = height;
                        navigator.getUserMedia({
                            video : true,
                            audio : false
                        }, function(stream) {
                            newVideo.src = URL.createObjectURL(stream);
                            newVideo.play();
                            drawVideo(newVideo);
                        }, function() {
                        });
                    } catch(e) {
                        throw 'Error setting webcam. Message: ' + e.message;
                    }
                };
                if (isReady) {
                    isReadyCb();
                }
            }

        };

        /**
         * Draw video to context and repeat :)
         */
        function drawVideo(video) {
            if (video.paused || video.ended || stop) {
                return false;
            }
            //nasty hack for FF webcam (Thanks to Julian Ćwirko, kontakt@redsunmedia.pl)
            try {
                ctx.clearRect(0, 0, width, height);
                ctx.drawImage(video, 0, 0, width, height);
            } catch(e) {

            }
            drawTimer = setTimeout(drawVideo, animation.duration, video);
            link.setIcon(canvas);
        }

        var link = {};
        /**
         * Get icon from HEAD tag or create a new <link> element
         */
        link.getIcon = function() {
            var elm = false;
            var url = '';
            //get link element
            var getLink = function() {
                var link = document.getElementsByTagName('head')[0].getElementsByTagName('link');
                for (var l = link.length, i = (l - 1); i >= 0; i--) {
                    if ((/(^|\s)icon(\s|$)/i).test(link[i].getAttribute('rel'))) {
                        return link[i];
                    }
                }
                return false;
            };
            if (params.elementId) {
                //if img element identified by elementId
                elm = document.getElementById(params.elementId);
                elm.setAttribute('href', elm.src);
                elm.setAttribute('x-orig-src', elm.src);
            } else {
                //if link element
                elm = getLink();
                if (elm === false) {
                    elm = document.createElement('link');
                    elm.setAttribute('rel', 'icon');
                    document.getElementsByTagName('head')[0].appendChild(elm);
                }
                elm.setAttribute('x-orig-src', elm.href);
            }
            //check if image and link url is on same domain. if not raise error
            url = (params.elementId) ? elm.src : elm.href;
            if (browser.supported && url.substr(0, 5) !== 'data:' && url.indexOf(document.location.hostname) === -1) {
                throw new Error('Error setting favicon. Favicon image is on different domain (Icon: ' + url + ', Domain: ' + document.location.hostname + ')');
            }
            elm.setAttribute('type', 'image/png');
            return elm;
        };
        link.setIcon = function(canvas) {
            if (canvas) {
                var url = canvas.toDataURL('image/png');
                if (params.elementId) {
                    //if is attached to element (image)
                    element.setAttribute('src', url);
                } else {
                    //if is attached to fav icon
                    if (browser.ff || browser.opera) {
                        //for FF we need to "recreate" element, atach to dom and remove old <link>
                        var old = element;
                        element = document.createElement('link');
                        if (browser.opera) {
                            element.setAttribute('rel', 'icon');
                        }
                        element.setAttribute('rel', 'icon');
                        element.setAttribute('type', 'image/png');
                        document.getElementsByTagName('head')[0].appendChild(element);
                        element.setAttribute('href', url);
                        if (old.parentNode) {
                            old.parentNode.removeChild(old);
                        }
                    } else {
                        element.setAttribute('href', url);
                    }
                }
            } else {
                //it will reset the default state
                element.setAttribute('href', element.getAttribute('x-orig-src'));
                element.setAttribute('src', element.getAttribute('x-orig-src'));
            }
        };

        //http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb#answer-5624139
        //HEX to RGB convertor
        function hexToRgb(hex) {
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                return r + r + g + g + b + b;
            });
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r : parseInt(result[1], 16),
                g : parseInt(result[2], 16),
                b : parseInt(result[3], 16)
            } : false;
        }

        /**
         * Merge options
         */
        function merge(def, opt) {
            var mergedOpt = {};
            var attrname;
            for (attrname in def) {
                mergedOpt[attrname] = def[attrname];
            }
            for (attrname in opt) {
                mergedOpt[attrname] = opt[attrname];
            }
            return mergedOpt;
        }

        /**
         * Cross-browser page visibility shim
         * http://stackoverflow.com/questions/12536562/detect-whether-a-window-is-visible
         */
        function isPageHidden() {
            return document.hidden || document.msHidden || document.webkitHidden || document.mozHidden;
        }

        /**
         * For each method (for older browsers)
         */
        function forEach(array, fn) {
            for (var i = 0; i < array.length; i++)
                fn(array[i], i);
        }

        /**
         * @namespace animation
         */
        var animation = {};
        /**
         * Animation "frame" duration
         */
        animation.duration = 40;
        /**
         * Animation types (none,fade,pop,slide)
         */
        animation.types = {};
        animation.types.fade = [{
            x : .4,
            y : .4,
            w : .6,
            h : .6,
            o : .0
        }, {
            x : .4,
            y : .4,
            w : .6,
            h : .6,
            o : .1
        }, {
            x : .4,
            y : .4,
            w : .6,
            h : .6,
            o : .2
        }, {
            x : .4,
            y : .4,
            w : .6,
            h : .6,
            o : .3
        }, {
            x : .4,
            y : .4,
            w : .6,
            h : .6,
            o : .4
        }, {
            x : .4,
            y : .4,
            w : .6,
            h : .6,
            o : .5
        }, {
            x : .4,
            y : .4,
            w : .6,
            h : .6,
            o : .6
        }, {
            x : .4,
            y : .4,
            w : .6,
            h : .6,
            o : .7
        }, {
            x : .4,
            y : .4,
            w : .6,
            h : .6,
            o : .8
        }, {
            x : .4,
            y : .4,
            w : .6,
            h : .6,
            o : .9
        }, {
            x : .4,
            y : .4,
            w : .6,
            h : .6,
            o : 1.0
        }];
        animation.types.none = [{
            x : .4,
            y : .4,
            w : .6,
            h : .6,
            o : 1
        }];
        animation.types.pop = [{
            x : 1,
            y : 1,
            w : 0,
            h : 0,
            o : 1
        }, {
            x : .9,
            y : .9,
            w : .1,
            h : .1,
            o : 1
        }, {
            x : .8,
            y : .8,
            w : .2,
            h : .2,
            o : 1
        }, {
            x : .7,
            y : .7,
            w : .3,
            h : .3,
            o : 1
        }, {
            x : .6,
            y : .6,
            w : .4,
            h : .4,
            o : 1
        }, {
            x : .5,
            y : .5,
            w : .5,
            h : .5,
            o : 1
        }, {
            x : .4,
            y : .4,
            w : .6,
            h : .6,
            o : 1
        }];
        animation.types.popFade = [{
            x : .75,
            y : .75,
            w : 0,
            h : 0,
            o : 0
        }, {
            x : .65,
            y : .65,
            w : .1,
            h : .1,
            o : .2
        }, {
            x : .6,
            y : .6,
            w : .2,
            h : .2,
            o : .4
        }, {
            x : .55,
            y : .55,
            w : .3,
            h : .3,
            o : .6
        }, {
            x : .50,
            y : .50,
            w : .4,
            h : .4,
            o : .8
        }, {
            x : .45,
            y : .45,
            w : .5,
            h : .5,
            o : .9
        }, {
            x : .4,
            y : .4,
            w : .6,
            h : .6,
            o : 1
        }];
        animation.types.slide = [{
            x : .4,
            y : 1,
            w : .6,
            h : .6,
            o : 1
        }, {
            x : .4,
            y : .9,
            w : .6,
            h : .6,
            o : 1
        }, {
            x : .4,
            y : .9,
            w : .6,
            h : .6,
            o : 1
        }, {
            x : .4,
            y : .8,
            w : .6,
            h : .6,
            o : 1
        }, {
            x : .4,
            y : .7,
            w : .6,
            h : .6,
            o : 1
        }, {
            x : .4,
            y : .6,
            w : .6,
            h : .6,
            o : 1
        }, {
            x : .4,
            y : .5,
            w : .6,
            h : .6,
            o : 1
        }, {
            x : .4,
            y : .4,
            w : .6,
            h : .6,
            o : 1
        }];
        /**
         * Run animation
         * @param {Object} opt Animation options
         * @param {Object} cb Callbak after all frames are done
         * @param {Object} revert Reverse order? true|false
         * @param {Object} frame Optional frame number
         */
        animation.run = function(opt, cb, revert, frame) {
            var animationType = animation.types[isPageHidden() ? 'none' : params.animation];
            if (revert === true) {
                frame = ( typeof frame !== 'undefined') ? frame : animationType.length - 1;
            } else {
                frame = ( typeof frame !== 'undefined') ? frame : 0;
            }
            cb = (cb) ? cb : function() {
            };
            if ((frame < animationType.length) && (frame >= 0)) {
                type[params.type](merge(opt, animationType[frame]));
                animationTimer = setTimeout(function() {
                    if (revert) {
                        frame = frame - 1;
                    } else {
                        frame = frame + 1;
                    }
                    animation.run(opt, cb, revert, frame);
                }, animation.duration);

                link.setIcon(canvas);
            } else {
                cb();
            }
        };

        /**
         * Auto init
         */
        init();
        /**
         * Public methods
         */
        return {
            badge : badge,
            video : video,
            image : image,
            webcam : webcam,
            reset : icon.reset,
            browser : {
                supported : browser.supported
            }
        };
    });

    // AMD / RequireJS
    if ( typeof define !== 'undefined' && define.amd) {
        define([], function() {
            return Favico;
        });
    }
    // CommonJS
    else if ( typeof module !== 'undefined' && module.exports) {
        module.exports = Favico;
    }
    // included directly via <script> tag
    else {
        this.Favico = Favico;
    }

})();

