const path = require('path');
const fs = require('fs');
const shell = require('electron').shell;
const spawn = require('child_process').spawn;

//Array of image PATHS
let images = [];

const logErr = err => {
	return err && console.error(err);
};

exports.save = (saveDirectory, imgBytes, effectName = 'Vanilla', doneCB) => {
	if(saveDirectory && imgBytes) {
		//The contents from the canvas is Base64 text
		//Remove the Base64 header "data:image/png;base64,"
		const base64HeaderRegExp = /^data:image\/png;base64,/;
		const base64Data = imgBytes.replace(base64HeaderRegExp, '');

		let filePathName = path.join(saveDirectory, `${effectName}-${new Date()}.png`);

		fs.writeFile(filePathName, base64Data, { encoding: 'base64' },
			err => {
				if(err) {
					return logErr(err);
				}
				else {
					doneCB(null, filePathName);
				}
			}
		);
	}
	else {
		logErr('Error saving the image, one of the parameters was invalid');
	}
};

exports.getPicturesDir = app => {
	//OS Pictures directory
	let picturesDir = app.getPath('pictures');

	//Inside Picture we will reference the 'photoBomb' folder
	return path.join(picturesDir, 'photoBomb');
};

exports.mkDir = picturesPath => {
	fs.stat(picturesPath, (err, stats) => {
		const errOtherThanDoesNotExist = err && err.code !== 'ENOENT';

		if(errOtherThanDoesNotExist) {
			console.error('errOtherThanDoesNotExist');
			return logErr(err);
		}
		else {
			const pathDoesNotExist = err || !stats.isDirectory();

			if(pathDoesNotExist) {
				console.error('pathDoesNotExist');
				fs.mkdir(picturesPath, logErr);
			}
		}
	});
};

exports.cache = newImgPath => {
	//Add a new Img Path at the end of the existing images cache array
	images = images.concat([newImgPath]);

	return images;
};

exports.getFromCache = index => {
	return images[index];
};

exports.rm = (index, doneCB) => {
	const filePathToRemove = images[index];

	fs.unlink(filePathToRemove, err => {
		if(err) {
			logErr(err);
		}
		else {
			images.splice(index, 1);	//Remove one element at index
		}

		doneCB();
	});
};

const openCmds = {
	darwin: 'open',
	win32: 'explorer',
	linux: 'nautilus'
};

exports.openDir = dirPath => {
	const cmd = openCmds[process.platform];

	if(cmd) {
		spawn(cmd, [ dirPath ] );
	}
	else {
		shell.showItemInFolder(dirPath);
	}
};