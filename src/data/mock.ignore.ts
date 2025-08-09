export const guestDemoData = {
  document: {
    id: 'demo-doc',
    title: ' AI Brainstorm – July 2025',
    content: `
# AI Product Brainstorming Document

---

##  Future Features:
- Multimodal Input (Voice, Image, Video)
- Real-time AI Pair Programming
- Personalized GPTs for teams
- Browser Automation with Language

##  Technical Ideas:
- Edge inference with WASM + quantized models
- Real-time vector search in local memory
- WebRTC AI voice streaming
- Incremental CRDT syncing (low-latency)

##  Collaboration Ideas:
- Typing presence avatars
- Real-time suggestion feedback
- Timed comment threads
- “Explain this section” via GPT shortcut

##  Product Vision:
> *“One workspace. Infinite minds.”*

A shared space where humans and AI co-create – fully in sync.

---

##  Hot Topics:
- [ ] Ownership of AI content
- [ ] Ethical watermarking
- [ ] AI Assistants in regulated fields
- [ ] Cost of constant inference
- [ ] Does Gen-Z want a desktop tool?

---

##  Weekly Goals:
- [x] Live typing sync
- [x] Document versioning
- [ ] AI summarizer (WIP)
- [ ] Plugin support (beta)

---

##  Notes:
> Alice: “Try integrating Whisper for voice”
> Ben: “Latency under 100ms is killer”
> Guest9423: “This UI slaps ”
    `.trim(),
    lastUpdated: new Date().toISOString(),
  },
  collaborators: [
    { id: '1', name: 'Alice', avatar: '/avatars/alice.png', role: 'Editor' },
    { id: '2', name: 'Ben', avatar: '/avatars/ben.png', role: 'Viewer' },
    { id: '3', name: 'Clara', avatar: '/avatars/clara.png', role: 'Editor' },
    { id: 'guest', name: 'Guest9423', avatar: null, role: 'Guest' },
  ],
  messages: [
    {
      id: 'msg-1',
      sender: 'Alice',
      content: 'Whisper integration sounds ',
      timestamp: Date.now() - 1000 * 60 * 8,
    },
    {
      id: 'msg-2',
      sender: 'Clara',
      content: 'I’ll set up the plugin scaffold.',
      timestamp: Date.now() - 1000 * 60 * 5,
    },
    {
      id: 'msg-3',
      sender: 'Guest9423',
      content: 'Can guests save changes?',
      timestamp: Date.now() - 1000 * 60 * 3,
    },
    {
      id: 'msg-4',
      sender: 'Ben',
      content: 'Nope, but they can view and chat 👀',
      timestamp: Date.now() - 1000 * 60 * 2,
    },
  ],
  info: {
    guestMode: true,
    banner:
      ' You’re in Guest Mode. Viewing only. Sign in to create and edit your own documents.',
    tips: [
      ' Brainstorm live with your team',
      ' Chat with collaborators',
      ' Sign in to save and share',
      ' Experience real-time presence',
    ],
  },
}
