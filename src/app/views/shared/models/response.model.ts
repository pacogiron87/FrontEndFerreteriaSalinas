export interface Response<T> {
  isSuccess: boolean;
  returnMessage: any;
  data: T;
}
