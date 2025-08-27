async function loadAudioFile(file) {
    const arrayBuffer = await file.arrayBuffer();

    const audioCtx = new AudioContext();
    return new Promise((resolve, reject) => {
        audioCtx.decodeAudioData(arrayBuffer, resolve, reject);
    });
}

function bufferToMediaStream(audioBuffer) {
    const audioCtx = new AudioContext({ sampleRate: audioBuffer.sampleRate });
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;

    const destination = audioCtx.createMediaStreamDestination();
    source.connect(destination);
    source.start();

    return { destination, audioCtx };
}

async function recordBufferAsAAC(audioBuffer) {
    const { destination, audioCtx } = bufferToMediaStream(audioBuffer);

    const mimeType = 'audio/mp4'; // AAC container
    if (!MediaRecorder.isTypeSupported(mimeType)) {
        throw new Error(`${mimeType} not supported in this browser`);
    }

    const recorder = new MediaRecorder(destination.stream, { mimeType });
    const chunks = [];

    recorder.ondataavailable = e => chunks.push(e.data);

    recorder.start();

    // Stop recording after buffer duration
    await new Promise(resolve =>
        setTimeout(() => {
            recorder.stop();
            resolve();
        }, (audioBuffer.duration + 0.1) * 1000)
    );

    return new Promise(resolve => {
        recorder.onstop = () => {
            const aacBlob = new Blob(chunks, { type: mimeType });
            resolve(aacBlob);
        };
    });
}

const file = await fetch('MHWild-Song of Beginning.mp3')
const audioBuffer = await loadAudioFile(file);
const aacBlob = await recordBufferAsAAC(audioBuffer);

const url = URL.createObjectURL(aacBlob);
const a = document.createElement('a');
a.href = url;
a.download = 'output.aac'; // technically AAC in MP4 container
a.click();