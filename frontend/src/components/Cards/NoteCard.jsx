import React, { useState } from 'react';
import moment from 'moment';
import { MdOutlinePushPin, MdCreate, MdDelete } from 'react-icons/md';

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
    const [showFullContent, setShowFullContent] = useState(false);

    const toggleContent = () => {
        setShowFullContent(!showFullContent);
    };

    return (
        <div className="border rounded-lg overflow-hidden bg-white text-black shadow-md hover:shadow-lg transition-all duration-300 ease-in-out">
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h6 className="text-sm font-semibold">{title}</h6>
                        <span className="text-xs text-gray-500">{moment(date).format('Do MMM YYYY')}</span>
                    </div>
                    <MdOutlinePushPin
                        className={`text-xl cursor-pointer ${isPinned ? 'text-blue-500' : 'text-gray-400'} hover:text-blue-500 transition-colors duration-300`}
                        onClick={onPinNote}
                    />
                </div>
                <div className="mt-2">
                    {showFullContent ? (
                        <p className="text-sm text-gray-600">{content}</p>
                    ) : (
                        <p className="text-sm text-gray-600 overflow-hidden" style={{ maxHeight: '6em', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}>{content}</p>
                    )}
                    {content.length > 240 && !showFullContent && (
                        <button
                            className="text-blue-500 text-sm font-medium mt-2 focus:outline-none hover:underline"
                            onClick={toggleContent}
                        >
                            Read more
                        </button>
                    )}
                </div>

                <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-gray-500 flex flex-wrap gap-1">
                        {tags.map((item, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-500 text-white rounded-md">
                                #{item}
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <MdCreate
                            className="text-xl text-gray-400 cursor-pointer hover:text-green-600 transition-colors duration-300"
                            onClick={onEdit}
                        />
                        <MdDelete
                            className="text-xl text-gray-400 cursor-pointer hover:text-red-600 transition-colors duration-300"
                            onClick={onDelete}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NoteCard;
