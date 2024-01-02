import {
  BugAntIcon,
  ChatBubbleLeftRightIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";

import supportImg from "../../../../assets/images/support.png";

export default function Contact() {
  return (
    <div className="isolate bg-white p-5 rounded-lg shadow relative overflow-hidden">
      <img
        src={supportImg}
        className="w-full h-full object-contain absolute top-0 left-0 blur-sm"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-white/50"></div>
      <div className="h-[360px] relative z-10">
        <div className="p-6 flex items-center justify-center h-full">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              24/7 Customer Support
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Access round-the-clock assistance from our dedicated support team.
              Get help whenever you need it to ensure a smooth and successful
              integration experience.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </a>
              <a
                href="#"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
