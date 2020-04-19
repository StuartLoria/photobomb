const electron = require('electron');
const { ipcRenderer: ipc, shell, remote } = electron;

const video = require('./video');
const countdown = require('./countdown');
const images = remote.require('./images');	//Get the 'images' module instance from the main process
const flash = require('./flash');
const effects = require('./effects');

const COUNTDOWN_FROM = 3;

let canvasTarget;
let seriously;
let videoSrc;

function formatImgTag(doc, bytes) {
	const div = doc.createElement('div');
	div.classList.add('photo');

	const img = new Image();
	img.src = bytes;
	img.classList.add('photoImg');
	div.appendChild(img);

	const close = doc.createElement('div');
	close.classList.add('photoClose');
	div.appendChild(close);

	return div;
}

//function CapturePhoto(videoEl, ctx, canvasEl, photosEl, flashEl) {
function CapturePhoto(canvasEl, photosEl, flashEl) {
	flash(flashEl);

	// const bytes = video.captureBytes(videoEl, ctx, canvasEl);
	const bytes = video.captureBytesFromLiveCanvas(canvasEl);
		
	if(bytes) {
		ipc.send('image-captured', bytes);

		const photoDiv = formatImgTag(document, bytes);
		photosEl.appendChild(photoDiv);
	}
}

//Invoke this after loading the DOM from capture.html
window.addEventListener('DOMContentLoaded', _ => {
	const videoEl = document.getElementById('video');
	const canvasEl = document.getElementById('canvas');
	const recordEl = document.getElementById('record');
	const photosEl = document.querySelector('.photosContainer');
	const counterEl = document.getElementById('counter');
	//const canvasCtx = canvasEl.getContext('2d');	//Seriously will do this in a different way a WebGL way
	const flashEl = document.getElementById('flash');

	//Third party library used to apply effects to live video using Web GL Shaders
	seriously = new Seriously();
	//The source is where the video info comes from
	videoSrc = seriously.source('#video');
	//The output is the canvas
	canvasTarget = seriously.target('#canvas');

	effects.choose(seriously, videoSrc, canvasTarget, 'vanilla');

	video.connect(navigator, videoEl);

	//Event invoked to save image from camera to disk
	recordEl.addEventListener('click', _ => {
		countdown.startCountdown(counterEl, COUNTDOWN_FROM, _ => {
			//CapturePhoto(videoEl, canvasCtx, canvasEl, photosEl, flashEl);
			CapturePhoto(canvasEl, photosEl, flashEl);
		});
	});

	//Event invoked to open a selected image from the gallery
	photosEl.addEventListener('click', evt => {
		const isRemoveBtn = evt.target.classList.contains('photoClose');
		const elSelector = isRemoveBtn ? '.photoClose' : '.photoImg';

		const photosDomCollection = document.querySelectorAll(elSelector);
		const photosArray = Array.from(photosDomCollection);
		const index = photosArray.findIndex(el => el == evt.target);

		const elWasFound = index > -1;
		if(elWasFound) {
			if(isRemoveBtn) {
				ipc.send('image-remove', index);
			}
			else {
				//Jump to the folder represented in the path with the Electron module shell
				shell.showItemInFolder(images.getFromCache(index));
			}
		}
	});
});

ipc.on('image-removed', (evt, index) => {
	let photosEl = document.getElementById('photos');

	if(photosEl) {
		const photosDomCollection = document.querySelectorAll('.photo');
		const photosArray = Array.from(photosDomCollection);

		if(photosArray && photosArray.length > 0) {
			photosEl.removeChild(photosArray[index]);
		}
	}
});

ipc.on('effect-choose', (evt, effectName) => {
	effects.choose(seriously, videoSrc, canvasTarget, effectName);
});

ipc.on('effect-cycle', evt => {
	effects.cycle(seriously, videoSrc, canvasTarget);
});