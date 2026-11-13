/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

const EMOTION_CLASS_NAME = /^css-[a-z0-9]+(?:-(.+))?$/;

/**
 * Replaces the hash in Emotion class names so snapshots don't change whenever
 * the serialized styles change: `css-<hash>-<label>` becomes `emotion-<label>`
 * and an unlabelled `css-<hash>` becomes `emotion-css`.
 */
const replaceEmotionClassName = (className) => {
  const match = className.match(EMOTION_CLASS_NAME);
  if (!match) return className;
  return match[1] ? `emotion-${match[1]}` : 'emotion-css';
};

module.exports = { replaceEmotionClassName };
