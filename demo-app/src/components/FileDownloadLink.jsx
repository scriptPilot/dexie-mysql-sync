function FileDownloadLink({ file, children }) {
  function onDownload() {
    const link = document.createElement('a')
    link.href = file.dataUrl
    link.setAttribute('download', file.name)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  return (
    <span style={{ cursor: 'pointer' }} onClick={onDownload}>
      {children}
    </span>
  )
}

export default FileDownloadLink