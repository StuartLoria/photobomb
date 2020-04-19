let timer;

module.exports = el => {
	const isAlreadyFlashing = el.classList.contains('is-flashing');
	
	if(isAlreadyFlashing) {
		el.classList.remove('is-flashing');
	}

	clearTimeout(timer);
	el.classList.add('is-flashing');
	timer = setTimeout(_ => el.classList.remove('is-flashing'), 2000);
};