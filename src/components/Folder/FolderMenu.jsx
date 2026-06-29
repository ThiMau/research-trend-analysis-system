import bookmarkService from "../../Services/bookmarkService";
import "./FolderMenu.css";

export default function FolderMenu({ folder, reload }) {


    const rename = async () => {

        const name =
            prompt(
                "New folder name",
                folder.folderName
            );

        if (!name)
            return;

        await bookmarkService.updateFolder(
            folder.folderId,
            name
        );

        reload();

    };


    const remove = async () => {

        if (!window.confirm("Delete folder?"))
            return;

        await bookmarkService.deleteFolder(
            folder.folderId
        );

        reload();

    };


    return (
        <div className="folder-dropdown">

            <button onClick={rename}>
                Rename
            </button>

            <button onClick={remove}>
                Delete
            </button>

        </div>
    )

}