import {
  isValidString,
  isObject,
  isString,
  isArray,
  LOOP_TYPE_VALIDATIONS,
  VALIDATIONS_CONFIG,
} from "../utils/utils.js"
import { TYPE_LANGUAGE } from "../constants/constants.js"
import { EN_MESSAGE_ERRORS } from "./../constants/messages/en.js"
import { ES_MESSAGE_ERRORS } from "./../constants/messages/es.js"

const { DEFAULT_LANGUAGE, ES } = TYPE_LANGUAGE

export const singleValidation = (data, language = DEFAULT_LANGUAGE) => {
  const { ERROR_TYPE_ARRAY, ERROR_TYPE_OBJECT } =
    ES === language ? ES_MESSAGE_ERRORS : EN_MESSAGE_ERRORS

  let result = { message: ERROR_TYPE_OBJECT, status: false }

  if (isObject(data)) {
    const { id, title, type } = data
    if (isArray(type) && type.length >= 1) {
      result = LOOP_TYPE_VALIDATIONS(type, data, language)
    } else if (isString(type) && isValidString(type)) {
      result = VALIDATIONS_CONFIG({ ...data, language })
    } else {
      result = { id, status: false, title, type, message: ERROR_TYPE_ARRAY }
    }
  }

  return result
}

export const multiValidation = (data, language = DEFAULT_LANGUAGE) => {
  let result = { status: true }
  for (const NEW_DATA of data) {
    result = singleValidation(NEW_DATA, language)
    if (result.status === false) {
      break
    }
  }
  return result
}

export const multiValidationErrors = (data, language = DEFAULT_LANGUAGE) => {
  let result = { status: true }

  const DATA_ERRORS = data.map((NEW_DATA) => {
    return singleValidation(NEW_DATA, language)
  })

  const errors = DATA_ERRORS.filter((item) => item.status === false)

  if (errors.length >= 1) {
    result = { ...result, errors, status: false }
  }

  return result
}
