/*
Copyright (C) 2017  Cloudbase Solutions SRL
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

class LabelDictionary {
  static dictionary = {
    opc: 'Oracle Cloud',
    vmware_vsphere: 'VMWare',
    oracle_vm: 'Oracle VM Server',
    separate_vm: 'Separate Migration/VM?',
    api_endpoint: 'API Endpoint',
    identity_api_version: 'Identity Version',
    storage_auth_endpoint: 'Storage Authentication Endpoint',
    fip_pool_name: 'Floating IP Pool',
    migr_fip_pool_name: 'Migration Floating IP Pool',
    migr_flavor_name: 'Migration Flavor Name',
    migr_image: 'Migration Image Name or Id',
    migr_network: 'Migration Network Name or ID',
    volumes_are_zeroed: 'Volumes on destination are created zeroed',
    port_reuse_policy: 'Port Reuse Policy',
    keep_mac: 'Keep MAC address',
    reuse_ports: 'Reuse Existing Ports',
    replace_mac: 'Replace MAC address',
    migr_image_id: 'Migration Image ID',
    migr_worker_use_config_drive: 'Migration Worker use ConfigDrive',
    migr_worker_use_fip: 'Migration Worker use FIP',
    delete_disks_on_vm_termination: 'Delete Disks on VM termination',
    set_dhcp: 'Set DHCP',
    vm_size: 'VM Size',
    subscription_id: 'Subscription ID',
    tenant_id: 'Tenant ID',
    client_id: 'Client ID',
    migr_template_name: 'Migration Template Name',
    migr_template_username: 'Migration Template Username',
    migr_template_password: 'Migration Template Password',
    migr_shape_name: 'Migration Shape Name',
    glance_api_version: 'Glance API Version',
    access_key_id: 'Access Key ID',
    skip_os_morphing: 'Skip OS Morphing',
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
