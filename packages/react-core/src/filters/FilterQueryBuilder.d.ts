export enum FilterTypes {
  IN = 'in',
  BETWEEN = 'between', // [a, b] both are included
  CLOSED_OPEN = 'closed_open', // [a, b) a is included, b is not
  TIME = 'time'
}