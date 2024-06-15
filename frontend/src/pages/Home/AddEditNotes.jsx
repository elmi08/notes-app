import React, { useState } from 'react';
import TagInput from '../../components/Input/TagInput';
import { MdCancel } from 'react-icons/md';
import axiosInstance from '../../utils/axiosinstance';

const AddEditNotes = ({
  noteData,
  type,
  getAllNotes,
  onClose,
  setShowToastMessage,
}) => {
  const [title, setTitle] = useState(noteData?.title || '');
  const [content, setContent] = useState(noteData?.content || '');
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);

  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post('/add-note', {
        title,
        content,
        tags,
      });
      if (response.data && !response.data.error) {
        setShowToastMessage('Note Added Successfully', 'success');
        await getAllNotes();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
    }
  };

  const editNote = async () => {
    const noteId = noteData._id;

    try {
      const response = await axiosInstance.put(`/edit-note/${noteId}`, {
        title,
        content,
        tags,
      });
      if (response.data && !response.data.error) {
        setShowToastMessage('Note Updated Successfully', 'success');
        await getAllNotes();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError('Please enter a title');
      return;
    }

    if (!content) {
      setError('Please enter content');
      return;
    }

    setError('');

    if (type === 'edit') {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {type === 'edit' ? 'Edit Note' : 'Add New Note'}
        </h2>
        <button
          className="text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <MdCancel className="text-2xl" />
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-600">Title</label>
        <input
          type="text"
          className="px-3 py-2 border border-gray-300 rounded-lg outline-none text-gray-800"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label className="text-sm text-gray-600">Content</label>
        <textarea
          className="px-3 py-2 border border-gray-300 rounded-lg outline-none text-gray-800"
          placeholder="Enter content"
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <label className="text-sm text-gray-600">Tags</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <div className="flex justify-end mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg mr-2"
          onClick={handleAddNote}
        >
          {type === 'edit' ? 'Update' : 'Add'}
        </button>
        <button
          className="bg-red-500 hover:bg-red-400 text-white-800 font-medium py-2 px-4 rounded-lg"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddEditNotes;
