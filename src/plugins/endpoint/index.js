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

// @flow

import DefaultSchemaPlugin from './default/SchemaPlugin'
import AzureSchemaPlugin from './azure/SchemaPlugin'
import DefaultContentPlugin from './default/ContentPlugin'
import AzureContentPlugin from './azure/ContentPlugin'
import OpenstackContentPlugin from './openstack/ContentPlugin'
import OpenstackSchemaPlugin from './openstack/SchemaPlugin'

export const SchemaPlugin = {
  default: DefaultSchemaPlugin,
  azure: AzureSchemaPlugin,
  openstack: OpenstackSchemaPlugin,
}

export const ContentPlugin = {
  default: DefaultContentPlugin,
  azure: AzureContentPlugin,
  openstack: OpenstackContentPlugin,
}
