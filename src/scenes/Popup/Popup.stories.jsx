import React from 'react';
import { storiesOf } from '@storybook/react';

import Popup from './index';

storiesOf('Popup', module)
  .add('Non Trello site', () => <Popup devMode />)
  .add('Trello site', () => <Popup devMode debugIsTrello />);
