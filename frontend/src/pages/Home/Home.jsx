import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd } from "react-icons/md";
import AddEditNotes from './AddEditNotes';
import Modal from "react-modal";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosinstance';
import Toast from '../../components/ToastMessage/Toast';
import EmptyCard from '../../components/EmptyCard/EmptyCard';
import NoDataImg from '../../assets/images/no-notes.jpg'
import AddNotesImg from '../../assets/images/add-note.jpg'

const Home = () => {
    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown: false,
        type: "add",
        data: null
    });

    const [showToastMsg, setShowToastMsg] = useState({
        isShown: false,
        message: "",
        type: 'add',
    });

    const [userInfo, setUserInfo] = useState(null);
    const [allNotes, setAllNotes] = useState([]);
    const [isSearch, setIsSearch] = useState(false);
    const [loading, setLoading] = useState(true); // Add loading state

    const navigate = useNavigate();

    const handleEdit = (noteDetails) => {
        setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
    };

    const setShowToastMessage = (message, type) => {
        setShowToastMsg({
            isShown: true,
            message,
            type
        });
    };

    const handleCloseToast = () => {
        setShowToastMsg({
            isShown: false,
            message: ""
        });
    };

    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get('/get-user');
            if (response.data && response.data.user) {
                setUserInfo(response.data.user);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.clear();
                navigate('/login');
            } else {
                console.error("An error occurred:", error);
            }
        }
    };

    const getAllNotes = async () => {
        setLoading(true); // Set loading to true before fetching data
        try {
            const response = await axiosInstance.get("/get-notes");
            if (response.data && response.data.notes) {
                setAllNotes(response.data.notes);
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error);
        }
        setLoading(false); // Set loading to false after data is fetched
    };

    const deleteNote = async (data) => {
        const noteId = data._id;
        try {
            const response = await axiosInstance.delete('/delete-note/' + noteId);
            if (response.data && !response.data.error) {
                setShowToastMessage('Note Deleted Successfully', 'delete');
                await getAllNotes();
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                console.error('An unexpected error occurred:', error);
            }
        }
    };

    const onSearchNote = async (query) => {
        try {
            const response = await axiosInstance.get("/search-notes", {
                params: { query }
            });

            if (response.data && response.data.notes) {
                setIsSearch(true);
                setAllNotes(response.data.notes);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const updateIsPinned = async (noteData) => {
        const noteId = noteData._id;

        try {
            const response = await axiosInstance.put(`update-note-pinned/${noteId}`, {
                isPinned: noteData.isPinned
            });
            if (response.data && !response.data.error) {
                setShowToastMessage('Note Updated Successfully', 'success');
                await getAllNotes();
            }
        } catch (error) {
            console.log(error);
        }
    }


    const handleClearSearch = () => {
        setIsSearch(false);
        getAllNotes();
    };

    useEffect(() => {
        getAllNotes();
        getUserInfo();
    }, []);

    return (
        <>
            <Navbar
                userInfo={userInfo}
                onSearchNote={onSearchNote}
                handleClearSearch={handleClearSearch}
            />
            <div className='relative min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600'>
                <div className='p-6'>
                    {loading ? ( // Conditionally render loading spinner or message
                        <div className='flex justify-center items-center min-h-screen'>
                            <p className='text-white'>Loading...</p>
                        </div>
                    ) : (
                        allNotes.length > 0 ? (
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {allNotes.map((item) => (
                                    <NoteCard
                                        key={item._id}
                                        title={item.title}
                                        date={item.createdOn}
                                        content={item.content}
                                        tags={item.tags}
                                        isPinned={item.isPinned}
                                        onEdit={() => handleEdit(item)}
                                        onDelete={() => deleteNote(item)}
                                        onPinNote={() => updateIsPinned(item)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyCard
                                imgSrc={isSearch ? NoDataImg : AddNotesImg}
                                message={isSearch ? 'Ooops! No Notes Found Matching Your Search' : 'Create Your First Note! Click the + Icon at the Bottom Right Corner'}
                            />
                        )
                    )}
                </div>
            </div>

            <button
                className='w-16 h-16 flex items-center justify-center rounded-2xl bg-white text-blue-500 hover:bg-gray-200 hover:text-blue-500 fixed bottom-10 right-10 z-50'
                onClick={() => {
                    setOpenAddEditModal({ isShown: true, type: 'add', data: null });
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
                    getAllNotes={getAllNotes}
                    onClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
                    setShowToastMessage={setShowToastMessage}
                />
            </Modal>
            <Toast
                isShown={showToastMsg.isShown}
                message={showToastMsg.message}
                type={showToastMsg.type}
                onClose={handleCloseToast}
            />
        </>
    );
};

export default Home;
