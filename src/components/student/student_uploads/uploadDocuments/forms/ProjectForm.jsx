import FloatingInput from "../shared/FloatingInput";
import DragDropUpload from "../shared/DragDropUpload";

const ProjectForm = ({ formData, handleChange, handleFileSelect, imagePreview, handleRemoveImage, errors }) => {
  return (
    <div className="space-y-6">
      <FloatingInput
        label="Project Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="e.g., AI Chatbot"
        required
        error={errors.title}
      />
      <FloatingInput
        label="Outcome"
        name="outcome"
        value={formData.outcome}
        onChange={handleChange}
        placeholder="e.g., Deployed on cloud"
      />
      <FloatingInput
        label="Technologies (comma separated)"
        name="technologies"
        value={formData.technologies}
        onChange={handleChange}
        placeholder="React, Node.js"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput
          label="Repository Link"
          type="url"
          name="repoLink"
          value={formData.repoLink}
          onChange={handleChange}
          placeholder="https://github.com/..."
        />
        <FloatingInput
          label="Demo Link"
          type="url"
          name="demoLink"
          value={formData.demoLink}
          onChange={handleChange}
          placeholder="https://project-demo.com"
        />
      </div>
      <FloatingInput
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Describe your project..."
        textarea
        rows={3}
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

export default ProjectForm;

