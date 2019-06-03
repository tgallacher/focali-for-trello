/* global chrome */
/* eslint no-console: off */
import React, { useState, useLayoutEffect } from 'react';
import {
  TextInputField,
  majorScale,
  Heading,
  Button,
  Strong,
  Switch,
  Pane,
  Text,
} from 'evergreen-ui';

import Masthead from './Masthead';

interface Props {
  /* trigger dev mode for storybook dev */
  devMode?: boolean;
  /* Mock whether we are on Trello site or not */
  debugIsTrello?: boolean;
}

const Popup = ({ debugIsTrello, devMode }: Props): any => {
  const [isEnabled, setEnabled] = useState(false);
  const [beenTouched, setTouched] = useState(false);
  const [lists, setLists] = useState('');
  const [boardId, setBoardId] = useState(undefined);
  const [boardName, setBoardName] = useState('');
  const [isTrello, setIsTrello] = useState(debugIsTrello);

  useLayoutEffect(() => {
    // Allow us to immitate different ui in storybook
    if (devMode) return;

    // Chrome API doesn't exist unless inside extension sandbox.
    if (!('chrome' in window) || !('storage' in chrome)) return;

    chrome.tabs.query(
      {
        windowId: chrome.windows.WINDOW_ID_CURRENT,
        active: true,
      },
      ([curTab]) => {
        // TODO add error to UI: couldn't read current tab
        if (!curTab || !('url' in curTab)) return;

        // Not on Trello
        if (!curTab.url.includes('trello.com')) return;
        if (
          curTab.url.includes('trello.com') &&
          curTab.url.includes('/boards')
        ) {
          return;
        }
        setIsTrello(true);

        setBoardName(curTab.title.replace(' | Trello', ''));
        const [, curTrelloBoardId] = /b\/(.*)\//.exec(curTab.url);
        if (!curTrelloBoardId) return;

        setBoardId(curTrelloBoardId);

        chrome.storage.sync.get(
          [curTrelloBoardId],
          ({ [curTrelloBoardId]: { enabled = false, focus = [] } = {} }) => {
            setEnabled(enabled);
            focus !== '' && setLists(focus.join(','));
          },
        );
      },
    );
  }, [debugIsTrello, devMode]);

  const handleToggle = () => {
    setEnabled(!isEnabled);
    setTouched(true);
  };

  const handleInputChange = ({ target: { value } }) => {
    !beenTouched && setTouched(true);

    setLists(value);
  };

  const handleSave = () => {
    // Chrome API doesn't exist unless inside extension sandbox.
    if (!('chrome' in window) || !('storage' in chrome)) return;

    const newLists = lists
      .replace(/,\s+/g, ',')
      .replace(/^,|,$/g, '')
      .split(',');

    const userPref = {
      [boardId]: {
        enabled: isEnabled,
        focus: newLists,
      },
    };

    // todo add callback which displays saved message on ui
    chrome.storage.sync.set(userPref, () => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);

        return;
      }

      setTouched(false);
      setLists(newLists.join(','));
    });
  };

  return (
    <Pane
      justifyContent="center"
      flexDirection="column"
      width="500px"
      display="flex"
      border="muted"
      flex={1}
    >
      <Masthead padding={majorScale(2)} title="Focali for Trello" />
      {!isTrello && (
        <Pane
          padding={majorScale(2)}
          marginTop={majorScale(4)}
          flex={1}
          textAlign="center"
        >
          <Heading size={500} marginBottom={majorScale(2)}>
            Oops!
          </Heading>

          <Text>
            The current Tab doesn&apos;t appear to be a Trello.com page or a
            Trello board. Make sure you are on a Trello board.
          </Text>
        </Pane>
      )}
      {isTrello && (
        <Pane padding={majorScale(2)}>
          <Pane
            justifyContent="flex-start"
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
            <Text marginLeft={majorScale(2)}>
              Enable on this board: &quot;<Strong>{boardName}</Strong>&quot;
            </Text>
          </Pane>

          <Pane
            justifyContent="center"
            display="flex"
            flex={1}
            paddingRight={majorScale(3)}
            marginTop={majorScale(3)}
          >
            <TextInputField
              disabled={!isEnabled}
              width="100%"
              height={majorScale(6)}
              hint="(Titles are case sensitive)"
              label=""
              value={lists}
              description="Comma separate list of the list titles that should be focused."
              placeholder="Add lists to focus"
              onChange={handleInputChange}
            />
          </Pane>

          <Pane
            justifyContent="flex-end"
            marginTop={majorScale(4)}
            paddingX={majorScale(3)}
            display="flex"
            flex={1}
          >
            <Button
              appearance="primary"
              disabled={!beenTouched}
              onClick={handleSave}
            >
              Save
            </Button>
          </Pane>
        </Pane>
      )}
    </Pane>
  );
};

Popup.defaultProps = {
  devMode: false,
  debugIsTrello: undefined,
};

export default Popup;
