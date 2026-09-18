import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import jsonResumeSchema from '../../data/content-schema.json' with { type: 'json' };

const ajv = new Ajv({ allErrors: true, strict: false, validateSchema: false });
addFormats(ajv);

const validateSchema = ajv.compile(jsonResumeSchema);

/**
 * Validates a JSON string or object against JSON Resume Schema v1.0.0 using AJV.
 * @param {string|object} jsonInput 
 * @returns {{ isValid: boolean, syntaxError: boolean, errors: Array<{ path: string, message: string }> }}
 */
export function validateJsonResume(jsonInput) {
  if (jsonInput === undefined || jsonInput === null || (typeof jsonInput === 'string' && !jsonInput.trim())) {
    return {
      isValid: false,
      syntaxError: true,
      errors: [{ path: '', message: 'Conținut JSON gol' }]
    };
  }

  let parsedObj;
  if (typeof jsonInput === 'string') {
    try {
      parsedObj = JSON.parse(jsonInput);
    } catch (err) {
      return {
        isValid: false,
        syntaxError: true,
        errors: [{ path: '', message: `Sintaxă JSON invalidă: ${err.message}` }]
      };
    }
  } else {
    parsedObj = jsonInput;
  }

  const valid = validateSchema(parsedObj);

  if (!valid && validateSchema.errors) {
    const formattedErrors = validateSchema.errors.map((err) => {
      const fieldPath = err.instancePath ? err.instancePath : 'rădăcină (root)';
      let msg = err.message || 'Eroare de validare';
      if (err.keyword === 'additionalProperties' && err.params?.additionalProperty) {
        msg = `Proprietatea nepermisă '${err.params.additionalProperty}' nu face parte din schema JSON Resume`;
      }
      return {
        path: fieldPath,
        message: msg
      };
    });

    return {
      isValid: false,
      syntaxError: false,
      errors: formattedErrors
    };
  }

  return {
    isValid: true,
    syntaxError: false,
    errors: []
  };
}
