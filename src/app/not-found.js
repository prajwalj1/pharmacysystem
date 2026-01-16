import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        {/* Large 404 Visual */}
        <p className="text-base font-semibold text-indigo-600">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Page not found
        </h1>
        
        {/* Helper Text */}
        <p className="mt-4 text-base leading-7 text-gray-600 max-w-lg mx-auto">
          Sorry, we couldn’t find the page you’re looking for. It might have been removed, renamed, or currently unavailable.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200"
          >
            Go back home
          </Link>
          
          <Link 
            href="/contact" 
            className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition-colors duration-200"
          >
            Contact support <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
      
      {/* Optional: Subtle footer styling if you aren't using a global layout */}
      <div className="mt-12">
        <p className="text-xs text-gray-400">
           Error Code: 404 NOT_FOUND
        </p>
      </div>
    </div>
  );
}