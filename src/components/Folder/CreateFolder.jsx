import { useState } from "react";
import bookmarkService from "../../Services/bookmarkService";
import "./CreateFolder.css";

export default function CreateFolder({ close, onCreated }) {

    const [name, setName] = useState("");

    const create = async () => {

        if (!name.trim())
            return;

        try {

            const res =
                await bookmarkService.createFolder(name);

            onCreated(res.data.result);

        } catch (err) {
            console.log(err);
        }

    };


    return (
        <div className="create-folder-overlay">

            <div className="create-folder-box">

                <h2>
                    New Folder
                </h2>


                <input
                    className="create-folder-input"
                    placeholder="Folder name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />


                <div className="create-folder-actions">

                    <button
                        className="create-folder-cancel"
                        onClick={close}
                    >
                        Cancel
                    </button>


                    <button
                        className="create-folder-submit"
                        onClick={create}
                    >
                        Create
                    </button>

                </div>

            </div>

        </div>
    )

}