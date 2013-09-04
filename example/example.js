$(document).ready(function() {
    //    return;
    window.favicon = new Favico();
    window.faviconMirror = new Favico({
        elementId : 'badgeMirror',
    });
    window.faviconSlide = new Favico({
        animation : 'slide',
        elementId : 'badgeSlide'
    });
    window.faviconFade = new Favico({
        animation : 'fade',
        elementId : 'badgeFade'
    });
    window.faviconPop = new Favico({
        animation : 'pop',
        elementId : 'badgePop'
    });
    window.faviconColor = new Favico({
        bgColor : '#5CB85C',
        textColor : '#ff0',
        elementId : 'badgeColor'
    });
    window.faviconShape = new Favico({
        type : 'rectangle',
        animation : 'slide',
        elementId : 'badgeShape'
    });
    window.faviconImage = new Favico({
        type : 'rectangle',
        elementId : 'badgeImage'
    });
    window.plus1 = function(val) {
        if ( typeof window['' + val] === 'undefined') {
            window['' + val] = 1;
        } else {
            window['' + val] = window['' + val] + 1;
        }
        return window[val];
    };
    window.minus1 = function(val) {
        console.log(window[val]);
        if ( typeof window[val] === 'undefined') {
            window[val] = 1;
        } else {
            window[val]--;
        }
        if (window[val] < 1) {
            window[val] = 0;
        }
        return window[val];
    };
    window.reset = function(val) {
        window[val] = 0;
        return window[val];
    };

    $('.favBadge').click(function(e) {
        //badges
        var favBadge = $(e.target).attr('favicon-action').split('|');
        for (var i = 0; i < favBadge.length; i = i + 2) {
            var value = window[''+favBadge[i+1]]('val_' + favBadge[i]);
            window['' + favBadge[i]].badge(value);
        }
    });
    $('.favImage').click(function(e) {
        //images
        var favBadge = $(e.target).attr('favicon-action');
        var image = document.getElementById(favBadge);
        window.favicon.image(image);
    });
    $('.favVideo').click(function(e) {
        //images
        var favBadge = $(e.target).attr('favicon-action');
        var video = document.getElementById(favBadge);
        if (!video.paused && !video.ended) {
            video.pause();
            video.currentTime = 0;
            window.favicon.video('stop');
        } else {
            window.favicon.video(video);
            video.play();
        }
    });
    var isWebcam = false;
    $('.favWebcam').click(function(e) {
        //images
        if (isWebcam) {
            window.favicon.webcam('stop');
            //only way to stop webcam :(
            location.reload();
        } else {
            window.favicon.webcam();
        }
        isWebcam = !isWebcam;
    });

    setTimeout(function() {
        window.val_favicon = 1;
        window.favicon.badge(window.val_favicon);
        window.val_faviconMirror = 1;
        window.faviconMirror.badge(window.val_faviconMirror);
    }, 200);
    setTimeout(function() {
        window.val_favicon = 3;
        window.favicon.badge(window.val_favicon);
        window.val_faviconMirror = 3;
        window.faviconMirror.badge(window.val_faviconMirror);
    }, 1000);    
    setTimeout(function() {
        window.val_faviconSlide = 1;
        window.faviconSlide.badge(window.val_faviconSlide);
        window.val_faviconFade = 2;
        window.faviconFade.badge(window.val_faviconFade);
        window.val_faviconPop = 3;
        window.faviconPop.badge(window.val_faviconPop);
        window.val_faviconColor = 4;
        window.faviconColor.badge(window.val_faviconColor);
        window.val_faviconShape = 5;
        window.faviconShape.badge(window.val_faviconShape);
        window.val_faviconImage = 6;
        window.faviconImage.badge(window.val_faviconImage);
    }, 1500);
});
