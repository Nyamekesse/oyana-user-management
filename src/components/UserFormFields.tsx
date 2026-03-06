import type { UserFormData } from '../types';

interface UserFormFieldsProps {
  form: UserFormData;
  onChange: (key: keyof UserFormData, value: string) => void;
}

function UserFormFields({ form, onChange }: UserFormFieldsProps) {
  const fields: { key: keyof UserFormData; label: string; placeholder: string }[] = [
    { key: 'first_name', label: 'First Name', placeholder: 'Jane' },
    { key: 'last_name', label: 'Last Name', placeholder: 'Doe' },
    { key: 'email', label: 'Email Address', placeholder: 'jane@example.com' },
  ];

  return (
    <>
      {fields.map((f) => (
        <div key={f.key} className="field">
          <label htmlFor={f.key}>{f.label}</label>
          <input
            id={f.key}
            type={f.key === 'email' ? 'email' : 'text'}
            value={form[f.key]}
            placeholder={f.placeholder}
            onChange={(e) => onChange(f.key, e.target.value)}
          />
        </div>
      ))}
    </>
  );
}

export default UserFormFields;
