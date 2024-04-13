import { srlm_get, srlm_post } from "./srlmUtils";

export async function verify_user(token: string) {
    return await srlm_post('/auth/user/validate', token);
}