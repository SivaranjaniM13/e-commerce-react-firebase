import React, { useState } from 'react';

const FloatingHelpButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 z-50"
      >
        ?
      </button>

      {/* Help Box */}
      {open && (
        <div className="fixed bottom-20 right-6 w-64 bg-white border rounded-xl shadow-xl p-4 z-50">
          <h3 className="text-lg font-semibold text-gray-700">Need Help?</h3>
          <p className="text-sm text-gray-600 mt-1">
            Contact us on <a href="https://wa.me/91XXXXXXXXXX" className="text-indigo-600 underline">WhatsApp</a> or email us at <span className="font-medium">support@yourshop.com</span>
          </p>
        </div>
      )}
    </>
  );
};

export default FloatingHelpButton;
