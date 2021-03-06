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

import type { Schedule } from './Schedule'
import type { Instance } from './Instance'
import type { NetworkMap } from './Network'
import type { Endpoint } from './Endpoint'

export type WizardData = {
  options?: ?{ [string]: mixed },
  schedules?: Schedule[],
  selectedInstances?: ?Instance[],
  networks?: ?NetworkMap[],
  source?: Endpoint,
  target?: Endpoint,
}

export type WizardPage = {
  id: string,
  title: string,
  breadcrumb: string,
  excludeFrom?: 'replica' | 'migration',
}
