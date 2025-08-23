function processPCM(file_buffer, sample, channel){
	const view = new DataView(file_buffer)
	const float32 = new Float32Array(view.byteLength / 2)

	for(let i = 0; i < float32.byteLength; i++){
		console.log(i)
	}

	return float32
}

self.onmessage = function(e){
	const { data } = e

	switch(data.fn){
		case 'processPCM' : 
			const result = processPCM(data.file_buffer, data.sample, data.channel)

			self.postMessage({fn : data.fn, result}, [result.buffer])
		break
	}
}
