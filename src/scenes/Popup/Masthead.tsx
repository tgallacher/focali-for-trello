import React from 'react';
import { majorScale, Heading, Pane } from 'evergreen-ui';

import logo from '../../../images/focali-logo-48x48.png';

const Masthead = ({ title, padding }: any) => (
  <Pane
    padding={padding}
    background="blueTint"
    borderBottom
    display="flex"
    alignItems="center"
  >
    <Pane display="flex" marginRight={majorScale(1)}>
      <img src={logo} alt="logo" height="32" width="32" />
    </Pane>

    <Pane display="flex">
      <Heading is="h1" size={700}>
        {title}
      </Heading>
    </Pane>
  </Pane>
);

export default Masthead;
