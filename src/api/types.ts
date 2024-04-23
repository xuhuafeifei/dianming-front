export interface Editable<R, T> {
  create(request: R): Promise<T | ResType>;

  edit(request: R): Promise<T | ResType>;
}

export interface ResType<T> {
  msg: string;
  code: number;
  data: T[];
}
export interface PageType {
  page: number;
  limit: number;
}
