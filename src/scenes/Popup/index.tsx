import React, { useState } from 'react';
import {
  TextInputField,
  majorScale,
  Heading,
  Button,
  Switch,
  Pane,
  Text,
} from 'evergreen-ui';

const Popup = () => {
  const [isEnabled, setEnabled] = useState(false);
  const [beenTouched, setTouched] = useState(false);
  const [lists, setLists] = useState('');

  const handleToggle = ({ target: value }) => {
    setEnabled(!isEnabled);
    setLists(value);

    if (isEnabled && beenTouched && lists.length > 0) {
      setTouched(false);
    }
  };

  return (
    <Pane
      justifyContent="center"
      flexDirection="column"
      padding={majorScale(2)}
      maxWidth="600px"
      display="flex"
      border="muted"
      flex={1}
    >
      <Heading is="h1" size={700}>
        Focali for Trello
      </Heading>

      <Pane
        justifyContent="center"
        alignItems="center"
        marginTop={majorScale(4)}
        display="flex"
        flex={1}
      >
        <Switch
          display="inline-block"
          height={24}
          checked={isEnabled}
          onChange={handleToggle}
        />
        <Text marginLeft={majorScale(2)}>Enable on this board</Text>
      </Pane>

      <Pane
        justifyContent="center"
        display="flex"
        flex={1}
        paddingX={majorScale(3)}
        marginTop={majorScale(3)}
      >
        <TextInputField
          disabled={!isEnabled}
          width="100%"
          height={majorScale(6)}
          hint="(Titles are case sensitive)"
          description="Comma separate list of the list titles that should be focused."
          placeholder="Add lists to focus"
          onChange={() => setTouched(true)}
        />
      </Pane>
      <Pane
        justifyContent="flex-end"
        marginTop={majorScale(4)}
        paddingX={majorScale(3)}
        display="flex"
        flex={1}
      >
        <Button appearance="primary" disabled={!(isEnabled && beenTouched)}>
          Save
        </Button>
      </Pane>
    </Pane>
  );
};

export default Popup;
