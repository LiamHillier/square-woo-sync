import { useEffect, useState } from "@wordpress/element";

const SquareWoo = ({ settings, updateSettings, settingsLoading }) => {
  const [squareWoo, setSquareWoo] = useState({ ...settings.squareAuto });

  useEffect(() => {
    setSquareWoo(settings.squareAuto);
  }, [settings]);

  const CheckboxItem = ({ id, label, checked, squareWoo, setShowProMsg }) => {
    return (
      <li className="w-auto mb-0">
        <div className="flex items-center gap-2 p-4">
          <input
            id={id}
            type="checkbox"
            checked={false}
            onClick={() => setShowProMsg(true)}
            className="!m-0 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 leading-normal"
          />
          <label
            htmlFor={id}
            className="w-full text-sm font-light text-gray-700 leading-normal"
          >
            {label}
          </label>
        </div>
      </li>
    );
  };

  const checkboxItems = [
    { id: "stock", label: "Stock", checked: squareWoo.stock },
    { id: "title", label: "Title", checked: squareWoo.title },
    { id: "price", label: "Price", checked: squareWoo.price },
    {
      id: "description",
      label: "Description",
      checked: squareWoo.description,
    },
    { id: "images", label: "Images", checked: squareWoo.images },
    { id: "category", label: "Category", checked: squareWoo.category },
  ];

  const [showProMsg, setShowProMsg] = useState(false);
  return (
    <div className="px-4 pb-5 sm:px-6 mt-10">
      <h3 className="text-base font-semibold leading-6 text-gray-900 relative inline-block">
        Automatic Syncing{" "}
        <span className="left-[80%] absolute inline-flex items-center rounded-md bg-purple-50 px-1.5 py-0.5 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10 whitespace-nowrap -top-4 rotate-12">
          PREMIUM ONLY
        </span>
      </h3>
      <div className="mt-2 max-w-xl text-sm text-gray-500 mb-4">
        <p>
          Enable or disable automatic inventory syncing between WooCommerce and
          Square effortlessly with our Inventory Sync Toggle. Streamline your
          product management with ease.
          <br></br>
          <a href="#" className="underline text-indigo-500">
            How to setup and control automatic syncing between Square and
            Woocommerce
          </a>
        </p>
      </div>
      <div className="">
        <label className="relative inline-flex items-center cursor-pointer justify-start">
          <input
            type="checkbox"
            checked={false}
            className="sr-only peer"
            onClick={() => setShowProMsg(true)}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-700 ">
            Square to woo (Webhook must be setup)
          </span>
        </label>

        <>
          <ul className="text-sm font-medium text-gray-900 bg-white my-3 flex flex-wrap fit-content">
            {checkboxItems.map((item) => (
              <CheckboxItem
                key={item.id}
                id={item.id}
                label={item.label}
                checked={false}
                setShowProMsg={setShowProMsg}
              />
            ))}
          </ul>
        </>
        {showProMsg && (
          <p className="text-red-500 mt-2">
            This feature is only avaiable to premium subscribers
          </p>
        )}
      </div>
    </div>
  );
};

export default SquareWoo;
