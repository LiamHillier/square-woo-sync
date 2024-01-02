import { useRef, useState } from "@wordpress/element";
import { toast } from "react-toastify";
import copy from "copy-to-clipboard";
import { getCurrentDomain } from "../../../../utils/general";

const Webhook = () => {
  const [hasCopied, setHasCopied] = useState(false);
  const textRef = useRef();

  const copyToClipboard = () => {
    let copyText = textRef.current.value;
    let isCopy = copy(copyText);
    if (isCopy) {
      toast.success("Copied to Clipboard");
      setHasCopied(true);
    }
  };

  return (
    <div className="px-4 py-5 sm:p-6">
      <h3 className="text-base font-semibold leading-6 text-gray-900 relative inline-block">
        Webhook URL{" "}
        <span className="left-[80%] absolute inline-flex items-center rounded-md bg-purple-50 px-1.5 py-0.5 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10 whitespace-nowrap -top-4 rotate-12">
          PRO ONLY
        </span>
      </h3>
      <div className="mt-2 max-w-xl text-sm text-gray-500">
        <p>
          The webhook URL is used to keep a live inventory sync between square
          and woocommerce. Copy this URL and paste it into your square developer
          webhook subscriptions. Read the following documentation on how to do
          this:
          <br></br>
          <a href="#" className="underline text-indigo-500">
            Setting up webhook url to retrieve inventory updates
          </a>
        </p>
      </div>
      <div className="max-w-xl flex items-center mt-4 blur">
        <input
          disabled
          id="webhookURL"
          ref={textRef}
          name="webhookURL"
          className="block disabled:text-gray-700 w-full !rounded-lg !border-0 !py-1.5 text-gray-900 !ring-1 !ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm !px-4 !leading-6"
          value={`https://${getCurrentDomain()}`}
        />
        <button
          type="button"
          onClick={copyToClipboard}
          className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto"
        >
          {!hasCopied ? "Copy" : "Copied!"}
        </button>
      </div>
    </div>
  );
};

export default Webhook;
