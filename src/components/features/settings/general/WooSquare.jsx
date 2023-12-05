import { useEffect, useState } from "@wordpress/element";

const WooSquare = ({ settings, updateSettings, settingsLoading }) => {
  const [wooSquare, setWooSquare] = useState({ ...settings.wooAuto });

  useEffect(() => {
    setWooSquare(settings.wooAuto);
  }, [settings]);

  const CheckboxItem = ({ id, label, checked, squareWoo }) => {
    return (
      <li className="w-auto mb-0">
        <div className="flex items-center gap-2 p-4">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={() =>
              updateSettings("wooAuto", {
                ...wooSquare,
                [id]: !checked,
              })
            }
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
    { id: "stock", label: "Stock", checked: wooSquare.stock },
    { id: "title", label: "Title", checked: wooSquare.title },
    { id: "price", label: "Price", checked: wooSquare.price },
    {
      id: "description",
      label: "Description",
      checked: wooSquare.description,
    },
    { id: "images", label: "Images", checked: wooSquare.images },
    { id: "category", label: "Category", checked: wooSquare.category },
  ];

  return (
    <div className="px-4 pb-5 sm:px-6">
      <div className="mb-6">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={wooSquare.isActive}
            onChange={() => {
              updateSettings("wooAuto", {
                ...wooSquare,
                isActive: !wooSquare.isActive,
              });
            }}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-700 ">
            Woo to Square
          </span>
        </label>
        {wooSquare.isActive && !settingsLoading && (
          <>
            <ul className="fit-content flex-wrap items-center justify-start text-sm font-medium text-gray-900 bg-white  sm:flex my-3">
              {checkboxItems.map((item) => (
                <CheckboxItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  checked={item.checked}
                  squareWoo={wooSquare}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default WooSquare;
