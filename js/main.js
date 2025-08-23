const play = document.querySelector('.audio-play-btn')
const download = document.querySelector('.audio-download-btn')
const audio_ctx = new AudioContext()
const audio_thread = new Worker('js/audio-thread.js', {type : 'module'})
let data

// document.body.addEventListener('dragover', e=>e.preventDefault())

// document.body.addEventListener('drop', async e=>{
//     e.preventDefault()

//     // We only process one file at the time
//     const file = e.dataTransfer.files[0]

//     // Inform user only audio file is accepted
//     if(!file.name.endsWith('pcm') && file.type.startsWith('audio')){
//         alert('The file uploaded is not a valid audio file.')
//         return
//     }

//     if(file.name.endsWith('pcm')){
//         // User input for sample and channel
//         const sample = prompt('Please enter the sample rate of the PCM file:', 48000)
//         const channel = prompt('Please enter the number of channels:', 2)
//         const file_buffer = await file.arrayBuffer()

//         audio_thread.postMessage({
//             fn : 'processPCM',
//             sample,
//             channel, 
//             file_buffer
//         }, [file_buffer])
//     }
// })

// audio_thread.onmessage = e=>data = e.data.float32processeddata

// These comes from user inputs
const channel = 2
const sample = 48000
const pcm = await fetch('the-weeknd-blinding-lights.pcm').then(e=>e.arrayBuffer())
const float32 = new Float32Array(pcm.byteLength)
const view = new DataView(pcm)
const mid = pcm.byteLength / channel

for(let i = 0; i < float32.byteLength; i++){
    float32[i + (i % channel) * mid] = view.getInt16(i * 2) / 32768
}

console.log(float32)
// const aud_ctx = new AudioContext()

// // PCM are represented as 16-bit signed.
// const int16 = new Int16Array(pcm);
// const totalSamples = int16.length / 2;

// const channelData = [];
// for (let ch = 0; ch < 2; ch++) {
//     channelData[ch] = new Float32Array(totalSamples);
// }

// for (let i = 0; i < totalSamples; i++) {
//     for (let ch = 0; ch < 2; ch++) {
//         const sample = int16[i * 2 + ch];
//         channelData[ch][i] = sample / 32768; // normalize to -1.0 → 1.0
//     }
// }

// // 3. Create an AudioBuffer and copy channel data
// const audioBuffer = aud_ctx.createBuffer(2, totalSamples, 48000);

// for (let ch = 0; ch < 2; ch++) {
//     audioBuffer.copyToChannel(channelData[ch], ch);
// }

// // 4. Play the buffer
// const source = aud_ctx.createBufferSource();
// source.buffer = audioBuffer;
// source.connect(aud_ctx.destination);

// // --- Draw waveform on canvas ---
// const canvas = document.getElementById('waveform-canvas');
// if (canvas) {
//     const ctx = canvas.getContext('2d');
//     const width = canvas.width;
//     const height = canvas.height;
//     ctx.clearRect(0, 0, width, height);

//     // Create horizontal gradient for waveform
//     const grad = ctx.createLinearGradient(0, 0, width, 0);
//     grad.addColorStop(0, '#ff8c42');
//     grad.addColorStop(1, '#ff3c6f');
//     ctx.strokeStyle = grad;
//     ctx.lineWidth = 2.5;

//     // Use left channel for waveform
//     const samples = channelData[0];
//     const step = Math.floor(samples.length / width);
//     ctx.beginPath();
//     for (let x = 0; x < width; x++) {
//         let min = 1, max = -1;
//         for (let j = 0; j < step; j++) {
//             const sample = samples[x * step + j];
//             if (sample < min) min = sample;
//             if (sample > max) max = sample;
//         }
//         const y1 = height / 2 - min * (height / 2) * 0.85;
//         const y2 = height / 2 - max * (height / 2) * 0.85;
//         ctx.moveTo(x, y1);
//         ctx.lineTo(x, y2);
//     }
//     ctx.stroke();
// }