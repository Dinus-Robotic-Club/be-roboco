export interface IRegisterUserInput {
    email: string
    name: string
    password: string
}

export interface ILoginUserInput {
    email: string
    password: string
}

export interface ILoginTeamInput {
    name: string
    password: string
}

export interface IResponseLogin {
    access_token: string
}
