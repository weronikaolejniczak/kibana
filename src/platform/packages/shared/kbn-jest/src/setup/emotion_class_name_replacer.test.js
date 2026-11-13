/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

const { replaceEmotionClassName } = require('./emotion_class_name_replacer');

describe('replaceEmotionClassName', () => {
  it('keeps the label of EUI class names', () => {
    expect(replaceEmotionClassName('css-1a2b3c-euiButtonDisplay-m-defaultMinWidth-base')).toBe(
      'emotion-euiButtonDisplay-m-defaultMinWidth-base'
    );
  });

  it('keeps the label of non-EUI class names', () => {
    expect(replaceEmotionClassName('css-1slkmya-wrapper')).toBe('emotion-wrapper');
    expect(replaceEmotionClassName('css-uocz3u-ProviderContentWrapper')).toBe(
      'emotion-ProviderContentWrapper'
    );
  });

  it('replaces unlabelled class names', () => {
    expect(replaceEmotionClassName('css-1a2b3c')).toBe('emotion-css');
  });

  it('leaves other class names untouched', () => {
    expect(replaceEmotionClassName('euiButton')).toBe('euiButton');
    expect(replaceEmotionClassName('my-css-class')).toBe('my-css-class');
  });
});
