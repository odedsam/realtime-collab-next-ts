import type { ChatRoom } from "@/types/db";

const BASE_URL = `http://localhost:4000`


type ChatRoomUpdatePayload = Partial<Omit<ChatRoom, 'id' | 'createdAt' | 'updatedAt' | 'messages'>>;

export async function getChatRooms(): Promise<{ rooms: ChatRoom[]; error: string | null }> {
  try {
    const res = await fetch(`${BASE_URL}/chatrooms`);
    if (!res.ok) {
      if (res.status === 401) {
        return { rooms: [], error: 'Authentication required.' };
      }
      throw new Error(`Failed to fetch rooms: ${res.statusText}`);
    }

    const data = await res.json();

    return { rooms: data.rooms, error: null };
  } catch (err) {
    console.error('Error fetching chat rooms:', err);
    return { rooms: [], error: 'Could not load rooms.' };
  }
}

export async function getChatRoomById(id: string): Promise<{ room: ChatRoom | null; error: string | null }> {
  try {
    const res = await fetch(`${BASE_URL}/chatrooms/${id}`);
    if (!res.ok) {
      if (res.status === 404) {
        return { room: null, error: 'Room not found.' };
      }
      if (res.status === 401) {
        return { room: null, error: 'Authentication required.' };
      }
      throw new Error(`Failed to fetch room ${id}: ${res.statusText}`);
    }

    const room = await res.json();
    return { room, error: null };
  } catch (err) {
    console.error(`Error fetching chat room ${id}:`, err);
    return { room: null, error: 'Could not load room details.' };
  }
}

export async function createChatRoom(name: string): Promise<{ success: boolean; room?: ChatRoom; error: string | null }> {
  try {
    const res = await fetch(`${BASE_URL}/chatrooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`Failed to create room: ${errorData.message}`);
    }

    const newRoom = await res.json();
    return { success: true, room: newRoom, error: null };
  } catch (err) {
    console.error('Error creating chat room:', err);
    return { success: false, error: 'Failed to create room.' };
  }
}

export async function updateChatRoom(id: string, updates: ChatRoomUpdatePayload): Promise<{ success: boolean; room?: ChatRoom; error: string | null }> {
  try {
    const res = await fetch(`${BASE_URL}/chatrooms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      if (res.status === 404) {
        return { success: false, error: 'Room not found for update.' };
      }
      const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`Failed to update room ${id}: ${errorData.message}`);
    }

    const updatedRoom = await res.json();
    return { success: true, room: updatedRoom, error: null };
  } catch (err) {
    console.error(`Error updating chat room ${id}:`, err);
    return { success: false, error: 'Failed to update room.' };
  }
}

export async function deleteChatRoom(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const res = await fetch(`${BASE_URL}/chatrooms/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      if (res.status === 404) {
        return { success: false, error: 'Room not found for deletion.' };
      }
      const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`Failed to delete room ${id}: ${errorData.message}`);
    }



    return { success: true, error: null };
  } catch (err) {
    console.error(`Error deleting chat room ${id}:`, err);
    return { success: false, error: 'Failed to delete room.' };
  }
}
