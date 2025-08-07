'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Buttons';

interface CreateRoomModalProps {
  onClose: () => void;
  onCreate: (name: string) => void;
}

export default function CreateRoomModal({ onClose, onCreate }: CreateRoomModalProps) {
  const [roomName, setRoomName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (roomName.trim().length === 0) {
      setError('Room name cannot be empty.');
      return;
    }
    onCreate(roomName.trim());
  };

  return (
    <div className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-full max-w-md rounded-xl bg-zinc-900 p-6 shadow-lg shadow-lime-500/60">
        <h2 className="mb-4 text-2xl font-bold text-lime-400">Create New Room</h2>
        <input
          autoFocus
          type="text"
          placeholder="Enter room name"
          className="w-full rounded-md border border-lime-600 bg-zinc-800 px-4 py-2 text-lime-300 placeholder-lime-600 focus:border-lime-400 focus:outline-none"
          value={roomName}
          onChange={(e) => {
            setRoomName(e.target.value);
            setError('');
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <Button
            onClick={onClose}
            className="rounded-md border border-lime-600 bg-transparent px-4 py-2 font-medium text-lime-400 hover:bg-lime-700/30">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="rounded-md bg-gradient-to-r from-lime-400 via-emerald-500 to-cyan-400 px-4 py-2 font-semibold text-zinc-900 shadow-lg shadow-lime-500/50 hover:scale-105">
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}
