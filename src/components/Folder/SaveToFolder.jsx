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
            const res = await bookmarkService.getFolders();
            const list = res.data.result || [];
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
            await bookmarkService.createFolder(folderName);
            // Re-fetch folders from DB to avoid empty result crash
            const res = await bookmarkService.getFolders();
            const list = res.data.result || [];
            setFolders(list);

            const created = list.find(f => f.folderName === folderName) || list[list.length - 1];
            if (created) {
                setSelectedFolder(created);
            }
            setCreateMode(false);
            setFolderName("");
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
                <h2>Save Paper</h2>
                {createMode ? (
                    <div className="create-folder-form">
                        <label className="form-label">Folder Name</label>
                        <input
                            type="text"
                            placeholder="Enter new folder name..."
                            value={folderName}
                            onChange={e => setFolderName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    createFolder();
                                }
                            }}
                            className="folder-input"
                        />
                        <div className="modal-actions">
                            <button className="save-btn" onClick={createFolder}>
                                Create Folder
                            </button>
                            <button className="cancel-btn" onClick={() => setCreateMode(false)}>
                                Back
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="save-paper-form">
                        {folders.length === 0 ? (
                            <div className="no-folders-container">
                                <p>No folders found. Create one to save this paper.</p>
                                <button className="save-btn" onClick={() => setCreateMode(true)}>
                                    + Create Folder
                                </button>
                            </div>
                        ) : (
                            <>
                                <label className="form-label">Select Folder</label>
                                <select
                                    className="folder-select"
                                    value={selectedFolder?.folderId || ""}
                                    onChange={e =>
                                        setSelectedFolder(folders.find(f => f.folderId == e.target.value))
                                    }
                                >
                                    {folders.map(f => (
                                        <option key={f.folderId} value={f.folderId}>
                                            {f.folderName}
                                        </option>
                                    ))}
                                </select>

                                <label className="form-label">Add Note (Optional)</label>
                                <textarea
                                    className="folder-note"
                                    placeholder="Write a note about this paper..."
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                />

                                <div className="modal-actions">
                                    <button className="save-btn" onClick={save}>
                                        Save
                                    </button>
                                    <button className="create-folder-toggle-btn" onClick={() => setCreateMode(true)}>
                                        + Create Folder
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
                {!createMode && (
                    <div className="modal-footer" style={{ borderTop: '1px solid #f1f5f9', marginTop: '16px', paddingTop: '16px' }}>
                        <button className="cancel-btn" onClick={close} style={{ width: '100%' }}>
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}