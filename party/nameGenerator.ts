import {fakerES_MX as faker} from '@faker-js/faker'

export function generateName(seed: string) {
    const num = parseInt([...seed].map(c=>c.charCodeAt(0)).join())
    faker.seed(num);
  return faker.person.firstName()
}