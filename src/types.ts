
/* MAIN */

type Configuration = {
  allowComments?: boolean,
  allowCustomElements?: boolean,
  allowUnknownMarkup?: boolean,
  allowElements?: string[],
  blockElements?: string[],
  dropElements?: string[],
  allowAttributes?: Record<string, string[]>,
  dropAttributes?: Record<string, string[]>
};

/* EXPORT */

export type {Configuration};
