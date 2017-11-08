class DomUtils {
  static getEventPath(event) {
    let path = []
    let node = event.target
    while (node !== document.body) {
      path.push(node)
      node = node.parentNode
    }

    return path
  }

  /**
   * Copies specified text to clipboard
   * @param {string} text The text to copy
   * @return True if successful, false otherwise
   */
  static copyTextToClipboard(text) {
    let textArea = document.createElement('textarea')
    textArea.style.position = 'fixed'
    textArea.style.top = 0
    textArea.style.left = 0
    textArea.style.width = '2em'
    textArea.style.height = '2em'
    textArea.style.padding = 0
    textArea.style.border = 'none'
    textArea.style.outline = 'none'
    textArea.style.boxShadow = 'none'
    textArea.style.background = 'transparent'

    textArea.value = text

    document.body.appendChild(textArea)

    textArea.select()

    let successful

    try {
      successful = document.execCommand('copy')
    } finally {
      document.body.removeChild(textArea)
    }
    return successful
  }
}

export default DomUtils
