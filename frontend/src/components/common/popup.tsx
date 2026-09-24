const ConfirmPopup = ({ isOpen, title, message, onConfirm, onCancel }: { isOpen: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void }) => {
    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div className="popup">
                <h3>{title}</h3>
                <p>{message}</p>

                <div className="popup-actions">
                    <button onClick={onCancel}>No</button>
                    <button onClick={onConfirm}>Yes</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmPopup;