import React, { useState } from 'react';
import './Infra.css';

export default function InfraTechSetup() {
  const [formData, setFormData] = useState({
    audioVisual: {
      microphoneType: '',
      speakers: '',
    },
    facility: {
      airConditioning: '',
      numberOfACUnits: '',
      additionalVentilation: '',
    },
    presentation: {
      projectorScreen: '',
      whiteboard: '',
      additionalWritingMaterials: '',
    },
    recording: {
      photography: '',
      videography: '',
      professionalLighting: '',
      liveStreaming: '',
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [focusedFields, setFocusedFields] = useState({
    microphoneType: false,
    speakers: false,
    airConditioning: false,
    numberOfACUnits: false,
    additionalVentilation: false,
    projectorScreen: false,
    whiteboard: false,
    additionalWritingMaterials: false,
    photography: false,
    videography: false,
    professionalLighting: false,
    liveStreaming: false
  });

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleFocus = (field) => {
    setFocusedFields(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setFocusedFields(prev => ({ ...prev, [field]: false }));
  };

  const hasValue = (section, field) => formData[section][field] !== '';

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    // Get from localStorage
    const storedData = JSON.parse(localStorage.getItem('userData'));
    const eveId = localStorage.getItem('eventId');
    const userId = storedData?.user?._id;
    const eventId = eveId;

    if (!userId || !eventId) {
      setSubmitMessage({ text: 'User ID or Event ID not found in local storage.', type: 'error' });
      setIsSubmitting(false);
      return;
    }

    // Flatten the form data
    const payload = {
      eventId,
      userId,
      microphoneType: formData.audioVisual.microphoneType,
      speakers: formData.audioVisual.speakers,
      airConditioning: formData.facility.airConditioning,
      number_of_units: formData.facility.numberOfACUnits,
      additional_ventilation: formData.facility.additionalVentilation,
      projector_screen: formData.presentation.projectorScreen,
      whiteBoard: formData.presentation.whiteboard,
      additional_writing_material: formData.presentation.additionalWritingMaterials,
      photography: formData.recording.photography,
      videography: formData.recording.videography,
      professional_lighting: formData.recording.professionalLighting,
      live_streaming: formData.recording.liveStreaming
    };

    try {
      const response = await fetch('http://localhost:1045/event/infra-tech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save data');
      }
      alert('Form submitted!');
      setSubmitMessage({ text: 'Infrastructure & Technical Setup saved successfully!', type: 'success' });
    } catch (error) {
      setSubmitMessage({ text: `Error: ${error.message}`, type: 'error' });

    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInput = (section, field, label, type = 'select', options = [], disabled = false, name) => (
    <div className={`floating-label ${(focusedFields[field] || hasValue(section, field)) ? 'has-value' : ''}`}>
      {type === 'select' ? (
        <select
          name={name}
          value={formData[section][field]}
          onChange={(e) => handleChange(section, field, e.target.value)}
          onFocus={() => handleFocus(field)}
          onBlur={() => handleBlur(field)}
          required
          disabled={disabled}
        >
          <option value=""></option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          value={formData[section][field]}
          onChange={(e) => handleChange(section, field, e.target.value)}
          onFocus={() => handleFocus(field)}
          onBlur={() => handleBlur(field)}
          required={section !== 'facility' || formData.facility.airConditioning === 'Yes'}
          disabled={disabled}
        />
      )}
      <label>{label}</label>
    </div>
  );

  return (
    <div className="infra-container">
      <h2 className="section-title1">Infra & Technical Setup</h2>
      {submitMessage && (
        <div className={`submit-message ${submitMessage.type}`}>
          {submitMessage.text}
        </div>
      )}
      <form onSubmit={handleSave}>
        <h3 className="section-header">Audio-Visual Setup</h3>
        <div className="form-row">
          {renderInput('audioVisual', 'microphoneType', 'Microphone Type', 'select', ['Handheld', 'Collar', 'Both', 'Not Required'], false, 'microphoneType')}
          {renderInput('audioVisual', 'speakers', 'Speakers', 'select', ['Yes', 'No'], false, 'speakers')}
        </div>

        <h3 className="section-header">Facility & Comfort</h3>
        <div className="form-row">
          {renderInput('facility', 'airConditioning', 'Air Conditioning', 'select', ['Yes', 'No'], false, 'airConditioning')}
          {renderInput(
            'facility',
            'numberOfACUnits',
            'Number of AC Units',
            'number',
            [],
            formData.facility.airConditioning !== 'Yes',
            'number_of_units'
          )}
        </div>
        <div className="form-row">
          {renderInput('facility', 'additionalVentilation', 'Additional Ventilation', 'text', [], false, 'additional_ventilation')}
        </div>

        <h3 className="section-header">Presentation & Writing Materials</h3>
        <div className="form-row">
          {renderInput('presentation', 'projectorScreen', 'Projector & Screen', 'select', ['Yes', 'No'], false, 'projector_screen')}
          {renderInput('presentation', 'whiteboard', 'Whiteboard', 'select', ['Yes', 'No'], false, 'whiteBoard')}
        </div>
        <div className="form-row">
          {renderInput('presentation', 'additionalWritingMaterials', 'Additional Writing Materials', 'text', [], false, 'additional_writing_material')}
        </div>

        <h3 className="section-header">Recording & Documentation</h3>
        <div className="form-row">
          {renderInput('recording', 'photography', 'Photography', 'select', ['Yes', 'No'], false, 'photography')}
          {renderInput('recording', 'videography', 'Videography', 'select', ['Yes', 'No'], false, 'videography')}
        </div>
        <div className="form-row">
          {renderInput('recording', 'professionalLighting', 'Professional Lighting Setup', 'select', ['Yes', 'No'], false, 'professional_lighting')}
          {renderInput('recording', 'liveStreaming', 'Live Streaming', 'select', ['Yes', 'No'], false, 'live_streaming')}
        </div>

        <button type="submit" className="save-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}