/*!
 * Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { MynahIcons } from './components/icon';

export interface MynahUIDataModel {
  loading?: boolean;
  liveSearchState?: LiveSearchState;
  query?: string;
  code?: string;
  codeSelection?: SearchPayloadCodeSelection;
  codeQuery?: SearchPayloadCodeQuery;
  matchPolicy?: SearchPayloadMatchPolicy;
  userAddedContext?: string[];
  suggestions?: Suggestion[];
  autoCompleteSuggestions?: AutocompleteItem[];
  searchHistory?: SearchHistoryItem[];
  headerInfo?: {
    content: string;
    type?: NotificationType;
  };
}

export interface ServiceConnector {
  liveSearchHandler?: (searchPayload?: SearchPayload, suggestions?: Suggestion[]) => void;
  liveSearchStateExternalChangeHandler?: (state: LiveSearchState) => void;
  uiReady: () => void;
  once: () => Promise<Suggestion[]>;
  requestSuggestions: (
    searchPayload: SearchPayload,
    isFromHistory?: boolean,
    isFromAutocomplete?: boolean
  ) => Promise<Suggestion[] | undefined>;
  updateVoteOfSuggestion: (suggestion: Suggestion, vote: RelevancyVoteType) => void;
  clickCodeDetails: (
    code: string,
    fileName?: string,
    range?: {
      start: { row: string; column?: string };
      end?: { row: string; column?: string };
    }
  ) => void;
  recordContextChange: (changeType: ContextChangeType, queryContext: ContextType) => void;
  triggerSuggestionEngagement: (engagement: SuggestionEngagement) => void;
  triggerSuggestionClipboardInteraction: (suggestionId: string, type?: string, text?: string) => void;
  triggerSuggestionEvent: (eventName: SuggestionEventName, suggestion: Suggestion) => void;
  sendFeedback: (feedbackPayload: FeedbackPayload) => void;
  requestHistoryRecords: (filterPayload: SearchHistoryFilters) => Promise<SearchHistoryItem[]>;
  requestAutocomplete: (input: string) => Promise<AutocompleteItem[]>;
  toggleLiveSearch?: (
    liveSearchState: LiveSearchState,
    onFeedReceived: (searchPayload?: SearchPayload, suggestions?: Suggestion[]) => void
  ) => void;
  clickAutocompleteSuggestionItem: (
    text: string,
    currSelected?: number,
    suggestionCount?: number
  ) => void;
}

export enum MynahEventNames {
  RESET_STORE = 'resetStore',
  CONTEXT_VISIBILITY_CHANGE = 'contextVisibilityChange',
  REQUEST_AUTOCOMPLETE_SUGGESTIONS = 'requestAutocompleteSuggestions',
  AUTOCOMPLETE_SUGGESTION_CLICK = 'autoCompleteSuggestionClick',
  SEARCH = 'search',
  REQUEST_SEARCH_HISTORY = 'requestSearchHistory',
  SEARCH_HISTORY_ITEM_CLICK = 'searchHistoryItemClick',
  LIVE_SEARCH_STATE_CHANGED = 'liveSearchStateChanged',
  FEEDBACK_SET = 'feedbackSet',
  CODE_DETAILS_CLICK = 'codeDetailsClick',
  SUGGESTION_VOTE = 'suggestionVote',
  SUGGESTION_OPEN = 'suggestionOpen',
  SUGGESTION_LINK_CLICK = 'suggestionLinkClick',
  SUGGESTION_LINK_COPY = 'suggestionLinkCopy',
  SUGGESTION_ENGAGEMENT = 'suggestionEngagement',
  SUGGESTION_COPY_TO_CLIPBOARD = 'suggestionCopyToClipboard',
};
export const MynahPortalNames = {
  WRAPPER: 'wrapper',
  OVERLAY: 'overlay',
  FEEDBACK_FORM: 'feedbackForm',
};
export interface SearchPayloadMatchPolicy {
  must: string[];
  should: string[];
  mustNot: string[];
}
export interface SearchPayloadCodeSelection {
  selectedCode: string;
  file?: {
    range: {
      start: { row: string; column: string };
      end: { row: string; column: string };
    };
    name: string;
  };
}
export interface SearchPayloadCodeQuery {
  simpleNames: string[];
  usedFullyQualifiedNames: string[];
}
export interface SearchPayload {
  query: string;
  matchPolicy: SearchPayloadMatchPolicy;
  codeSelection: SearchPayloadCodeSelection;
  codeQuery?: SearchPayloadCodeQuery;
  code?: string;
}
export interface SuggestionMetaData {
  type: string;
  stars?: number; // repo stars
  forks?: number; // repo forks
  answerCount?: number; // total answer if it is a question
  isAccepted?: boolean; // is accepted or not if it is an answer
  score?: number; // upVote count for question or answer
  lastActivityDate?: number; // creation or last update date for question or answer
}
export interface Suggestion {
  id: string;
  title: string;
  url: string;
  body: string;
  context: string[];
  type?: string;
  metadata?: SuggestionMetaData;
}

export enum KeyMap {
  ESCAPE = 'Escape',
  ENTER = 'Enter',
  BACKSPACE = 'Backspace',
  DELETE = 'Delete',
  ARROW_UP = 'ArrowUp',
  ARROW_DOWN = 'ArrowDown',
  ARROW_LEFT = 'ArrowLeft',
  ARROW_RIGHT = 'ArrowRight',
  PAGE_UP = 'PageUp',
  PAGED_OWN = 'PageDown',
  HOME = 'Home',
  END = 'End',
  META = 'Meta',
  TAB = 'Tab',
  SHIFT = 'Shift',
  CONTROL = 'Control',
  ALT = 'Alt',
}

export enum LiveSearchState {
  PAUSE = 'pauseLiveSearch',
  RESUME = 'resumeLiveSearch',
  STOP = 'stopLiveSearch',
}

export const SupportedCodingLanguages = [ 'typescript', 'javascript', 'java', 'json', 'python' ];
type ElementType<T extends readonly unknown[]> = T extends ReadonlyArray<infer ElementType> ? ElementType : never;

export type SupportedCodingLanguagesType = ElementType<typeof SupportedCodingLanguages>;
export const SupportedCodingLanguagesExtensionToTypeMap = {
  ts: 'typescript',
  js: 'javascript',
  py: 'python',
  java: 'java',
  json: 'json',
};

export type OnCopiedToClipboardFunction = (type?: 'selection' | 'block', text?: string) => void;

export interface SearchHistoryFilters {
  /**
     * Flag to define are we looking in global search-history or only in worplace
     *
     * @default - Search will be performed on workplace store
     */
  isGlobal: boolean;
  /**
     * Flag to define are we looking only for queries which were manually typed by the user,
     * or only for quries whic were generated by plugin itself, or it's not important
     *
     * @default - We won't filter records bases on type of input
     */
  isManualSearch?: boolean;
  /**
     * Array of language filters. If user chose some, the results would be filtered
     *
     * @default - We won't filter records bases on languages
     */
  languages: string[];
  /**
     * User text from search bar in search-history part of UI
     *
     * @default - We won't filter records bases on user input in search-history search bar
     */
  text?: string;
  /**
     * Allow us to skip n-first results
     *
     * @default - The starting offset will be 0
     */
  resultOffset: number;
  /**
     * Limit of how many results we want to get from store
     *
     * @default - The records count won't be limited
     */
  resultLimit?: number;
}

