function SkeletonRow() {
  return (
    <tr>
      <td>
        <div className="user-cell">
          <div className="skeleton skeleton-avatar" />
          <div>
            <div className="skeleton" style={{ width: 120, height: 13, marginBottom: 6 }} />
            <div className="skeleton" style={{ width: 60, height: 11 }} />
          </div>
        </div>
      </td>
      <td>
        <div className="skeleton" style={{ width: 180, height: 13 }} />
      </td>
      <td>
        <div className="skeleton" style={{ width: 60, height: 22, borderRadius: 20 }} />
      </td>
      <td />
    </tr>
  );
}

export default SkeletonRow;
