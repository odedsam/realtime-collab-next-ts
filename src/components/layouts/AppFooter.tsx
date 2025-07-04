export default function Footer() {
  return (
    <footer className="py-10 text-sm text-teal-300 border-t border-zinc-700 bg-zinc-900">
      <div className="flex flex-col items-center justify-between max-w-6xl gap-4 px-4 mx-auto sm:flex-row">
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
