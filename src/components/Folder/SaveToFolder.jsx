import { useEffect, useState } from "react";
import bookmarkService from "../../Services/bookmarkService";
import "./SaveToFolder.css";

export default function SaveToFolder({ paperId, close }) {
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [note, setNote] = useState("");
    const [createMode, setCreateMode] = useState(false);
    const [folderName, setFolderName] = useState("");

    useEffect(() => { loadFolders(); }, []);

    const loadFolders = async () => {
        try {
            const res =
                await bookmarkService.getFolders();
            const list =
                res.data.result || [];
            setFolders(list);

            if (list.length > 0)
                setSelectedFolder(list[0]);

        } catch (err) {
            console.log(err);
        }
    };

    const createFolder = async () => {
        if (!folderName)
            return;
        try {
            const res =
                await bookmarkService.createFolder(folderName);
            const newFolder =
                res.data.result;

            setFolders([
                ...folders,
                newFolder
            ]);

            setSelectedFolder(newFolder);
            setCreateMode(false);
        } catch (err) {
            console.log(err);
        }
    };

    const save = async () => {
        if (!selectedFolder)
            return;
        try {
            await bookmarkService.addPaperToFolder(selectedFolder.folderId, paperId, note);
            alert("Saved successfully");
            close();
        } catch (err) {
            console.log(err);
            alert("Save failed");
        }
    };
    return (
        <div className="save-folder-popup">
            <div className="save-folder-modal">
                <h2>Save paper</h2>
                {
                    createMode ?
                        <>

                            <input
                                placeholder="Folder name"
                                value={folderName}
                                onChange={
                                    e => setFolderName(e.target.value)
                                }

                            />

                            <button
                                onClick={createFolder}
                            >
                                Create
                            </button>

                        </>
                        :
                        <>
                            {
                                folders.length === 0 ?

                                    <button
                                        onClick={() => setCreateMode(true)}
                                    >
                                        + Create Folder
                                    </button>

                                    :

                                    <>

                                        <select
                                            className="folder-select"
                                            value={
                                                selectedFolder?.folderId || ""
                                            }
                                            onChange={
                                                e =>
                                                    setSelectedFolder(
                                                        folders.find(
                                                            f => f.folderId == e.target.value
                                                        )
                                                    )
                                            }

                                        >


                                            {
                                                folders.map(f => (
                                                    <option
                                                        key={f.folderId}
                                                        value={f.folderId}
                                                    >

                                                        {f.folderName}

                                                    </option>

                                                ))

                                            }

                                        </select>

                                        <textarea
                                            className="folder-note"
                                            placeholder="Note..."
                                            value={note}
                                            onChange={
                                                e => setNote(e.target.value)
                                            }
                                        />
                                        <button
                                            onClick={save}
                                        >
                                            Save
                                        </button>
                                    </>
                            }
                        </>
                }

                <button
                    onClick={close}
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}