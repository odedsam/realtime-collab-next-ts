export const CheckSingleGray = () => (
  <svg
    className="h-4 w-4 text-gray-400"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
export const CheckDoubleGray = () => (
  <svg
    className="h-4 w-4 text-gray-400"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24">
    <path d="M20 6L9 17l-5-5" />
    <path d="M22 6L11 17l-5-5" />
  </svg>
);
export const CheckDoubleBlue = () => (
  <svg
    className="h-4 w-4 text-teal-400"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24">
    <path d="M20 6L9 17l-5-5" />
    <path d="M22 6L11 17l-5-5" />
  </svg>
);
export const FacebookIcon = () => <img src="/facebook-icon.svg" alt="Facebook" className="h-6 w-6" />;
export const GoogleIcon = () => {
  return (
    <svg className="h-6 w-6" viewBox="0 0 48 48">
      <path
        fill="#4285F4"
        d="M24 9.5c3.64 0 6.43 1.39 8.28 2.56l6.15-6.15C34.58 2.03 29.71 0 24 0 14.71 0 6.9 5.39 2.82 13.23l7.32 5.69C13.13 12.08 18.02 9.5 24 9.5z"
      />
      <path
        fill="#34A853"
        d="M46.9 24.48c0-1.49-.13-2.92-.37-4.31H24v8.18h13.06c-.6 3.18-2.24 5.83-4.63 7.63l7.26 5.62C44.18 36.69 46.9 31.14 46.9 24.48z"
      />
      <path
        fill="#FBBC05"
        d="M11.54 28.04c-.55-1.56-.85-3.22-.85-4.96s.3-3.4.85-4.96L4.18 12.45C2.54 15.78 1.6 19.33 1.6 23.08s.94 7.3 2.58 10.63l7.36-5.67z"
      />
      <path
        fill="#EA4335"
        d="M24 46c5.73 0 10.47-1.85 13.96-5.03l-7.26-5.62c-2.03 1.36-4.62 2.17-7.47 2.17-5.98 0-11.06-3.87-12.89-9.2l-7.32 5.67C6.91 40.62 14.72 46 24 46z"
      />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  );
};
