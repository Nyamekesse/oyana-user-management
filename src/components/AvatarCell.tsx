import { useState } from 'react';
import type { User } from '../types';

function AvatarCell({ user }: { user: User }) {
  const [imgError, setImgError] = useState(false);
  const initials = `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase();

  return (
    <div className="user-cell">
      {user.avatar && !imgError ? (
        <img src={user.avatar} alt={`${user.first_name} ${user.last_name}`} className="avatar" onError={() => setImgError(true)} />
      ) : (
        <div className="avatar-fallback">{initials || '?'}</div>
      )}
      <div>
        <div className="user-name">
          {user.first_name} {user.last_name}
        </div>
        <div className="user-id">ID #{user.id}</div>
      </div>
    </div>
  );
}

export default AvatarCell;
