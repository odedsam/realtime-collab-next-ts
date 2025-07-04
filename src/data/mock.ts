export const guestDemoData = {
  document: {
    title: 'Team Brainstorm Session',
    content: `# Welcome to the guest demo

This document is a shared space where everyone can contribute live.

- Add your ideas freely
- Comment inline
- Chat with collaborators`,
  },
  collaborators: [
    { id: 'u1', name: 'Alice Johnson', avatar: 'https://api.dicebear.com/6.x/bottts/svg?seed=alicejohnson' },
    { id: 'u2', name: 'Bob Smith', avatar: 'https://api.dicebear.com/6.x/bottts/svg?seed=bobsmith' },
    { id: 'u3', name: 'Charlie', avatar: 'https://api.dicebear.com/6.x/bottts/svg?seed=charlie' },
    { id: 'u4', name: 'Dana', avatar: 'https://api.dicebear.com/6.x/bottts/svg?seed=dana' },
  ],
  messages: [
    { id: 'm1', sender: 'Alice', content: 'Hey team! Ready to start?' },
    { id: 'm2', sender: 'Bob', content: 'Yes, let’s get those ideas flowing.' },
    { id: 'm3', sender: 'Dana', content: 'I added some notes on the new feature.' },
  ],
  info: {
    banner: 'You are viewing the guest demo. Sign up for full access!',
    tips: [
      'Click Try as Guest to join quickly',
      'Use the live chat to communicate',
      'All changes are synced in real-time',
      'Sign up to save your work permanently',
    ],
  },
};
