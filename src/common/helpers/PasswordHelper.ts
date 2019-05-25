import * as bcrypt from 'bcryptjs'

const iterations: number = 10

export async function hashPasswordAsync(password: string = '', saltLength: number = 32): Promise<{ hash: string, salt: string}> | undefined {
  const salt: string = await bcrypt.genSalt(saltLength)

  if (!salt) return undefined

  return new Promise<{ hash: string, salt: string}>((resolve: any, reject: any) => {
    bcrypt.hash(`${salt}${password}`, iterations, (error: any, hash: string) => {
      if (error) reject(error)
      resolve({ hash, salt })
    })
  })
}

export async function checkPasswordAsync(password: string, salt: string, passwordHash: string): Promise<boolean> {
  return await bcrypt.compare(`${salt}${password}`, passwordHash)
}