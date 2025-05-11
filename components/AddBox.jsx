export default function AddBox({ title, fields, imagePreview, buttonLabel, onSubmit }) {
    return (
      <div className="border p-4 rounded bg-white shadow mb-6">
        <h2 className="font-semibold mb-2">{title}</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {fields}
        </div>
        {imagePreview && (
          <img
            src={imagePreview}
            alt="preview"
            className="mt-2 w-20 h-20 object-cover rounded"
          />
        )}
        <button
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-400 transition"
          onClick={onSubmit}
        >
          {buttonLabel}
        </button>
      </div>
    );
  }