import * as bcrypt from 'bcryptjs'

const iterations: number = 10

export async function hashPasswordAsync(password: string): Promise<{ hash: string, salt: string}> | undefined {
const salt: string = await bcrypt.genSalt(40)

if (!salt) return undefined

return new Promise<{ hash: string, salt: string}>((resolve: any, reject: any) => {
  bcrypt.hash(`${salt}${password}`, iterations, (error: any, hash: string) => {
    if (error) reject(error)
    resolve({ hash, salt })
  })
})
}