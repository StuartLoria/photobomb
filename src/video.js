const constraints = {
	audio: false,
	video: {
		mandatory: {
			minWidth: 853,
			minHeight: 480,
			maxWidth: 853,
			maxHeight: 480
		}
	}
};

//Connect the <video/> DOM element to the camera stream, 'autoplay' makes it live
function connectCameraToVideoEl(videoEl, stream) {
	//// Older browsers may not have srcObject
  if ("srcObject" in videoEl) {
		videoEl.srcObject = stream;

		//console.info('srcObject', videoEl.srcObject);
  } else {
    //// Avoid using this in new browsers, as it is going away.
		videoEl.src = window.URL.createObjectURL(stream);
		
		//console.info('videoEl.src', videoEl.src);
  }
}

function handleCameraConnectionError(error) {
	console.log('Camera error', error);
}

exports.connect = (nav, videoEl) => {
	//Get a reference to the OS way to capture any Media
	nav.getUserMedia = nav.webkitGetUserMedia;

	//// New version of getUserMedia, promises instead of callbacks
	// nav.mediaDevices.getUserMedia(constraints)
	// 	.then(stream => {
	// 		handleSuccess(videoEl, stream)
	// 	})
	// 	.catch(err => {
	// 		handleError(err);
	// 	});

	nav.getUserMedia(constraints, stream => connectCameraToVideoEl(videoEl, stream), handleCameraConnectionError);
};

 exports.captureBytes = (videoEl, canvasCtx, canvasEl) => {
	let imageData = null;

	canvasCtx.drawImage(videoEl, 0, 0);
	imageData = canvasEl.toDataURL('image/png');
	
	return imageData;
};

exports.captureBytesFromLiveCanvas = canvasEl => {
	return canvasEl.toDataURL('image/png');
};