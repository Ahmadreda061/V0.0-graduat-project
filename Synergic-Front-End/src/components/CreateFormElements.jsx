import FormElement from "./FormElement";

export default function createFormElements(
  formFields,
  errors,
  change,
  submitted
) {
  const FormElements = formFields.map((field, index) => {
    return (
      <FormElement
        key={index}
        {...field}
        error={errors[field.name]}
        submitted={submitted}
        change={change}
      />
    );
  });
  return FormElements;
}
