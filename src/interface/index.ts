export interface Message {
  readonly command: string,
  [propName: string]: any
}

export interface SubmitContent {
  readonly number: number | string,
  readonly body: string
}

export interface Content {
  [propName: string]: any
}