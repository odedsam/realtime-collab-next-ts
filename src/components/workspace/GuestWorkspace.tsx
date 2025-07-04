'use client';
import { useState } from 'react';
import DocumentView from './DocumentView';
import ChatPanel from './ChatPanel';
import { guestDemoData } from '@/data/mock';
import CollaboratorsSidebar from './Sidebar';

export default function GuestWorkspace() {
  const { document, collaborators, messages, info } = guestDemoData;
  const [activeChatUser, setActiveChatUser] = useState<string | null>(null);
  const activeUserObj = collaborators.find((c) => c.id === activeChatUser);

  return (
    <div className="flex h-full min-h-screen overflow-hidden font-sans text-gray-100 shadow-xl rounded-2xl bg-zinc-900">
      <CollaboratorsSidebar collaborators={collaborators} onSelectUser={setActiveChatUser} activeUserId={activeChatUser} />

      <main className="flex flex-col flex-1">
        <DocumentView content={document.content} />
        {activeChatUser ? (
          <ChatPanel initialMessages={messages} chatUser={activeChatUser} chatUserName={activeUserObj?.name} />
        ) : (
          <section className="flex items-center justify-center flex-1 text-gray-400 rounded-br-2xl rounded-bl-2xl bg-zinc-900">
            <p>בחר משתמש מהצד לשיחה פרטית</p>
          </section>
        )}
      </main>
    </div>
  );
}
