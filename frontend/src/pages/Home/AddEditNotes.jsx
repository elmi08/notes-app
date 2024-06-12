import React from 'react'
import TagInput from '../../components/Input/TagInput'
import { useState } from 'react'
import { MdClose } from "react-icons/md"
import axiosInstance from '../../utils/axiosinstance';


const AddEditNotes = ({ noteData, type, getAllNotes, onClose, setShowToastMessage }) => {

    const [title, setTitle] = useState(noteData?.title || "")
    const [content, setContent] = useState(noteData?.content || "")
    const [tags, setTags] = useState(noteData?.tags || [])

    const [error, setError] = useState(null)

    const addNewNote = async () => {
        try {
            const response = await axiosInstance.post('/add-note', {
                title,
                content,
                tags
            });
            if (response.data && !response.data.error) {
                setShowToastMessage('Note Added Successfully', 'success');
                await getAllNotes();
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
            const response = await axiosInstance.put('/edit-note/' + noteId, {
                title,
                content,
                tags
            });
            if (response.data && !response.data.error) {
                setShowToastMessage('Note Updated Successfully', 'success');
                await getAllNotes();
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            }
        }
    };

    const handleAddNote = () => {
        if (!title) {
            setError("Please enter a title")
            return
        }

        if (!content) {
            setError("Please enter a content")
            return
        }

        setError("")

        if (type === "edit") {
            editNote()
        } else {
            addNewNote()
        }
        onClose()
    }

    return (
        <div className='relative'>
            <button
                className='w-10 h-10 rounded-full items-center justify-center absolute -top3 -right-3 hover:bg-slate-50'
                onClick={onClose}
            >
                <MdClose className="text-xl text-slate-400" />
            </button>
            <div className='flex flex-col gap-2'>
                <label
                    className='text-xs text-slate-400'

                >TITLE</label>
                <input
                    type='text'
                    className='text-2xl text-slate-950 outline-none'
                    placeholder='Go to the Gym at 5'
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                />
            </div>
            <div className='flex flex-col gap-2 mt-4'>
                <label className='text-xs text-slate-400'>CONTENT</label>
                <textarea
                    type='text'
                    className='text-sn text-slate-950 outline-none bg-slate-50 p-2 rounded'
                    placeholder='content'
                    rows={10}
                    value={content}
                    onChange={({ target }) => setContent(target.value)}
                />
            </div>

            <div className='mt-3'>
                <label className='text-xs text-slate-400'>TAGS</label>
                <TagInput tags={tags} setTags={setTags} />
            </div>

            {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}
            <button className='bg-blue-500 hover:bg-blue-600 text-white font-medium mt-5 p-3 w-full rounded-lg'
                onClick={() => {
                    handleAddNote()
                    onClose()
                }}
            >
                {type === 'edit' ? 'UPDATE' : 'ADD'}
            </button>

        </div>
    )
}

export default AddEditNotes
