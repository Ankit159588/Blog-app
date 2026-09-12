import { CircleAlert } from "lucide-react";
import { useState, useEffect } from "react";

const ErrorToast = ({ message, duration = 5, onClose }) => {
  const [time, setTime] = useState(duration);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          onClose();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onClose]);

  return (
    <div className="error-toast">
      <div className="error-content">
        <CircleAlert className="error-icon" onClick={onclose} size={20} />
        <div>
          <p className="error-message">{message}</p>
          <small>Disappearing in {time}s</small>
        </div>
      </div>

      <div className="error-progress"></div>
    </div>
  );
};

export default ErrorToast;
