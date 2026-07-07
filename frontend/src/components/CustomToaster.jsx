
// import { Toaster} from "react-hot-toast";

import { Toaster, ToastBar, toast } from "react-hot-toast"; 
import { X } from 'lucide-react';



function CustomToaster() {


  return (

      <Toaster 
        position="top-right" 
        reverseOrder={false} 
        toastOptions={{
          success: {
            duration: 10000,
          },
          error: {
            duration: 10000,
          },
          info:{
            duration: 10000,
          },
          loading: {
            duration: Infinity,
          },
        }}
      >
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                {message}
                { (
                  <button 
                    onClick={() => toast.dismiss(t.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#9ca3af', // Subtle gray color
                      cursor: 'pointer',
                      padding: '4px',
                      marginLeft: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '4px',
                      transition: 'color 0.2s, background-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#374151'; // Darker gray on hover
                      e.currentTarget.style.backgroundColor = '#f3f4f6'; // Light background on hover
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#9ca3af';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    aria-label="Close notification"
                  >
                    <X size={16} strokeWidth={2.5} />
                  </button>
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
  );
}

export default CustomToaster;