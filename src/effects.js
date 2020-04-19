function connectEffect(seriouslyInstance, src, target, effect) {
	if(effect) {
		//Pass the source (a.k.a. video stream to the canvas) through the effect
		effect.source = src;
	}
	else {
		//Pass the source (a.k.a. video stream to the canvas) as is
		effect = src;
	}
	
	//Pass the transformed video source to the canvas
	target.source = effect;
	
	//Tell seriously the transformation is ready
	seriouslyInstance.go();
}

const effects = {
	vanilla: (seriouslyInstance, src, target) => {
		connectEffect(seriouslyInstance, src, target);
	},
	ascii: (seriouslyInstance, src, target) => {
		const effect = seriouslyInstance.effect('ascii');
		connectEffect(seriouslyInstance, src, target, effect);
	},
	daltonize: (seriouslyInstance, src, target) => {
		const effect = seriouslyInstance.effect('daltonize');
		effect.type = '0.8';
		connectEffect(seriouslyInstance, src, target, effect);
	},
	hex: (seriouslyInstance, src, target) => {
		const effect = seriouslyInstance.effect('hex');
		effect.size = 0.015;
		connectEffect(seriouslyInstance, src, target, effect);
	}
};

//Get an array representation Properties of the Effects object
const effectNames = Object.keys(effects);
let currentIndex = 0;

function setNextIndex() {
	currentIndex = (currentIndex + 1) % effectNames.length;
}

function setIndexToChosenEffect(effectName) {
	currentIndex = effectNames.indexOf(effectName);
	return currentIndex;
}

exports.choose = (seriouslyInstance, src, target, effectName = 'vanilla') => {
	effects[effectName](seriouslyInstance, src, target);
	setIndexToChosenEffect(effectName);
};

exports.cycle = (seriouslyInstance, src, target) => {
	setNextIndex();
	const nextEffectName = effectNames[currentIndex];
	effects[nextEffectName](seriouslyInstance, src, target);
};