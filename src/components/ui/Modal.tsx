'use client';
import { useState } from 'react';

export interface ModalProps {
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose: () => void;
  type: 'alert' | 'confirm' | 'prompt';
  defaultValue?: string;
  onPromptSubmit?: (value: string) => void;
}

export const Modal: React.FC<ModalProps> = ({
  message = 'defaultMessage',
  onConfirm,
  onCancel,
  onClose,
  type,
  defaultValue = 'defaultValue',
  onPromptSubmit,
}) => {
  const [inputValue, setInputValue] = useState(defaultValue);

  const handleConfirm = () => {
    if (type === 'prompt' && onPromptSubmit) {
      onPromptSubmit(inputValue);
    } else if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <p className="mb-4 text-lg text-gray-800">{message}</p>
        {type === 'prompt' && (
          <input
            type="text"
            className="mb-4 w-full rounded border border-gray-300 p-2 text-black focus:border-blue-500 focus:ring-blue-500"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        )}
        <div className="flex justify-end space-x-3">
          {type === 'confirm' && (
            <button onClick={handleCancel} className="cursor-pointer rounded-md bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400">
              Cancel
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`cursor-pointer rounded-md px-4 py-2 text-white ${
              type === 'alert' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
            }`}>
            {type === 'prompt' ? 'Submit' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
};

//basic usage : {/* <Modal message="confirm" type="alert" onClose={()=>console.log('closed') } /> */}
