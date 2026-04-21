'use client'

import { FileText, Image as ImageIcon, X } from 'lucide-react'

interface FileAttachmentProps {
  fileName: string
  fileUrl: string
  fileMime: string
  onRemove: () => void
}

export function FileAttachment({ fileName, fileUrl, fileMime, onRemove }: FileAttachmentProps) {
  const isImage = fileMime.startsWith('image/')

  return (
    <div className="samo-file-preview">
      <div className="samo-file-preview-content">
        {isImage ? (
          <img src={fileUrl} alt={fileName} className="samo-file-preview-image" />
        ) : (
          <div className="samo-file-preview-icon">
            <FileText size={20} />
          </div>
        )}
        <div className="samo-file-preview-info">
          <span className="samo-file-preview-name">{fileName}</span>
          <span className="samo-file-preview-type">
            {isImage ? 'Immagine' : 'PDF'}
          </span>
        </div>
      </div>
      <button className="samo-file-preview-remove" onClick={onRemove}>
        <X size={14} />
      </button>
    </div>
  )
}
