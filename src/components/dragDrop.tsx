'use client'

import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { Progress } from './ui/progress'

export function DragDrop() {

  const [files, setFiles] = useState<File[]>([])


  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop, 
    accept: {
      'video/*': ['.mp4'],
    },
    maxFiles: 4,
    onDropRejected(fileRejections, event) {
      console.log(fileRejections, event)
    },
  })

  return (
    <div className='flex gap-2'>
      <div {...getRootProps({ className: 'dropzone' })} className={`border-dashed flex-1 min-w-[500px] border-2 p-16 ${isDragActive ? 'border-blue-600' : 'border-gray-300'}`}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p className='text-center'>Drop the files here ...</p> :
            <p className='text-center'>Arraste e solte os arquivos aqui, ou clique para selecionar o vídeo.</p>
        }
      </div>
      <div className='flex-1'>
        <ul>
          {files.map(file => (
            <li key={file.name} className='p-2 bg-gray-100 rounded flex items-center justify-between'>{file.name} <Progress value={50} className='w-52 h-2 bg-gray-300' /></li>
          ))}
        </ul>
      </div>
    </div>
  )
}