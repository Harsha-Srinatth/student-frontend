import FloatingInput from "../shared/FloatingInput";
import DragDropUpload from "../shared/DragDropUpload";

const WorkshopForm = ({ formData, handleChange, handleFileSelect, imagePreview, handleRemoveImage, errors }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput
          label="Workshop Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Web Dev Bootcamp"
          required
          error={errors.title}
        />
        <FloatingInput
          label="Organizer"
          name="organizer"
          value={formData.organizer}
          onChange={handleChange}
          placeholder="e.g., IIT Bombay"
        />
        <FloatingInput
          label="Date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="date-input"
        />
        <FloatingInput
          label="Certificate URL"
          type="url"
          name="certificateUrl"
          value={formData.certificateUrl}
          onChange={handleChange}
          placeholder="https://drive.google.com/..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          Upload Image *
        </label>
        <DragDropUpload
          onFileSelect={handleFileSelect}
          preview={imagePreview}
          onRemove={handleRemoveImage}
          error={errors.image}
          fileName={formData.image?.name}
        />
      </div>
    </div>
  );
};

export default WorkshopForm;

