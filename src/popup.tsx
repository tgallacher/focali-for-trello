/**
 * Entry point for the Extension popup UI.
 * This is exposed when a user clicks on the extension icon.
 */
import React from 'react';
import { render } from 'react-dom';

import PopupView from 'scenes/Popup';

const mountEl = document.getElementById('popup');

if (!mountEl) {
  throw new Error('Could not find element on page');
}

render(<PopupView />, mountEl);
