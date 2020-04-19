const electron = require('electron');
const { app } = electron;
const images = require('./images');

function enableCycleEffect(items) {
	//there are 2 items above the effects that are not effects
	const firstEffectIndex = 2;
	const selectedIndex = items.findIndex(item => item.checked);

	if(selectedIndex && selectedIndex > -1) {
		const atTheEndOfList = selectedIndex + 1 === items.length; 
		const nextItemIndex = atTheEndOfList ? firstEffectIndex : selectedIndex + 1;
		items[nextItemIndex].checked = true;
	}
}

module.exports = mainWindow => {
	const appName = app.getName();
	const template = [
		{
			label: 'Effects',
			submenu: [
				{
					label: 'Cycle',
					accelerator: 'Shift+CommandOrCtrl+E',
					click: menuItem => {
						enableCycleEffect(menuItem.menu.items);
						mainWindow.webContents.send('effect-cycle');
					}
				},
				{ type: 'separator' },
				{
					label: 'Vanilla',
					type: 'radio',
					click: _ => { mainWindow.webContents.send('effect-choose'); }
				},
				{
					label: 'Ascii',
					type: 'radio',
					click: _ => { mainWindow.webContents.send('effect-choose', 'ascii'); }
				},
				{
					label: 'Daltonize',
					type: 'radio',
					click: _ => { mainWindow.webContents.send('effect-choose', 'daltonize') }
				},
				{
					label: 'Hex',
					type: 'radio',
					click: _ => { mainWindow.webContents.send('effect-choose', 'hex') }
				}
			]
		},
		{
			label: 'View',
			submenu: [
				{
					label: 'Photos Directory',
					click: _ => {
						images.openDir(images.getPicturesDir(app));
					}
				}
			]
		}
	];

	if(process.platform === 'darwin') {
		//Prepend the MacOS Menu
		template.unshift(
			{
				label: appName,
				submenu: [
					{
						label: `About ${appName}`,
						role: 'about'
					},
					{ type: 'separator' },
					{
						label: `Hide ${appName}`,
						accelerator: 'Command+H',
						role: 'hide'
					},
					{
						label: 'Hide Others',
						accelerator: 'Command+Shift+H',
						role: 'hideothers'
					},
					{
						label: 'Show All',
						role: 'unhide'
					},
					{ type: 'separator' },
					{
						label: 'Quit',
						accelerator: 'Command+Q',
						click: _ => { app.quit(); }
					}
				]
			}
		);
	}

	return template;
};