function MobileFilterDrawer({
  open,
  onClose,
  children,
}) {

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50">

      <div className="absolute left-0 top-0 w-80 h-full bg-white p-5 overflow-auto">

        <button
          onClick={onClose}
          className="mb-4"
        >
          Close
        </button>

        {children}

      </div>

    </div>
  );
}

export default MobileFilterDrawer;