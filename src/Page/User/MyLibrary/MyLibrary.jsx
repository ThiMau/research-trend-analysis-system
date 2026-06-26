import "./MyLibrary.css";
import { useEffect, useState } from "react";
import axiosClient from "../../../Api/axiosClient";

export default function MyLibrary() {
  const [papers, setPapers] = useState([]);

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const res = await axiosClient.get("/api/member/papers");

      const list = res.data?.result?.content || [];
      setPapers(list);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="library-page">
      <div className="library-top">
        <input
          type="text"
          placeholder="Search publications..."
          className="library-search"
        />

        <button className="new-folder-btn">
          + New Folder
        </button>
      </div>

      <div className="library-content">

        {/* LEFT */}

        <div className="library-sidebar">

          <h4>COLLECTIONS</h4>

          <div className="collection active">
            Bio-Ethics
            <span>{papers.length}</span>
          </div>

          <div className="collection">
            Neural Networks
            <span>0</span>
          </div>

          <div className="collection">
            Genetic Algorithms
            <span>0</span>
          </div>

          <div className="collection">
            Climate Models
            <span>0</span>
          </div>

        </div>

        {/* RIGHT */}

        <div className="library-main">

          <div className="library-header">

            <div>
              <h2>Bio-Ethics Collection</h2>
              <p>
                Curated research on algorithmic bias and medical AI ethics.
              </p>
            </div>

          </div>

          <table className="library-table">

            <thead>
              <tr>
                <th>TITLE & ABSTRACT</th>
                <th>METADATA</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>

              {papers.map((paper) => (
                <tr key={paper.paperId}>

                  <td>
                    <h4>{paper.title}</h4>

                    <p>
                      {paper.paperAbstract?.slice(0, 120)}
                      ...
                    </p>
                  </td>

                  <td>
                    <div className="meta">

                      <span>
                        {paper.authors?.[0]?.fullName}
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
                    <button className="action-btn">
                      View
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

          <div className="library-stats">

            <div className="stat-card">
              <span>READING PROGRESS</span>
              <h3>68%</h3>

              <div className="progress">
                <div className="progress-fill"></div>
              </div>
            </div>

            <div className="stat-card">
              <span>ANNOTATIONS</span>
              <h3>42</h3>
              <p>+2 since yesterday</p>
            </div>

            <div className="stat-card">
              <span>TREND ALIGNMENT</span>
              <h3>High</h3>
              <p>9/12 papers on peak growth</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}