export class RefreshToken {
  value: string;
  expiration: number;
}

export class AdditionalInformation {
}

export class AuthToken {
  value: string;
  expiration: number;
  tokenType: string;
  refreshToken: RefreshToken;
  scope: string[];
  additionalInformation: AdditionalInformation;
  expiresIn: number;
  expired: boolean;
}
