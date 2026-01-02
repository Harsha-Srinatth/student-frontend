import FloatingInput from "../shared/FloatingInput";
import DragDropUpload from "../shared/DragDropUpload";

const InternshipForm = ({ formData, handleChange, handleFileSelect, imagePreview, handleRemoveImage, errors }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput
          label="Organization"
          name="organization"
          value={formData.organization}
          onChange={handleChange}
          placeholder="e.g., Microsoft"
          required
          error={errors.organization}
        />
        <FloatingInput
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="e.g., Software Intern"
          required
          error={errors.role}
        />
        <FloatingInput
          label="Start Date"
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="date-input"
        />
        <FloatingInput
          label="End Date"
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="date-input"
        />
      </div>
      <FloatingInput
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Describe your internship..."
        textarea
        rows={3}
      />
      <FloatingInput
        label="Recommendation Letter URL"
        type="url"
        name="recommendationUrl"
        value={formData.recommendationUrl}
        onChange={handleChange}
        placeholder="https://drive.google.com/..."
      />
      
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

export default InternshipForm;

