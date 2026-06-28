import {useEffect,useState} from "react";
import {useLocation,useNavigate} from "react-router-dom";
import userService from "../../Services/userService";
import "./Folder.css";

export default function Folder({onFolderChange}){

const navigate=useNavigate();
const location=useLocation();

const pendingPaperId=location.state?.pendingPaperId;
const pendingNote=location.state?.pendingNote||"";

const [folders,setFolders]=useState([]);
const [selectedFolder,setSelectedFolder]=useState(null);

useEffect(()=>{
loadFolders();
},[]);

useEffect(()=>{
if(selectedFolder){
loadPapers(selectedFolder);
}
},[selectedFolder]);

const loadFolders=async()=>{
try{
const res=await userService.getFolders();
const list=res.data.result||[];
setFolders(list);
if(list.length>0){
setSelectedFolder(list[0]);
}
}catch(err){
console.log(err);
}
};

const loadPapers=async(folder)=>{
try{
const res=await userService.getFolderPapers(folder.folderId);
const papers=res.data.result||[];
onFolderChange(folder,papers);
if(pendingPaperId){
await savePendingPaper(folder.folderId);
}
}catch(err){
console.log(err);
}
};

const createFolder=async()=>{
const folderName=prompt("Folder name");
if(!folderName)return;
try{
await userService.createFolder(folderName);
await loadFolders();
}catch(err){
console.log(err);
}
};

const renameFolder=async()=>{
if(!selectedFolder)return;
const folderName=prompt("Folder name",selectedFolder.folderName);
if(!folderName)return;
try{
await userService.updateFolder(selectedFolder.folderId,folderName);
await loadFolders();
}catch(err){
console.log(err);
}
};

const deleteFolder=async()=>{
if(!selectedFolder)return;
if(!window.confirm("Delete folder?"))return;
try{
await userService.deleteFolder(selectedFolder.folderId);
await loadFolders();
}catch(err){
console.log(err);
}
};

const savePendingPaper=async(folderId)=>{
try{
await userService.addPaperToFolder(folderId,pendingPaperId,pendingNote);
navigate("/my-library",{replace:true});
}catch(err){
console.log(err);
}
};

return(
<div className="library-sidebar">

<h4>COLLECTIONS</h4>

<button
className="new-folder-btn"
onClick={createFolder}
>
+ New Folder
</button>

<div className="folder-toolbar">

<button
className="folder-btn secondary"
onClick={renameFolder}
disabled={!selectedFolder}
>
Rename
</button>

<button
className="folder-btn secondary"
onClick={deleteFolder}
disabled={!selectedFolder}
>
Delete
</button>

</div>

<div className="folder-sidebar">

{folders.length===0&&(
<div className="folder-empty">
No Folder
</div>
)}

{folders.map(folder=>(

<div
key={folder.folderId}
className={`folder-item ${
selectedFolder?.folderId===folder.folderId
?"active":""
}`}
onClick={()=>setSelectedFolder(folder)}
>

<span>
{folder.folderName}
</span>

<span className="folder-count">
{folder.totalPapers??0}
</span>

</div>

))}

</div>

</div>
);

}