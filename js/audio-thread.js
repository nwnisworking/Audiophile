function processPCM(file_buffer, sample, channel){
	// Total number of 16-bit samples in the buffer
	const total_samples = file_buffer.byteLength / 2
	// Number of frames (each frame contains one sample per channel)
	const frames = total_samples / channel
	// Convert file array buffer into Int16Array
	const data = new Int16Array(file_buffer)
	// Stores each sample as float integer
	const result = new Float32Array(total_samples)

	for(let i = 0; i < total_samples; i++){
		const ch = i % channel // Current channel 
		const frame = Math.floor(i / channel) // Frame index (sample position in channel)
		
		result[frame + ch * frames] = data[i] / 32768
	}

	return {frames, result}
}

// function saveAsPCM(buffer, sample, channel){
// 	const result = new Uint16Array(buffer.byteLength / 4 * 2)
// 	buffer = new Float32Array(buffer)

// }

self.onmessage = function(e){
	const { data } = e

	switch(data.fn){
		case 'processPCM' : 
			const {frames, result} = processPCM(data.file_buffer, data.sample, data.channel)
			self.postMessage({fn : data.fn, result, frames}, [result.buffer])
		break
		case 'savePCM' : 
			const pcm_buffer = saveAsPCM(data.buffer, data.sample, data.channel)
			self.postMessage({fn : data.fn, pcm_buffer}, [pcm_buffer])
		break
	}
}
