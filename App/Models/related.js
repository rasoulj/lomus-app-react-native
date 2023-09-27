export class ResponseStatus {
  SUCCESS = 'SUCCESS';
  FAILURE = 'FAILURE';
  DUPLICATE = 'DUPLICATE';
  UNAUTHORIZED = 'UNAUTHORIZED';
}

export class RelatedObject<T> {
  status: string; // one of SUCCESS, FAILURE, DUPLICATE, UNAUTHORIZED
  statusMessage: string;
  relatedObjectId: string;
  relatedObject: T;
}
