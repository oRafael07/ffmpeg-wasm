import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

export const ffmpeg = new FFmpeg()

export async function convertVideoToMP3(inputFile: File, quality: 'normal' | 'high' | 'very_high', onProgress: (progress: number) => void): Promise<Blob> {
  if(!ffmpeg.loaded) {
    await ffmpeg.load({
      coreURL: await toBlobURL(`./ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`./ffmpeg-core.wasm`, 'application/wasm')
    })
  }

  const qualityComponents = {
    'normal': '96k',
    'high': '160k',
    'very_high': '320'
  }

  await ffmpeg.writeFile(inputFile.name, await fetchFile(inputFile))
  ffmpeg.on('progress', ({ progress }) => {
    const progressVideo = Math.round(progress * 100)

    onProgress(progressVideo)
  })
  await ffmpeg.exec(['-i',
    inputFile.name,
    '-map',
    '0:a',
    '-b:a',
    qualityComponents[quality],
    '-acodec',
    'libmp3lame',
    `output.mp3`,
  ])

  const data = (await ffmpeg.readFile('output.mp3')) as any

  const audioFileBlob = new Blob([data.buffer], { type: 'audio/mpeg' })
  // const audioFile = new File([audioFileBlob], `${inputFile.name}.mp3`, {
  //   type: 'audio/mpeg',
  // })

  return audioFileBlob
}
