'use server'

import { cookies } from "next/headers"

export async function createToken(token: string, userId: string, role: string) {
    const oneDay = 24 * 60 * 60 * 1000
    cookies().set(`token`, token, { expires: Date.now() + oneDay })
    cookies().set(`userId`, userId)
    cookies().set(`role`, role)
}

export async function getToken() {
    console.log(cookies().get(`token`))
    return cookies().get(`token`)?.value
}

export async function getUserId() {
    return cookies().get(`userId`)?.value
}

export async function getRole() {
    return cookies().get(`role`)?.value
}

export async function deleteToken() {
    cookies().delete(`token`)
    cookies().delete(`userId`)
    cookies().delete(`role`)

}