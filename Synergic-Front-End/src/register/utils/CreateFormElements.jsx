import FormElement from "../../components/FormElement";

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
        name={field.name}
        label={field.label}
        error={errors[field.name]}
        submitted={submitted}
        type={field.type}
        change={change}
      />
    );
  });
  return FormElements;
}
