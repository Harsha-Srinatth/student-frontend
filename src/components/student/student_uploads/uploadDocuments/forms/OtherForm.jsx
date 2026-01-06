import FloatingInput from "../shared/FloatingInput";
import DragDropUpload from "../shared/DragDropUpload";

const OtherForm = ({ formData, handleChange, handleFileSelect, imagePreview, handleRemoveImage, errors }) => {
  return (
    <div className="space-y-6">
      <FloatingInput
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="e.g., Competition Winner"
        required
        error={errors.title}
      />
      <FloatingInput
        label="Outcome"
        name="outcome"
        value={formData.outcome}
        onChange={handleChange}
        placeholder="e.g., First Place"
      />
      <FloatingInput
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Describe your achievement or activity..."
        textarea
        rows={4}
      />
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          Upload Image
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

export default OtherForm;

