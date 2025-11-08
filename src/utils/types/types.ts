export interface ITokenPayload {
    uid: string
    email: string
    name: string
}

export enum StatusCode {
    SUCCESS = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_ERROR = 500,
}

export enum MatchStatus {
    PENDING = 'PENDING',
    SCHEDULED = 'SCHEDULED',
    ONGOING = 'ONGOING',
    FINISHED = 'FINISHED',
    CANCELLED = 'CANCELLED',
}

export interface IApiResponse<T> {
    success: boolean
    status: StatusCode
    message: string
    data?: T
    error?: T
}
