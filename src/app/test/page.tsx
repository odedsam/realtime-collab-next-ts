import { useState } from 'react';
import { Input, PasswordInput, CheckboxInput, RadioInput, Textarea, Select } from '@/components/ui';

export default function FormExample() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [gender, setGender] = useState('male');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('israel');

  return (
    <form className="max-w-md space-y-6">
      <Input
        id="username"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
      />

      <PasswordInput
        id="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
      />

      <CheckboxInput id="agree" label="I agree to the terms" checked={agree} onChange={(e) => setAgree(e.target.checked)} />

      <Textarea
        id="bio"
        label="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Tell us about yourself"
        rows={5}
        resize="vertical"
      />

      <Select
        id="country"
        label="Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        options={[
          { value: 'israel', label: 'Israel' },
          { value: 'usa', label: 'USA' },
          { value: 'uk', label: 'United Kingdom' },
          { value: 'canada', label: 'Canada' },
        ]}
      />
      <fieldset>
        <legend className="mb-2 font-semibold text-gray-700">Gender</legend>
        <RadioInput id="male" name="gender" label="Male" checked={gender === 'male'} onChange={() => setGender('male')} />
        <RadioInput id="female" name="gender" label="Female" checked={gender === 'female'} onChange={() => setGender('female')} />
      </fieldset>
    </form>
  );
}
