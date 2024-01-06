import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";

import {
  Typography,
  Button,
} from '@material-tailwind/react';

const ItemModal = ({ isOpen, onClose, onAdd }) => {
  const [itemIdInput, setItemIdInput] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setItemIdInput(""); // Reset input when modal closes
    }
  }, [isOpen]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Add Item
                </Dialog.Title>
                <div className="mt-2">
                  <BarcodeScannerComponent
                    width={500}
                    height={500}
                    onUpdate={(err, result) => {
                      if (result) setItemIdInput(result.text);
                      else setItemIdInput("");
                    }}
                  />
                  <input
                    type="text"
                    value={itemIdInput}
                    onChange={(e) => setItemIdInput(e.target.value)}
                    className="mt-2 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter Item ID"
                  />
                </div>
                <div className="mt-4">
                  <Button 
                    variant="outlined" 
                    size="sm" 
                    onClick={() => onAdd(itemIdInput)}
                  >
                    Add to Order
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ItemModal;