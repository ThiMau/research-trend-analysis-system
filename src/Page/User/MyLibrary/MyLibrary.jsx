import "./MyLibrary.css";
import {useState} from "react";
import Folder from "../../../components/Folder/Folder";

export default function MyLibrary(){

const [papers,setPapers]=useState([]);
const [selectedFolder,setSelectedFolder]=useState(null);

const handleFolderChange=(folder,paperList)=>{
setSelectedFolder(folder);
setPapers(paperList);
};

return(
<div className="library-page">

<div className="library-top">
<input
type="text"
placeholder="Search in current folder..."
className="library-search"
/>
</div>

<div className="library-content">

<Folder
onFolderChange={handleFolderChange}
/>

<div className="library-main">

<div className="library-header">

<div>
<h2>{selectedFolder?.folderName||"My Library"}</h2>
<p>{papers.length} saved papers</p>
</div>

</div>

<table className="library-table">

<thead>

<tr>
<th>TITLE & ABSTRACT</th>
<th>METADATA</th>
<th>NOTE</th>
<th>ACTIONS</th>
</tr>

</thead>

<tbody>

{papers.length===0?(
<tr>
<td colSpan="4" style={{textAlign:"center",padding:"40px"}}>
No papers in this folder.
</td>
</tr>
):(

papers.map((paper)=>(

<tr key={paper.bookmarkId}>

<td>
<h4>{paper.title}</h4>
<p>{paper.paperAbstract?.slice(0,120)}...</p>
</td>

<td>
<div className="meta">
<span>{paper.authors?.[0]?.fullName}</span>
<span>{paper.publicationYear}</span>
<span>{paper.journalName}</span>
</div>
</td>

<td>
{paper.note||"-"}
</td>

<td>

<button
className="action-btn"
>
Edit Note
</button>

<button
className="action-btn"
style={{marginLeft:8}}
>
Remove
</button>

</td>

</tr>

))

)}

</tbody>

</table>

</div>

</div>

</div>
);

}