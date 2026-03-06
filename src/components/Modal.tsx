interface ModalProps {
  title: string;
  subtitle: string;
  small?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  loading: boolean;
  submitLabel?: string;
  submitClassName?: string;
  children: React.ReactNode;
}

function Modal({
  title,
  subtitle,
  small,
  onClose,
  onSubmit,
  loading,
  submitLabel = 'Save Changes',
  submitClassName = 'btn-primary',
  children,
}: ModalProps) {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="overlay" onClick={handleOverlayClick}>
      <div className={`modal${small ? ' modal-sm' : ''}`}>
        <div className="modal-title">{title}</div>
        <div className={`modal-subtitle${small ? ' modal-subtitle-sm' : ''}`}>{subtitle}</div>
        {children}
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className={`btn ${submitClassName}`} onClick={onSubmit} disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Saving…' : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
