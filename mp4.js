const CONTAINER = 1 << 0
const HAS_ENTRIES = 1 << 1
const ATOM_DETAILS = {
  'moov' : CONTAINER,
  'trak' : CONTAINER,
  'mdia' : CONTAINER,
  'minf' : CONTAINER,
  'dinf' : CONTAINER,
  'dref' : CONTAINER | HAS_ENTRIES,
  'stsd' : CONTAINER | HAS_ENTRIES,
  'mvex' : CONTAINER
}

/**
 * 
 * @param {*} data 
 */
export function MP4Reader(data){
  const view = new DataView(data)
  const atoms = []
  let offset = 0

  while(offset < view.byteLength){
    const size = view.getUint32(offset)
    const name = String.fromCharCode(
      view.getUint8(offset+4),
      view.getUint8(offset+5),
      view.getUint8(offset+6),
      view.getUint8(offset+7)
    )
    const atom = {
      size,
      name,
      start : offset,
      end : offset + size
    }

    if(ATOM_DETAILS[name] & HAS_ENTRIES){
      
    }
    else if(ATOM_DETAILS[name] & CONTAINER){

    }
    else{

    }
  }
}

// const containers = [
//   'moov',
//   'trak',
//   'mdia',
//   'minf',
//   'dinf',
//   'stbl',
//   'mvex',
//   'moof',
//   'stsd'
// ]

// /**
//  * 
//  * @param {ArrayBuffer} data 
//  * @returns 
//  */
// export function MP4AtomReader(data){
//   const view = new DataView(data)
//   let index = 0
//   const atoms = []
//   const stacks = []
//   const roots = []

//   while(index < view.byteLength){
//     const size = view.getUint32(index)
//     const name = String.fromCharCode(
//       view.getUint8(index+4),
//       view.getUint8(index+5),
//       view.getUint8(index+6),
//       view.getUint8(index+7)
//     )
    
//     const is_container = containers.includes(name)
//     const result = {
//       name,
//       size,
//       is_container,
//       start : index,
//       children : [],
//       end : index + size
//     }

//     atoms.push(result)

//     if(!is_container){
//       result.data = data.slice(index + 8, index + size)
//       index+=size
//     }
//     else{
//       index+= 8
//     }

//     if(stacks.length === 0){
//       roots.push(result)
//     }
//     else{
//       stacks[stacks.length - 1].children.push(result)
//     }

//     if(is_container){
//       stacks.push(result)
//     }

//     while(stacks.length && index >= stacks[stacks.length - 1].end){
//       stacks.pop()
//     }
//   }

//   // return roots
//   return atoms
// }
