// Seriously JS 
// https://github.com/brianchirls/Seriously.js/

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const electron = require('electron');
const { app, BrowserWindow, ipcMain: ipc, Menu } = electron;
const images = require('./images');
const menuTemplate = require('./menu');

let mainWindow = null;
let picturesDir = null;

app.on('ready', _ => {
	mainWindow = new BrowserWindow({
		//width: 1490,
		width: 895,
		height: 725,
		resizable: false,
		webPreferences: {
			nodeIntegration: true
		}
	});
	mainWindow.loadURL(`file://${__dirname}/capture.html`);
	//mainWindow.openDevTools();
	mainWindow.on('close', _ => {
		mainWindow = null;
		picturesDir = null;
		console.clear();
	});
	mainWindow.on('window-all-closed', () => {
		const platform = process.platform 
	});

	console.clear();

	picturesDir = images.getPicturesDir(app);

	images.mkDir(picturesDir);

	const menuContents = Menu.buildFromTemplate(menuTemplate(mainWindow));
	Menu.setApplicationMenu(menuContents);
});

ipc.on('image-captured', (evt, imgBytes) => {
	let effectName = 'vanilla';

	images.save(picturesDir, imgBytes, effectName, 
		(err, imgPath) => {
			//Change the state of the images instance inside the main process
			images.cache(imgPath);
		}
	);
});

ipc.on('image-remove', (evt, index) => {
	images.rm(index, _ => {
		evt.sender.send('image-removed', index);
	});
});