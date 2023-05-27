
/** Download file Code from
 * https://theroadtoenterprise.com/blog/how-to-download-csv-and-json-files-in-react
 */
const downloadFile = (data, fileName, fileType) => {
    const blob = new Blob([data], { type: fileType })
    const a = document.createElement('a')
    a.download = fileName
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    a.remove()
}

export { downloadFile }