import {
  BugAntIcon,
  ChatBubbleLeftRightIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";

export default function Contact() {
  return (
    <div className="isolate bg-white p-5 rounded-lg shadow">
      <div className="">
        <h3 className="text-base font-semibold leading-6 text-gray-900 ">
          Support
        </h3>
        <p className="leading-8 text-gray-600">
          Aute magna irure deserunt veniam aliqua magna enim voluptate.
        </p>
      </div>
      <div className="mt-6 space-y-8">
        <div className="flex gap-x-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600">
            <ChatBubbleLeftRightIcon
              className="h-6 w-6 text-white"
              aria-hidden="true"
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold  text-gray-900">
              Sales/License support
            </h3>
            <p className="  text-gray-600">
              Ut cursus est ut amet. Lobortis eget egestas leo vitae eget
              porttitor risus blandit. Nunc a in lorem vel iaculis porttitor.
            </p>
            <p className="mt-4">
              <a href="#" className="text-sm font-semibold  text-indigo-600">
                Contact us <span aria-hidden="true">&rarr;</span>
              </a>
            </p>
          </div>
        </div>
        <div className="flex gap-x-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600">
            <BugAntIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-semibold  text-gray-900">
              Bug reports
            </h3>
            <p className="  text-gray-600">
              Expedita qui non ut quia ipsum voluptatum ipsam pariatur. Culpa
              vitae ipsum minus eius vero quo quibusdam.
            </p>
            <p className="mt-4">
              <a
                href="#"
                className="text-sm font-semibold leading-6 text-indigo-600"
              >
                Report a bug <span aria-hidden="true">&rarr;</span>
              </a>
            </p>
          </div>
        </div>
        <div className="flex gap-x-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600">
            <ComputerDesktopIcon
              className="h-6 w-6 text-white"
              aria-hidden="true"
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold  text-gray-900">
              Technical support
            </h3>
            <p className="  text-gray-600">
              Sint aut modi porro consequatur architecto commodi qui
              consequatur. Dignissimos adipisci minima.
            </p>
            <p className="mt-4">
              <a href="#" className="text-sm font-semibold  text-indigo-600">
                Join our Discord <span aria-hidden="true">&rarr;</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
