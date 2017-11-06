class LabelDictionary {
  static dictionary = {
    opc: 'Oracle Cloud',
    vmware_vsphere: 'VMWare',
    oracle_vm: 'Oracle VM Server',
    separate_vm: 'Separate Migration/VM?',
  }

  static get(fieldName) {
    let label = this.dictionary[fieldName]
    if (label) {
      return label
    }

    let words = fieldName.split('_')
    words = words.map(word => word.charAt(0).toUpperCase() + word.substr(1))
    return words.join(' ')
  }
}

export default LabelDictionary
