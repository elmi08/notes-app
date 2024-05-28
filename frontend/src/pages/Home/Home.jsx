import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd } from "react-icons/md";
import AddEditNotes from './AddEditNotes'
import Modal from "react-modal"

const Home = () => {

    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown: false,
        type: "add",
        data: null
    })



    return (
        <>
            <Navbar />
            <div className='container mx-auto relative min-h-screen'>
                <div className='grid grid-cols-3 gap-4 mt-8'>
                    <NoteCard
                        title="Meeting on 7th April"
                        date="3rd April 2024"
                        content="meeting on 7 April meeting on 7 April"
                        tags="#Meeting"
                        isPinned={true}
                        onEdit={() => { }}
                        onDelete={() => { }}
                        onPinNote={() => { }}
                    />

                </div>
            </div>
            <button
                className='w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-500 hover:bg-blue-600 text-white hover:text-white fixed bottom-10 right-10 z-50'
                onClick={() => {
                    setOpenAddEditModal({ isShown: true, type: 'add', data: null })
                }}
            >
                <MdAdd className='text-[32px]' />
            </button>

            <Modal
                isOpen={openAddEditModal.isShown}
                onRequestClose={() => setOpenAddEditModal({ isShown: false, type: 'add', data: null })}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0,0,0,0.5)",
                    },
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '20px',
                        borderRadius: '10px',
                        width: '40%',
                        maxHeight: '80vh',
                        overflow: 'hidden',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                    },
                }}
                contentLabel='Add/Edit Notes'
            >
                <AddEditNotes
                    type={openAddEditModal.type}
                    noteData={openAddEditModal.data}
                    onClose={() => {
                        setOpenAddEditModal({ isShown: false, type: "add", data: null })
                    }}
                />
            </Modal>
        </>
    );
}

export default Home;
