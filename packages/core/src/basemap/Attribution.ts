/**
 * Credit the terms of a basemap or terrain require on screen, as text, linking to its source when it has one.
 */
export interface Attribution {
  readonly text: string;
  /** `https` URL the text links to, or null for a credit written as plain text, as a user typed it. */
  readonly url: string | null;
}
