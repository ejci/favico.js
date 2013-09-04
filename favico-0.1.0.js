/**
 * @fileOverview Favico animations
 * @author Miroslav Magda, http://blog.ejci.net
 * @version 0.1.0
 */
var Favico = (function(opt) {'use strict';
    opt = (opt) ? opt : {};
    var _def = {
        bgColor : '#d00',
        textColor : '#fff',
        type : 'circle',
        animation : 'slide',
        elementId : false
    };
    var _opt, _orig, _h, _w, _canvas, _context, _img, _stupidBrowser, _ready, _lastBadge, _runinng, _readyCb, _stop;
    var _queue = [];
    _readyCb = function() {
    };
    _ready = _stop = false;
    //merge initial options
    _opt = merge(_def, opt);
    _opt.bgColor = hexToRgb(_opt.bgColor);
    _opt.textColor = hexToRgb(_opt.textColor);
    /**
     * Initialize favico
     */
    var init = function() {
        try {
            _orig = fvi.getIcon();
            _canvas = document.createElement('canvas');
            _img = document.createElement('img');
            _img.setAttribute('src', _orig.getAttribute('href'));
            //get width/height
            _img.onload = function() {
                _h = (_img.height > 0) ? _img.height : 32;
                _w = (_img.width > 0) ? _img.width : 32;
                _canvas.height = _h;
                _canvas.width = _w;
                _context = _canvas.getContext('2d');
                icon.ready();
            };
            //:(
            _stupidBrowser = true;
            // _stupidBrowser = (/firefox/i.test(navigator.userAgent.toLowerCase())) || (/opera/i.test(navigator.userAgent.toLowerCase()));
        } catch(e) {
            console.error('Error initializing favico...', e);
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
        _ready = true;
        icon.reset();
        _readyCb();
    };
    /**
     * Reset icon to default state
     */
    icon.reset = function() {
        //reset
        _queue = [];
        _lastBadge = false;
        _context.clearRect(0, 0, _w, _h);
        _context.drawImage(_img, 0, 0, _w, _h);
        fvi.setIcon(_canvas);
    };
    /**
     * Start animation
     */
    icon.start = function() {
        if (!_ready || _runinng) {
            return;
        }
        var finished = function() {
            _lastBadge = _queue[0];
            _runinng = false;
            if (_queue.length > 0) {
                _queue.shift();
                icon.start();
            } else {

            }
        };
        if (_queue.length > 0) {
            _runinng = true;
            if (_lastBadge) {
                animation.run(_lastBadge.options, function() {
                    animation.run(_queue[0].options, function() {
                        finished();
                    }, false);
                }, true);
            } else {
                animation.run(_queue[0].options, function() {
                    finished();
                }, false);
            }
        }
    };

    /**
     * Badge types
     */
    var type = {};
    //set default options from "relative values"
    var options = function(opt) {
        opt.n = Math.abs(opt.n);
        opt.x = _w * opt.x;
        opt.y = _h * opt.y;
        opt.w = _w * opt.w;
        opt.h = _h * opt.h;
        return opt;
    };
    /**
     * Generate circle
     */
    type.circle = function(opt) {
        opt = options(opt);
        var more = (opt.n > 9);
        if (more) {
            opt.x = opt.x - opt.w * .4;
            opt.w = opt.w * 1.4;
        }
        //console.log('circle', opt);
        //reset
        _context.clearRect(0, 0, _w, _h);
        _context.drawImage(_img, 0, 0, _w, _h);
        _context.beginPath();
        _context.font = "bold " + Math.floor(opt.h) + "px sans-serif";
        _context.textAlign = 'center';
        if (more) {
            _context.moveTo(opt.x + opt.w / 2, opt.y);
            _context.lineTo(opt.x + opt.w - opt.h / 2, opt.y);
            _context.quadraticCurveTo(opt.x + opt.w, opt.y, opt.x + opt.w, opt.y + opt.h / 2);
            _context.lineTo(opt.x + opt.w, opt.y + opt.h - opt.h / 2);
            _context.quadraticCurveTo(opt.x + opt.w, opt.y + opt.h, opt.x + opt.w - opt.h / 2, opt.y + opt.h);
            _context.lineTo(opt.x + opt.h / 2, opt.y + opt.h);
            _context.quadraticCurveTo(opt.x, opt.y + opt.h, opt.x, opt.y + opt.h - opt.h / 2);
            _context.lineTo(opt.x, opt.y + opt.h / 2);
            _context.quadraticCurveTo(opt.x, opt.y, opt.x + opt.h / 2, opt.y);
        } else {
            _context.arc(opt.x + opt.w / 2, opt.y + opt.h / 2, opt.h / 2, 0, 2 * Math.PI);
        }
        _context.fillStyle = 'rgba(' + _opt.bgColor.r + ',' + _opt.bgColor.g + ',' + _opt.bgColor.b + ',' + opt.o + ')';
        _context.fill();
        _context.closePath();
        _context.beginPath();
        _context.stroke();
        _context.fillStyle = 'rgba(' + _opt.textColor.r + ',' + _opt.textColor.g + ',' + _opt.textColor.b + ',' + opt.o + ')';
        _context.fillText((more) ? '9+' : opt.n, Math.floor(opt.x + opt.w / 2), Math.floor(opt.y + opt.h - opt.h * 0.15));
        _context.closePath();
    };
    /**
     * Generate rectangle
     */
    type.rectangle = function(opt) {
        opt = options(opt);
        var more = (opt.n > 9);
        if (more) {
            opt.x = Math.floor(opt.x - opt.w * .4);
            opt.w = Math.floor(opt.w * 1.4);
        }
        //console.log('rectangle', opt);
        _context.clearRect(0, 0, _w, _h);
        _context.drawImage(_img, 0, 0, _w, _h);
        _context.beginPath();
        _context.font = "bold " + Math.floor(opt.h) + "px sans-serif";
        _context.textAlign = 'center';
        _context.fillStyle = 'rgba(' + _opt.bgColor.r + ',' + _opt.bgColor.g + ',' + _opt.bgColor.b + ',' + opt.o + ')';
        _context.fillRect(opt.x, opt.y, opt.w, opt.h);
        _context.fillStyle = 'rgba(' + _opt.textColor.r + ',' + _opt.textColor.g + ',' + _opt.textColor.b + ',' + opt.o + ')';
        _context.fillText((more) ? '9+' : opt.n, Math.floor(opt.x + opt.w / 2), Math.floor(opt.y + opt.h - opt.h * 0.15));
        _context.closePath();
    };

    /**
     * Set badge
     */
    var badge = function(number, animType) {
        _readyCb = function() {
            try {
                if (number > 0) {
                    if (animation.types['' + animType]) {
                        _opt.animation = animType;
                    }
                    _queue.push({
                        type : 'badge',
                        options : {
                            n : number
                        }
                    });
                    if (_queue.length > 100) {
                        console.warn('Too many badges request in queue...');
                    }
                    icon.start();
                } else {
                    icon.reset();
                }
            } catch(e) {
                console.error('Error setting badge...', e);
            }
        };
        if (_ready) {
            _readyCb();
        }
    };

    /**
     * Set image as icon
     */
    var image = function(imageElement) {
        _readyCb = function() {
            try {
                var w = imageElement.width;
                var h = imageElement.height;
                var newImg = document.createElement('img');
                var ratio = (w / _w < h / _h) ? (w / _w) : (h / _h);
                newImg.setAttribute('src', imageElement.getAttribute('src'));
                console.log(w, h, ratio);
                newImg.height = (h / ratio);
                newImg.width = (w / ratio);
                _context.clearRect(0, 0, _w, _h);
                _context.drawImage(newImg, 0, 0, _w, _h);
                fvi.setIcon(_canvas);
            } catch(e) {
                throw e;
                console.error('Error setting image...', e);
            }
        };
        if (_ready) {
            _readyCb();
        }
    };
    /**
     * Set video as icon
     */
    var video = function(videoElement) {
        _readyCb = function() {
            try {
                if (videoElement === 'stop') {
                    _stop = true;
                    icon.reset();
                    _stop = false;
                    return;
                }
                var w = videoElement.width;
                var h = videoElement.height;
                var ratio = (w / _w < h / _h) ? (w / _w) : (h / _h);

                videoElement.addEventListener('play', function() {
                    drawVideo(this);
                }, false);

            } catch(e) {
                throw e;
                console.error('Error setting image...', e);
            }
        };
        if (_ready) {
            _readyCb();
        }
    };
    /**
     * Set video as icon
     */
    var webcam = function(action) {
        if (!(/chrome/i.test(navigator.userAgent.toLowerCase()))) {
            console.log('Sorry. Only chrome is supported yet...');
            return;
        }
        var newVideo = false;
        navigator.getUserMedia = navigator.getUserMedia || navigator.oGetUserMedia || navigator.msGetUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
        _readyCb = function() {
            try {
                if (action === 'stop') {
                    _stop = true;
                    icon.reset();
                    _stop = false;
                    return;
                }
                newVideo = document.createElement('video');
                newVideo.width = _w;
                newVideo.height = _h;

                //get stream (TODO: open .mp4 video?)
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
                throw e;
                console.error('Error setting image...', e);
            }
        };
        if (_ready) {
            _readyCb();
        }
    };

    /**
     * Draw video to context and repeat :)
     */
    function drawVideo(video) {
        if (video.paused || video.ended || _stop) {
            return false;
        }
        _context.clearRect(0, 0, _w, _h);
        _context.drawImage(video, 0, 0, _w, _h);
        setTimeout(drawVideo, animation.duration, video);
        fvi.setIcon(_canvas);
    }

    //dom manipulation
    var fvi = {};
    /**
     * Get icon element
     * @return DOMElement
     */
    fvi.setIcon = function(can) {
        var url = can.toDataURL('image/png');
        if (_opt.elementId) {
            document.getElementById(_opt.elementId).setAttribute('src', url);
        } else {
            if (_stupidBrowser) {
                fvi.remove(_orig);
                _orig = fvi.create();
            }
            _orig.setAttribute('href', url);
        }
    };
    /**
     * Get econ element
     * @return DOMElement
     */
    fvi.getIcon = function() {
        var elm = null;
        if (_opt.elementId) {
            elm = document.getElementById(_opt.elementId);
            elm.setAttribute('href', elm.getAttribute('src'));
        } else {
            elm = fvi.get();
            if (elm == null) {
                fvi.create();
                elm = fvi.get();
            }
        }
        return elm;
    };

    fvi.create = function() {
        var newElm;
        newElm = document.createElement('link');
        newElm.setAttribute('rel', 'icon');
        newElm.setAttribute('href', 'data:,');
        document.getElementsByTagName('head')[0].appendChild(newElm);
        return newElm;
    };
    fvi.remove = function(elm) {
        elm.parentNode.removeChild(elm);
    };
    fvi.get = function() {
        //find element
        var elm = null;
        var link = document.getElementsByTagName('head')[0].getElementsByTagName('link');
        var l = link.length;
        for (var i = (l - 1); i >= 0; i--) {
            if ((/icon/i).test(link[i].getAttribute('rel'))) {
                elm = link[i];
            }
        }
        return elm;
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
    };
    /**
     * Merge options
     */
    function merge(def, opt) {
        var mergedOpt = {};
        for (var attrname in def) {
            mergedOpt[attrname] = def[attrname];
        }
        for (var attrname in opt) {
            mergedOpt[attrname] = opt[attrname];
        }
        return mergedOpt;
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
        x : 0.4,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 0.0
    }, {
        x : 0.4,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 0.1
    }, {
        x : 0.4,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 0.2
    }, {
        x : 0.4,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 0.3
    }, {
        x : 0.4,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 0.4
    }, {
        x : 0.4,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 0.5
    }, {
        x : 0.4,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 0.6
    }, {
        x : 0.4,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 0.7
    }, {
        x : 0.4,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 0.8
    }, {
        x : 0.4,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 0.9
    }, {
        x : 0.4,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 1.0
    }];
    animation.types.none = [{
        x : 0.4,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 1
    }];
    animation.types.pop = [{
        x : 1,
        y : 1,
        w : 0,
        h : 0,
        o : 1
    }, {
        x : 0.9,
        y : 0.9,
        w : 0.1,
        h : 0.1,
        o : 1
    }, {
        x : 0.8,
        y : 0.8,
        w : 0.2,
        h : 0.2,
        o : 1
    }, {
        x : 0.7,
        y : 0.7,
        w : 0.3,
        h : 0.3,
        o : 1
    }, {
        x : 0.6,
        y : 0.6,
        w : 0.4,
        h : 0.4,
        o : 1
    }, {
        x : 0.5,
        y : 0.5,
        w : 0.5,
        h : 0.5,
        o : 1
    }, {
        x : 0.4,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 1
    }];
    animation.types.slide = [{
        x : 0.4,
        y : 1,
        w : 0.6,
        h : 0.6,
        o : 1
    }, {
        x : 0.4,
        y : 0.9,
        w : 0.6,
        h : 0.6,
        o : 1
    }, {
        x : 0.4,
        y : 0.9,
        w : 0.6,
        h : 0.6,
        o : 1
    }, {
        x : 0.4,
        y : 0.8,
        w : 0.6,
        h : 0.6,
        o : 1
    }, {
        x : 0.4,
        y : 0.7,
        w : 0.6,
        h : 0.6,
        o : 1
    }, {
        x : 0.4,
        y : 0.6,
        w : 0.6,
        h : 0.6,
        o : 1
    }, {
        x : 0.4,
        y : 0.5,
        w : 0.6,
        h : 0.6,
        o : 1
    }, {
        x : 0.4,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 1
    }];
    /**
     * Run animation
     * @param {Object} opt Animation options
     * @param {Object} cb Callabak after all steps are done
     * @param {Object} revert Reverse order? true|false
     * @param {Object} step Optional step number (frame bumber)
     */
    animation.run = function(opt, cb, revert, step) {
        //revert = true;
        var animationType = animation.types[_opt.animation];
        //revert = (revert) ? true : false;
        if (revert === true) {
            step = ( typeof step !== 'undefined') ? step : animationType.length - 1;
        } else {
            step = ( typeof step !== 'undefined') ? step : 0;
        }
        cb = (cb) ? cb : function() {
        };
        if ((step < animationType.length) && (step >= 0)) {
            //console.log(_opt.animation, opt, animationType[step], merge(opt, animationType[step]));
            type[_opt.type](merge(opt, animationType[step]));
            fvi.setIcon(_canvas);
            setTimeout(function() {
                if (revert) {
                    step = step - 1;
                } else {
                    step = step + 1;
                }
                animation.run(opt, cb, revert, step);
            }, animation.duration);
        } else {
            cb();
            return;
        }
    };

    //auto init
    init();
    return {
        badge : badge,
        video : video,
        image : image,
        webcam : webcam,
        reset: icon.reset
    };
});
