import FloatingInput from "../shared/FloatingInput";
import DragDropUpload from "../shared/DragDropUpload";

const CertificateForm = ({ formData, handleChange, handleFileSelect, imagePreview, handleRemoveImage, errors }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput
          label="Certificate Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Python Basics"
          required
          error={errors.title}
        />
        <FloatingInput
          label="Issuer"
          name="issuer"
          value={formData.issuer}
          onChange={handleChange}
          placeholder="e.g., Coursera"
        />
        <FloatingInput
          label="Date Issued"
          type="date"
          name="dateIssued"
          value={formData.dateIssued}
          onChange={handleChange}
          className="date-input"
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

export default CertificateForm;

