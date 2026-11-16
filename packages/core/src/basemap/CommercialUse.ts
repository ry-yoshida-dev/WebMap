/**
 * Whether a basemap's terms let commercial products show it.
 */
export enum CommercialUse {
  /** Allowed with attribution, without a key, fee or usage cap. */
  ALLOWED = "allowed",
  /** Allowed only under conditions such as an API key, a request quota or light use; see {@link BasemapUsage.conditions}. */
  CONDITIONAL = "conditional",
  /** Not allowed without a separately purchased license. */
  NON_COMMERCIAL_ONLY = "non-commercial-only",
  /** Not known, as for a service a user added by its address; the user judges whether showing it is allowed. */
  UNKNOWN = "unknown",
}
