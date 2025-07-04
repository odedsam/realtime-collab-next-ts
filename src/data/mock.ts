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
    { id: 'user1', name: 'Alice', avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=George' },
    { id: 'user2', name: 'Emery', avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Emery' },
    { id: 'user3', name: 'Alexander', avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Alexander' },
    { id: 'user4', name: 'Liam', avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Liam' },
    { id: 'user5', name: 'Mason', avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Mason' },
    { id: 'user6', name: 'Easton', avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Easton' },
  ],

  messages: [
    { id: 'm1', sender: 'Alice', recipient: 'You', content: 'Hi, welcome!' },
    { id: 'm2', sender: 'You', recipient: 'Alice', content: 'Thanks, Alice!' },
    { id: 'm3', sender: 'Emery', recipient: 'You', content: 'Hello from Emery' },
    { id: 'm4', sender: 'You', recipient: 'Emery', content: 'Hey Emery!' },
    { id: 'm5', sender: 'Alexander', recipient: 'You', content: 'Hi, I am Alexander' },
    { id: 'm6', sender: 'Liam', recipient: 'You', content: 'Hey there, Liam here!' },
    { id: 'm7', sender: 'You', recipient: 'Liam', content: 'Welcome Liam!' },
    { id: 'm8', sender: 'Mason', recipient: 'You', content: 'Mason joined the chat.' },
    { id: 'm9', sender: 'You', recipient: 'Mason', content: 'Good to have you, Mason!' },
    { id: 'm10', sender: 'Easton', recipient: 'You', content: 'Easton says hi!' },
    { id: 'm11', sender: 'You', recipient: 'Easton', content: 'Hey Easton, welcome!' },
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


