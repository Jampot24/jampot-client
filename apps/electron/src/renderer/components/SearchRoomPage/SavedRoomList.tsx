import { useLikedRooms } from '@electron/renderer/hooks/SearchRoom/useLikedRooms';
import { useToggleLike } from '@electron/renderer/hooks/SearchRoom/useToggleLike';
import { RoomCard } from '@repo/ui';

import { useNavigate } from 'react-router-dom';

export const SavedRoomList = () => {
  const { roomList, removeRoomFromList } = useLikedRooms();
  const { toggleLike } = useToggleLike();
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      {roomList.map((room) => (
        <RoomCard
          key={room.playRoomId}
          imgUrl={room.imgUrl}
          name={room.name}
          genre={room.genre}
          remainSessions={room.remainSessions}
          isLiked={room.isLiked}
          onClick={() => navigate(`/room/${room.playRoomId}`)}
          onLike={() =>
            toggleLike(room.playRoomId, room.isLiked, () => {
              removeRoomFromList(room.playRoomId);
            })
          }
        />
      ))}
    </div>
  );
};
