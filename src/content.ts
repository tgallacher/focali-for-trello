/* global chrome */
/* eslint no-console: off */
import focaliCss from './focali.scss';

// Trello css classnames
const TRELLO_CLASSNAME__LIST_WRAPPER = '#board .js-list';
const TRELLO_CLASSNAME__LIST_HEADER_NAME = '.js-list-name-assist';
// Focali css classnames
const FOCALI_CLASSNAME__FOCUSED = 'focali__list-focused';
const FOCALI_CLASSNAME__UNFOCUSED = 'focali__list-unfocused';

/**
 * Gets current board ID from page URI.
 */
const getCurBoardId = (): string | undefined => {
  // TODO check URL contains trello.com
  const [, curTrelloBoardId] = /b\/(.*)\//.exec(window.location.pathname);

  return curTrelloBoardId;
};

/**
 * Retrieve user prefs from storage.
 * Prefs are added using the Popup UI.
 */
const fetchUserPrefs = (
  curTrelloBoardId: string | undefined,
): Promise<{
  enabled: boolean;
  focusLists: string[];
}> => {
  if (!curTrelloBoardId) {
    return Promise.resolve({});
  }

  return new Promise(resolve => {
    chrome.storage.local.get(
      [curTrelloBoardId],
      ({ [curTrelloBoardId]: { enabled = false, focus = [] } = {} }) => {
        return resolve({
          enabled,
          focusLists: focus,
        });
      },
    );
  });
};

/**
 * Toggle focus on the provided DOMNode
 *
 * @param listNode DOMNode with classname of TRELLO_CLASSNAME__LIST_WRAPPER
 * @param whitelist list of columns titles to focus
 */
const updateList = (listNode, whitelist) => {
  const listTitle = listNode.querySelector(TRELLO_CLASSNAME__LIST_HEADER_NAME)
    .textContent;

  if (!listNode.classList.contains('js-list')) {
    console.warn(
      `Focali for Trello: "updateList()" was invoked with a DOMNode at the wrong hierarchy level (given "${
        listNode.classList
      }"). Unexpected results may follow`,
    );
  }

  // Toggle classnames
  if (whitelist.includes(listTitle)) {
    // focused
    listNode.classList.remove(FOCALI_CLASSNAME__UNFOCUSED);
    listNode.classList.add(FOCALI_CLASSNAME__FOCUSED);
  } else {
    // un-focused
    listNode.classList.remove(FOCALI_CLASSNAME__FOCUSED);
    listNode.classList.add(FOCALI_CLASSNAME__UNFOCUSED);
  }
};

/**
 * Run focus toggle across entire Trello board
 *
 * @param listTitlesToFocus list of columns titles to focus
 */
const updateTrelloBoard = (listTitlesToFocus: string[]): void => {
  Array.prototype.forEach.call(
    document.querySelectorAll(TRELLO_CLASSNAME__LIST_WRAPPER),
    el => updateList(el, listTitlesToFocus),
  );
};

/**
 * Reset focus back to Trello default.
 * This effectively removes anything that this plugin has added.
 */
const resetTrelloBoard = (): void => {
  Array.prototype.forEach.call(
    document.querySelectorAll(TRELLO_CLASSNAME__LIST_WRAPPER),
    el => {
      el.classList.remove(FOCALI_CLASSNAME__FOCUSED);
      el.classList.remove(FOCALI_CLASSNAME__UNFOCUSED);
    },
  );
};

/**
 * Watch board area for DOM changes, i.e. lists being added.
 */
const watchBoard = (): void => {
  const listNodes = document.querySelectorAll(TRELLO_CLASSNAME__LIST_WRAPPER);
  const observer = new MutationObserver(async function(
    mutations: MutationRecord[],
  ) {
    const { enabled, focusLists } = await fetchUserPrefs(getCurBoardId());

    if (!enabled) return;

    Array.prototype.forEach.call(mutations, mutation => {
      Array.prototype.forEach.call(mutation.addedNodes, entry => {
        if (entry instanceof Element && entry.classList.contains('js-list')) {
          updateList(entry, focusLists);
        }
      });
    });
  });

  // Update lists we already have
  fetchUserPrefs(getCurBoardId()).then(({ enabled, focusLists }) => {
    // Assume enabled check has already happened by this point
    if (!enabled) return;

    Array.prototype.forEach.call(listNodes, listNode => {
      updateList(listNode, focusLists);
    });
  });

  // watch for changes
  observer.observe(document.querySelector('#board'), {
    childList: true,
  });
};

/**
 * Watch Content DOM for changes, i.e. the board changing.
 */
const watchContent = (): void => {
  const observer = new MutationObserver(function(mutations) {
    Array.prototype.forEach.call(mutations, mutation => {
      Array.prototype.forEach.call(mutation.addedNodes, entry => {
        if (
          entry instanceof Element &&
          entry.classList.contains('board-wrapper')
        ) {
          watchBoard();
          return;
        }
      });
    });
  });

  observer.observe(document.querySelector('#content'), {
    childList: true,
  });
};

/**
 * Main entrypoint
 */
(async function() {
  // Handle state changes
  chrome.storage.onChanged.addListener(function(changes) {
    const curTrelloBoardId = getCurBoardId();

    if (!(curTrelloBoardId in changes)) {
      resetTrelloBoard();

      return;
    }

    let focalists, enabled;
    if ('newValue' in changes[curTrelloBoardId]) {
      focalists = changes[curTrelloBoardId].newValue.focus;
      enabled = changes[curTrelloBoardId].newValue.enabled;
    } else if ('oldValue' in changes[curTrelloBoardId]) {
      focalists = changes[curTrelloBoardId].oldValue.focus;
      enabled = changes[curTrelloBoardId].oldValue.enabled;
    }

    if (enabled === false) {
      resetTrelloBoard();

      return;
    }

    Array.isArray(focalists) &&
      focalists.length > 0 &&
      updateTrelloBoard(focalists);
  });

  watchContent();

  const link = document.createElement('link');
  link.href = focaliCss;
  document.head.appendChild(link);
})();
