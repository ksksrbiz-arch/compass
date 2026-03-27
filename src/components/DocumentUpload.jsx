import { useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { UploadIcon, ArrowDownIcon } from './Icons.jsx'

export default function DocumentUpload({ onDocumentLoaded }) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleFile = useCallback(async (file) => {
    if (!file) return

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are supported.')
      return
    }

    if (file.size > 20 * 1024 * 1024) {
      setError('File must be under 20MB.')
      return
    }

    setError(null)
    setIsProcessing(true)

    try {
      const buffer = await file.arrayBuffer()
      const base64 = btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      )

      onDocumentLoaded({
        name: file.name,
        size: file.size,
        base64,
        mediaType: 'application/pdf',
      })
    } catch (err) {
      setError('Failed to read file. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }, [onDocumentLoaded])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }, [handleFile])

  const handleClick = () => fileInputRef.current?.click()

  const handleInputChange = (e) => {
    const file = e.target.files[0]
    handleFile(file)
    e.target.value = ''
  }

  return (
    <div
      className={`upload-zone ${isDragging ? 'dragging' : ''} ${isProcessing ? 'processing' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick() } }}
      role="button"
      tabIndex={0}
      aria-label="Upload a PDF document for analysis"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />

      {isProcessing ? (
        <div className="upload-content">
          <div className="upload-spinner" />
          <p className="upload-text">Reading document...</p>
        </div>
      ) : (
        <div className="upload-content">
          <div className="upload-icon">{isDragging ? <ArrowDownIcon /> : <UploadIcon />}</div>
          <p className="upload-text">
            {isDragging ? 'Drop PDF here' : 'Drop a contract PDF or click to upload'}
          </p>
          <p className="upload-hint">PDF up to 20MB — analyzed by Claude</p>
        </div>
      )}

      {error && <p className="upload-error">{error}</p>}
    </div>
  )
}

DocumentUpload.propTypes = {
  onDocumentLoaded: PropTypes.func.isRequired,
}
