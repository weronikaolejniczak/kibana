/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Builds an index name that includes the `namespace` using the provided index name prefix or pattern.
 *
 * @param indexNamePrefixOrPattern
 * @param namespace
 * @param options Optional configuration object
 *
 * @example
 *
 * buildIndexNameWithNamespace('logs-foo.bar-*', 'default'); // == 'logs-foo.bar-default'
 * buildIndexNameWithNamespace('logs-foo.bar', 'default'); // == 'logs-foo.bar-default'
 * buildIndexNameWithNamespace('logs-foo.bar-', 'default'); // == 'logs-foo.bar-default'
 * buildIndexNameWithNamespace('logs-foo.bar.*', 'default', { preserveWildcard: true }); // == 'logs-foo.bar.*-default'
 */

interface BuildIndexNameOptions {
  preserveWildcard?: boolean;
}

export const buildIndexNameWithNamespace = (
  indexNamePrefixOrPattern: string,
  namespace: string,
  options: BuildIndexNameOptions = {}
): string => {
  const { preserveWildcard = false } = options;

  if (preserveWildcard && indexNamePrefixOrPattern.endsWith('.*')) {
    return `${indexNamePrefixOrPattern}-${namespace}`;
  }

  if (indexNamePrefixOrPattern.endsWith('*')) {
    const hasDash = indexNamePrefixOrPattern.endsWith('-*');
    return `${indexNamePrefixOrPattern.substring(0, indexNamePrefixOrPattern.length - 1)}${
      hasDash ? '' : '-'
    }${namespace}`;
  }

  return `${indexNamePrefixOrPattern}${
    indexNamePrefixOrPattern.endsWith('-') ? '' : '-'
  }${namespace}`;
};
