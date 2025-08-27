import { MP4AtomReader } from '../mp4.js'
const stream = await navigator.mediaDevices.getDisplayMedia({video : true, audio : true})
const mime = 'video/mp4; codecs="avc3.42E01E, mp4a.40.2"'

if(!MediaRecorder.isTypeSupported(mime)){
  console.warn(`${mime} is not supported, using default codec instead`)
}

const recorder = new MediaRecorder(stream, { mimeType: mime })
recorder.start(1000)

let init = false

recorder.addEventListener('start', ()=>console.log('recording started'))
recorder.addEventListener('stop', ()=>console.log('recording stopped'))
recorder.addEventListener('dataavailable', async e=>{
  const arrayBuffer = await e.data.arrayBuffer()
  const data = MP4AtomReader(arrayBuffer)

  if(!init){
    console.log(data.filter(e=>e.name === 'stsd'))
    
  }


  console.log(data)
})

function createFLVHeader(hasAudio = true, hasVideo = true) {
    const header = new Uint8Array(13);
    header.set([0x46, 0x4C, 0x56], 0); // "FLV"
    header[3] = 0x01; // version
    header[4] = (hasAudio ? 0x04 : 0) | (hasVideo ? 0x01 : 0); // flags: audio=4, video=1
    new DataView(header.buffer).setUint32(5, 9, false); // DataOffset = 9
    // PreviousTagSize0 = 0
    header.set([0,0,0,0], 9);
    return header;
}
