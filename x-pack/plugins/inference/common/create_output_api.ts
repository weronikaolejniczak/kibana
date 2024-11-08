/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { map } from 'rxjs';
import {
  OutputAPI,
  OutputEvent,
  OutputEventType,
  ChatCompleteAPI,
  ChatCompletionEventType,
  MessageRole,
  withoutTokenCountEvents,
} from '@kbn/inference-common';
import { ensureMultiTurn } from './utils/ensure_multi_turn';

export function createOutputApi(chatCompleteApi: ChatCompleteAPI): OutputAPI {
  return (id, { connectorId, input, schema, system, previousMessages, functionCalling }) => {
    return chatCompleteApi({
      connectorId,
      system,
      functionCalling,
      messages: ensureMultiTurn([
        ...(previousMessages || []),
        {
          role: MessageRole.User,
          content: input,
        },
      ]),
      ...(schema
        ? {
            tools: {
              structuredOutput: {
                description: `Use the following schema to respond to the user's request in structured data, so it can be parsed and handled.`,
                schema,
              },
            },
            toolChoice: { function: 'structuredOutput' as const },
          }
        : {}),
    }).pipe(
      withoutTokenCountEvents(),
      map((event): OutputEvent<any, any> => {
        if (event.type === ChatCompletionEventType.ChatCompletionChunk) {
          return {
            type: OutputEventType.OutputUpdate,
            id,
            content: event.content,
          };
        }

        return {
          id,
          output:
            event.toolCalls.length && 'arguments' in event.toolCalls[0].function
              ? event.toolCalls[0].function.arguments
              : undefined,
          content: event.content,
          type: OutputEventType.OutputComplete,
        };
      })
    );
  };
}
