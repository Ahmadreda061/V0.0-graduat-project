import { useReducer } from 'react';
import formatNumber from './formatNumber';

function formReducer(state, action) {
  switch (action.type) {
    case 'INPUT':
    case 'SELECT':
      return {
        ...state,
        [action.name]: action.value,
      };
    case 'cardnumber': return {
      ...state,
      [action.name]: formatNumber(action.value)
    }
    default:
      return state;
  }
}

function useFormReducer(initialState, setErrors) {
  const [formData, dispatch] = useReducer(formReducer, initialState);

  function change(e, type) {
    const { name, value } = e.target;
    dispatch({ type, name, value });
    // Clear error message when input changes
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  }

  return { formData, change };
}

export default useFormReducer;
