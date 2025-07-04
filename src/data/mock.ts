export const guestDemoData = {
  document: {
    id: 'doc1',
    title: 'Welcome to the guest demo',
    content: `# Welcome to the guest demo

This document is a shared space where everyone can contribute live.

- Add your ideas freely
- Comment inline
- Chat with collaborators`,
  },

  collaborators: [
    {
      id: 'user1',
      name: 'Alice',
      avatar: 'https://api.dicebear.com/6.x/pixel-art/svg?seed=alice',
    },
    {
      id: 'user2',
      name: 'Bob',
      avatar: 'https://api.dicebear.com/6.x/pixel-art/svg?seed=bob',
    },
    {
      id: 'user3',
      name: 'Charlie',
      avatar: 'https://api.dicebear.com/6.x/pixel-art/svg?seed=charlie',
    },
  ],

  messages: [
    { id: 'm1', sender: 'Alice', recipient: 'You', content: 'Hi, welcome!' },
    { id: 'm2', sender: 'You', recipient: 'Alice', content: 'Thanks, Alice!' },
    { id: 'm3', sender: 'Bob', recipient: 'You', content: 'Hello from Bob' },
    { id: 'm4', sender: 'You', recipient: 'Bob', content: 'Hey Bob!' },
    { id: 'm5', sender: 'Charlie', recipient: 'You', content: 'Hi, I am Charlie' },
  ],

  info: {
    banner: 'This is a live collaborative demo - no signup required.',
    tips: [
      'Click on a collaborator to chat privately',
      'All messages are live and synced',
      'Try typing in the chat input',
      'Collaborators can see document changes live',
    ],
  },
};
