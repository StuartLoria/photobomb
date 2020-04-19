function setCountInDom(counterEl, countValue) {
	let newCounterValue = countValue > 0 ? countValue : '&nbsp;';
	
	counterEl.innerHTML = newCounterValue;
}

exports.startCountdown = (counterEl, downFrom, doneCB) => {
	for (let countDownIndex = 0; countDownIndex <= downFrom; countDownIndex++) {
		
		setTimeout(() => {	
			let count = downFrom - countDownIndex;
			setCountInDom(counterEl, count);

			let countDownDone = countDownIndex === downFrom;
			if(countDownDone) {
				doneCB();
			}

		}, 1000 * countDownIndex);
	}
};