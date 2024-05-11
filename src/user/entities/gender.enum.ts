export enum Gender {
  Male = 'male',
  Femail = 'female',
}

export function toGender(value: string) {
  if (value.toLowerCase() === 'male') {
    return Gender.Male;
  } else if (value.toLowerCase() === 'female') {
    return Gender.Femail;
  }

  return null;
}