export interface CodeQuery {
  simpleNames: string[];
  usedFullyQualifiedNames: string[];
}

export enum ContextChangeType {
  'ADD' = 'add',
  'REMOVE' = 'remove',
}
export enum SuggestionEventName {
  CLICK = 'click',
  OPEN = 'openSuggestion',
  COPY = 'copy',
}
export enum RelevancyVoteType {
  UP = 'upvote',
  DOWN = 'downvote',
}

/**
 * 'interaction' will be set if there was a potential text selection or a click input was triggered by the user.
 *  If this is a selection selectionDistanceTraveled object will also be filled
 * 'timespend' will be set basically if there is no interaction except mouse movements in a time spent longer than the ENGAGEMENT_DURATION_LIMIT
 *  Don't forget that in 'timespend' case, user should leave the suggestion card at some point to count it as an interaction.
 *  (They need to go back to the code or move to another card instead)
 */
export enum EngagementType {
  INTERACTION = 'interaction',
  TIME = 'timespend',
}
export interface SuggestionEngagement {
  /**
     * Suggestion information
     */
  suggestion: Suggestion;

  /**
     * Engagement type
     */
  engagementType: EngagementType;
  /**
     * Total duration in ms till the engagement triggered.
     */
  engagementDurationTillTrigger: number;
  /**
     * This is a little bit more than what you might expect on a normal scroll position of the suggestion card.
     * This attribute gives the value for how much the users traveled their mouses and additionally how much they scrolled to focus on that suggestion
     */
  scrollDistanceToEngage: number;
  /**
     * Total mouse movement in x and y directions till the engagament triggered.
     * To avoid confusion: this is not the distance between start and end points, this is the total traveled distance.
     */
  totalMouseDistanceTraveled: { x: number; y: number };
  /**
     * If the engagementType is "interaction" and this object has a value, you can assume it as a text selection.
     * If the engagementType is "interaction" but this object is not defined, you can assume it as a click
     */
  selectionDistanceTraveled?: { x: number; y: number; selectedText?: string };
}

export interface SearchHistoryItem {
  query: {
    input: string;
    queryContext: SearchPayloadMatchPolicy;
    queryId?: string;
    trigger: string;
    codeQuery: CodeQuery;
    codeSelection: SearchPayloadCodeSelection;
    code?: string;
  };
  recordDate?: number;
  suggestions: Suggestion[];
}

export enum ContextTypes {
  MUST = 'must',
  SHOULD = 'should',
  MUST_NOT = 'mustNot',
}
export enum ContextSource {
  AUTO = 'auto',
  USER = 'user',
  SUGGESTION = 'suggestion',
}
export enum ContextTypeClassNames {
  should = 'mynah-should-contain',
  must = 'mynah-must-contain',
  mustNot = 'mynah-must-not-contain',
}
export interface ContextType {
  context: string;
  type?: ContextTypes;
  source: ContextSource;
}

export type FeedbackStars = 1 | 2 | 3 | 4 | 5;
export interface FeedbackPayload {
  stars?: FeedbackStars;
  comment?: string;
}
export interface AutocompleteItem {
  suggestion: string;
  highlight: string;
}

export enum NotificationType {
  INFO = MynahIcons.INFO,
  SUCCESS = MynahIcons.OK_CIRCLED,
  WARNING = MynahIcons.WARNING,
  ERROR = MynahIcons.ERROR,
}
