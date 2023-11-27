import { useState, Fragment, useRef } from "@wordpress/element";
import { Dialog } from "@headlessui/react";
import { classNames } from "../utils/classHelper";

const DialogWrapper = ({ children, open, onClose, className }) => {
  const initialFocusRef = useRef(null);

  return (
    <>
      <Dialog
        as="div"
        open={open}
        onClose={onClose} // Simply pass the function directly
        className="relative z-[99999]"
        initialFocus={initialFocusRef}
      >
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <Dialog.Panel className="w-screen h-screen flex items-center justify-center">
            <div
              className={classNames(
                "bg-white rounded-lg  p-6 transform shadow-xl transition-all",
                className
              )}
            >
              {children}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default DialogWrapper;
