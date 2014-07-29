$(document).ready(function() {
	window.favicon = new Favico({
		animation : 'popFade'
	});
	window.faviconMirror = new Favico({
		animation : 'popFade',
		elementId : 'badgeMirror'
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
	window.faviconPopFade = new Favico({
		animation : 'popFade',
		elementId : 'badgePopFade'
	});
	window.faviconNone = new Favico({
		animation : 'none',
		elementId : 'badgeNone'
	});
	window.faviconPosition = new Favico({
		position : 'up',
		elementId : 'badgePosition'
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
	window.faviconColor = new Favico({
		bgColor : '#5CB85C',
		textColor : '#ff0',
		elementId : 'badgeColor'
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
		//console.log(window[val]);
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

	$('.favBadge').bind('click', function(e) {
		//badges
		var favBadge = $(e.target).attr('favicon-action').split('|');
		for (var i = 0; i < favBadge.length; i = i + 2) {
			var value = window[''+favBadge[i+1]]('val_' + favBadge[i]);
			window['' + favBadge[i]].badge(value);
		}
	});
	$('.favImage').bind('click', function(e) {
		//images
		var favBadge = $(e.target).attr('favicon-action');
		var image = document.getElementById(favBadge);
		window.favicon.image(image);
	});
	$('.favVideo').bind('click', function(e) {
		//images
		var favBadge = $(e.target).attr('favicon-action');
		var video = document.getElementById(favBadge);
		video.volume = 0.2;
		if (!video.paused && !video.ended) {
			video.pause();
			video.currentTime = 0;
			$(e.target).html('Play video');
			window.favicon.video('stop');
		} else {
			window.favicon.video(video);
			$(e.target).html('Stop video');
			video.play();
		}
	});
	var isWebcam = false;
	$('.favWebcam').bind('click', function(e) {
		//images
		//if ((/chrome/i.test(navigator.userAgent.toLowerCase())) || (/firefox/i.test(navigator.userAgent.toLowerCase()))) {
		if (true) {
			if (isWebcam) {
				window.favicon.webcam('stop');
				//only way to stop webcam :(
				$(e.target).html('Start webcam');
				location.reload();
			} else {
				window.favicon.webcam();
				$(e.target).html('Stop webcam');
			}
			isWebcam = !isWebcam;
		} else {
			alert('Webcam streaming only works on Chrome and Firefox :(');
			return;
		}

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
		window.val_faviconPopFade = 1;
		window.faviconPopFade.badge(window.val_faviconPopFade);
		window.val_faviconNone = 2;
		window.faviconNone.badge(window.val_faviconNone);
		window.val_faviconPosition = 3;
		window.faviconPosition.badge(window.val_faviconPosition);
		window.val_faviconShape = 1;
		window.faviconShape.badge(window.val_faviconShape);
		window.val_faviconImage = 2;
		window.faviconImage.badge(window.val_faviconImage);
		window.val_faviconColor = 3;
		window.faviconColor.badge(window.val_faviconColor);
	}, 1500);
});
