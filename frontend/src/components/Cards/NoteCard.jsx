import React from 'react'
import { MdOutlinePushPin } from "react-icons/md"
import { MdCreate, MdDelete } from 'react-icons/md'




const NoteCard = ({
    title,
    date,
    content,
    tags,
    isPinned,
    onEdit,
    onDelete,
    onPinNote
}) => {
    return (
        <div className='border rounded p-4 bg-white hover:shadow-xl tarnsition-all ease-in-out'>
            <div className='flex items-center justify-between'>
                <div>
                    <h6 className='text-sm font-medium'>{title}</h6>
                    <span className='text-xs text-slate-500'>{date}</span>
                </div>

                <MdOutlinePushPin
                    className={`icon-btn text-xl text-slate-300 cursor-pointer hover:text-primary ${isPinned ? 'text-primary' : 'text-blue-500'}`}
                    onClick={onPinNote}
                />



            </div>
            <p className='text-xs text-slate-600 mt-2'>{content?.slice(0, 60)}</p>

            <div className='flex items-center justify-between mt-2'>
                <div className='text-xs text-slate-500'>{tags}</div>
                <div className='flex items-center gap-2'>
                    <MdCreate
                        className='text-xl text-slate-300 cursor-pointer hover:text-primary hover:text-green-600'
                        onClick={onEdit}
                    />
                    <MdDelete
                        className='text-xl text-slate-300 cursor-pointer hover:text-primary hover:text-red-600'
                        onClick={onDelete}
                    />
                </div>
            </div>
        </div>
    )
}

export default NoteCard
