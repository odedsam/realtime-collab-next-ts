export default function Footer() {
  return (
    <footer className="border-t border-zinc-700 bg-zinc-900 shadow-md py-10 text-sm text-yellow-200">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <p>© {new Date().getFullYear()} RealTimeCollab. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">
            Privacy
          </a>
          <a href="#" className="hover:text-white">
            Terms
          </a>
          <a href="#" className="hover:text-white">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
