import { BookOpen, Save, ArrowLeft, Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const PostNewTuition = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Check if user is authenticated
  useEffect(() => {
    if (!currentUser) {
      toast.error('Please login to post a tuition');
      navigate('/login');
    }
  }, [currentUser, navigate]);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    class: '',
    location: '',
    budget: '',
    schedule: '',
    description: '',
    requirements: [],
  });
  const [requirementInput, setRequirementInput] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddRequirement = () => {
    if (requirementInput.trim()) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, requirementInput.trim()],
      });
      setRequirementInput('');
    }
  };

  const handleRemoveRequirement = (index) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.subject || !formData.class || !formData.location || !formData.budget || !formData.schedule || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post('/api/tuitions', formData);
      toast.success('Tuition post created successfully! Waiting for admin approval.');
      navigate('/dashboard/tuitions');
    } catch (error) {
      console.error('Error creating tuition:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to create tuition post');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <BookOpen className="text-primary" size={40} />
            Post New Tuition
          </h1>
          <p className="text-base-content/70">Create a new tuition post to find qualified tutors</p>
        </div>
        <Link to="/dashboard/tuitions" className="btn btn-ghost">
          <ArrowLeft size={20} />
          Back to Tuitions
        </Link>
      </div>

      {/* Form */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Title <span className="text-error">*</span></span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Class 9-10 Mathematics Tuition"
                className="input input-bordered w-full bg-base-100"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Subject and Class */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Subject <span className="text-error">*</span></span>
                </label>
                <input
                  type="text"
                  name="subject"
                  placeholder="e.g., Mathematics, Physics, English"
                  className="input input-bordered w-full bg-base-100"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Class <span className="text-error">*</span></span>
                </label>
                <input
                  type="text"
                  name="class"
                  placeholder="e.g., 9-10, 11-12, 6-8"
                  className="input input-bordered w-full bg-base-100"
                  value={formData.class}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Location and Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Location <span className="text-error">*</span></span>
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g., Dhanmondi, Dhaka"
                  className="input input-bordered w-full bg-base-100"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Budget (per month) <span className="text-error">*</span></span>
                </label>
                <input
                  type="text"
                  name="budget"
                  placeholder="e.g., 5000-7000 or 6000"
                  className="input input-bordered w-full bg-base-100"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                />
                <label className="label">
                  <span className="label-text-alt">Enter range (e.g., 5000-7000) or single amount</span>
                </label>
              </div>
            </div>

            {/* Schedule */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Schedule <span className="text-error">*</span></span>
              </label>
              <input
                type="text"
                name="schedule"
                placeholder="e.g., Saturday & Sunday, 4 PM - 6 PM"
                className="input input-bordered w-full bg-base-100"
                value={formData.schedule}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Description <span className="text-error">*</span></span>
              </label>
              <textarea
                name="description"
                className="textarea textarea-bordered w-full h-32 bg-base-100"
                placeholder="Describe the tuition requirements, student's needs, teaching style preferences, etc."
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {/* Requirements */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Requirements (Optional)</span>
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="input input-bordered flex-1 bg-base-100"
                  placeholder="Add a requirement (e.g., Minimum 3 years experience)"
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddRequirement();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddRequirement}
                  className="btn btn-primary"
                >
                  <Plus size={20} />
                  Add
                </button>
              </div>
              {formData.requirements.length > 0 && (
                <div className="space-y-2">
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-base-300 rounded-lg">
                      <span className="flex-1">{req}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRequirement(index)}
                        className="btn btn-ghost btn-xs"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="card-actions justify-end">
              <Link to="/dashboard/tuitions" className="btn btn-ghost">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <>
                    <Save size={20} />
                    Post Tuition
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostNewTuition;

