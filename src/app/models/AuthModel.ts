export interface AuthModel{
    message : boolean;
    isAuthenticated : boolean;
    username : string;
    email : string;
    roles : string[];
    token : string;
    expiresOn : Date;
}