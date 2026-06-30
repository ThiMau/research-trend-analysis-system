import "./MyLibrary.css";
import { useState } from "react";
import Folder from "../../../components/Folder/Folder";
import bookmarkService from "../../../Services/bookmarkService";

export default function MyLibrary() {

    const [papers, setPapers] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);

    const handleFolderChange = (folder, paperList) => {
        setSelectedFolder(folder);
        setPapers(paperList);
    };

    const handleEditNote = async (paper) => {
        const newNote = window.prompt("Edit Note for: " + paper.title, paper.note || "");
        if (newNote !== null) {
            try {
                await bookmarkService.updateNote(paper.bookmarkId, newNote.trim());
                setPapers(prev => prev.map(p => p.bookmarkId === paper.bookmarkId ? { ...p, note: newNote.trim() } : p));
            } catch (err) {
                console.error(err);
                alert("Failed to update note");
            }
        }
    };

    const handleRemovePaper = async (bookmarkId) => {
        if (window.confirm("Are you sure you want to remove this paper from the folder?")) {
            try {
                await bookmarkService.removeBookmark(bookmarkId);
                setPapers(prev => prev.filter(p => p.bookmarkId !== bookmarkId));
            } catch (err) {
                console.error(err);
                alert("Failed to remove paper");
            }
        }
    };


    return (
        <div className="library-page">

            <div className="library-content">


                <Folder
                    onFolderChange={handleFolderChange}
                />


                <div className="library-main">


                    <div className="library-header">

                        <h2>
                            {selectedFolder?.folderName || "My Library"}
                        </h2>

                        <p>
                            {papers.length} saved papers
                        </p>

                    </div>


                    <table className="library-table">

                        <thead>

                            <tr>

                                <th>
                                    TITLE & ABSTRACT
                                </th>

                                <th>
                                    METADATA
                                </th>

                                <th>
                                    NOTE
                                </th>

                                <th>
                                    ACTIONS
                                </th>

                            </tr>

                        </thead>


                        <tbody>


                            {
                                papers.length === 0 ?

                                    <tr>

                                        <td
                                            colSpan="4"
                                            className="library-empty"
                                        >

                                            No papers in this folder.

                                        </td>

                                    </tr>


                                    :

                                    papers.map(paper => (

                                        <tr key={paper.bookmarkId}>


                                            <td>

                                                <h4>
                                                    {paper.title}
                                                </h4>

                                                <p>
                                                    {paper.paperAbstract?.slice(0, 120)}
                                                    ...
                                                </p>

                                            </td>



                                            <td>

                                                <div className="library-meta">

                                                    <span>
                                                        {paper.authors?.[0]?.fullName || "Unknown"}
                                                    </span>

                                                    <span>
                                                        {paper.publicationYear}
                                                    </span>

                                                    <span>
                                                        {paper.journalName}
                                                    </span>

                                                </div>

                                            </td>



                                            <td>

                                                {paper.note || "-"}

                                            </td>



                                            <td className="library-actions-cell">
                                                <button
                                                    className="library-edit-btn"
                                                    onClick={() => handleEditNote(paper)}
                                                >
                                                    Edit Note
                                                </button>
                                                <button
                                                    className="library-remove-btn"
                                                    onClick={() => handleRemovePaper(paper.bookmarkId)}
                                                >
                                                    Remove
                                                </button>
                                            </td>


                                        </tr>


                                    ))

                            }


                        </tbody>


                    </table>


                </div>


            </div>


        </div>
    )

}