import { useEffect, useState } from "react";
import bookmarkService from "../../Services/bookmarkService";
import CreateFolder from "./CreateFolder";
import FolderMenu from "./FolderMenu";
import "./Folder.css";

export default function Folder({ onFolderChange }) {

    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [menuFolder, setMenuFolder] = useState(null);

    useEffect(() => {
        loadFolders();
    }, []);

    const loadFolders = async () => {
        try {
            const res = await bookmarkService.getFolders();
            const list = res.data.result || [];

            setFolders(list);

            if (list.length > 0) {
                setSelectedFolder(list[0]);
                loadPapers(list[0]);
            }

        } catch (err) {
            console.log(err);
        }
    };


    const loadPapers = async (folder) => {
        try {

            const res =
                await bookmarkService.getFolderPapers(folder.folderId);

            onFolderChange(
                folder,
                res.data.result || []
            );

        } catch (err) {
            console.log(err);
        }
    };


    const afterCreate = (folder) => {
        setFolders(prev => [
            ...prev,
            folder
        ]);

        setSelectedFolder(folder);
        setShowCreate(false);
    };


    return (
        <div className="folder-sidebar-wrapper">

            <h4 className="folder-title">
                COLLECTIONS
            </h4>

            <button
                className="folder-create-button"
                onClick={() => setShowCreate(true)}
            >
                + New Folder
            </button>


            <div className="folder-list">

                {
                    folders.length === 0 ?

                        <div className="folder-empty-text">
                            No Folder
                        </div>

                        :

                        folders.map(folder => (

                            <div
                                key={folder.folderId}
                                className={
                                    selectedFolder?.folderId === folder.folderId ? "folder-row active" : "folder-row"
                                }
                            >

                                <div
                                    className="folder-name-area"
                                    onClick={() => {
                                        setSelectedFolder(folder);
                                        loadPapers(folder);
                                    }}
                                >
                                    <span>
                                        {folder.folderName}
                                    </span>

                                    <span className="folder-total">
                                        {folder.totalPapers ?? 0}
                                    </span>
                                </div>

                                <button
                                    className="folder-menu-button"
                                    onClick={() =>
                                        setMenuFolder(
                                            menuFolder?.folderId === folder.folderId ? null : folder
                                        )
                                    }
                                >
                                    ...
                                </button>

                                {
                                    menuFolder?.folderId === folder.folderId &&
                                    <FolderMenu
                                        folder={folder}
                                        reload={loadFolders}
                                    />
                                }
                            </div>
                        ))
                }
            </div>

            {
                showCreate &&
                <CreateFolder
                    close={() => setShowCreate(false)}
                    onCreated={afterCreate}
                />
            }
        </div>
    )

}