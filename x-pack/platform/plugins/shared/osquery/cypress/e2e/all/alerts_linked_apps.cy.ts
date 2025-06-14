/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { initializeDataViews } from '../../tasks/login';
import { cleanupRule, loadRule } from '../../tasks/api_fixtures';
import { RESPONSE_ACTIONS_ITEM_0, RESPONSE_ACTIONS_ITEM_1 } from '../../tasks/response_actions';
import {
  checkResults,
  inputQueryInFlyout,
  loadRuleAlerts,
  selectAllAgents,
  submitQuery,
} from '../../tasks/live_query';
import { closeModalIfVisible, closeToastIfVisible } from '../../tasks/integrations';

// FLAKY: https://github.com/elastic/kibana/issues/218206
describe.skip(
  'Alert Event Details',
  {
    tags: ['@ess', '@serverless', '@skipInServerlessMKI'],
  },
  () => {
    let ruleId: string;
    let ruleName: string;
    beforeEach(() => {
      initializeDataViews();
      loadRule().then((data) => {
        ruleId = data.id;
        ruleName = data.name;
        loadRuleAlerts(data.name);
      });
    });

    afterEach(() => {
      cleanupRule(ruleId);
    });

    it('should be able to add investigation guides to response actions', () => {
      cy.getBySel('editRuleSettingsLink').click();
      cy.getBySel('globalLoadingIndicator').should('not.exist');
      cy.getBySel('edit-rule-actions-tab').click();
      cy.getBySel('osquery-investigation-guide-text').should('exist');
      cy.getBySel('globalLoadingIndicator').should('not.exist');
      cy.contains('Loading connectors...').should('not.exist');

      cy.getBySel('osqueryAddInvestigationGuideQueries').click();
      cy.getBySel('osquery-investigation-guide-text').should('not.exist');

      cy.getBySel(RESPONSE_ACTIONS_ITEM_0).within(() => {
        cy.contains("SELECT * FROM os_version where name='{{host.os.name}}';");
        cy.get('input[value="host.os.platform"]').should('exist');
        cy.contains('platform');
      });
      cy.getBySel(RESPONSE_ACTIONS_ITEM_1).within(() => {
        cy.contains('select * from users');
      });

      cy.contains('Save changes').click();
      cy.contains(`${ruleName} was saved`).should('exist');
      closeToastIfVisible();
    });

    it('should be able to run live query and add to timeline', () => {
      const TIMELINE_NAME = 'Untitled timeline';
      cy.getBySel('expand-event').first().click();
      cy.getBySel('securitySolutionFlyoutFooterDropdownButton').click();
      cy.getBySel('osquery-action-item').click();
      cy.contains('1 agent selected.');
      selectAllAgents();
      inputQueryInFlyout('select * from uptime;');
      submitQuery();
      checkResults();
      cy.contains('Add to Timeline investigation');
      cy.getBySel('add-to-timeline').first().click();
      cy.getBySel('globalToastList').contains('Added');
      closeToastIfVisible();
      cy.contains('Cancel').click();
      cy.getBySel('timeline-bottom-bar').within(() => {
        cy.contains(TIMELINE_NAME).click();
      });
      cy.getBySel('draggableWrapperKeyboardHandler').contains('action_id: "');
      // timeline unsaved changes modal
      cy.visit('/app/osquery');
      closeModalIfVisible();
    });
  }
);
