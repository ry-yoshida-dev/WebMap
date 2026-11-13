/**
 * Credit the terms of a basemap or terrain require on screen, as text linking to its source.
 */
export interface Attribution {
  readonly text: string;
  /** `https` URL the text links to. */
  readonly url: string;
}
