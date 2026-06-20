import React, {
  useEffect,
  useState,
} from "react";

import { useParams } from "react-router-dom";

import authService from "../../Services/authService";

import "./JournalDetail.css";

const JournalDetail = () => {
  const { journalId } = useParams();

  const [journal, setJournal] =
    useState(null);

  const [papers, setPapers] = useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data =
        await authService.getJournalWithPapers(
          journalId
        );

      setJournal(data.journal);
      setPapers(data.papers);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div>Loading...</div>;

  return (
    <div className="journal-page">

      <div className="journal-header">

        <h1>{journal.name}</h1>

        <div className="journal-meta">
          <span>
            ISSN: {journal.issn}
          </span>

          <span>
            Publisher:
            {" "}
            {journal.publisher}
          </span>

          <span>
            Status:
            {" "}
            {journal.status}
          </span>
        </div>

      </div>

      <div className="journal-stats">

        <div className="stat-card">
          <h3>
            {papers.length}
          </h3>
          <p>Papers</p>
        </div>

      </div>

      <div className="papers-section">

        <h2>
          Published Papers
        </h2>

        {papers.map((paper) => (
          <div
            key={paper.paperId}
            className="paper-card"
          >
            <h3>{paper.title}</h3>

            <p>
              {paper.paperAbstract?.slice(
                0,
                180
              )}
              ...
            </p>

            <div className="paper-footer">

              <span>
                {paper.publicationYear}
              </span>

              <span>
                Citations:
                {" "}
                {paper.citationCount}
              </span>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default JournalDetail;

/* 2. PaperDetail.jsx

Phải sửa để Journal click được.

import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import authService from "../../Services/authService";

import "./PaperDetail.css";

const PaperDetail = () => {
  const { paperId } = useParams();

  const navigate = useNavigate();

  const [paper, setPaper] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchPaper();
  }, []);

  const fetchPaper = async () => {
    try {
      const data =
        await authService.getPaperDetail(
          paperId
        );

      setPaper(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div>Loading...</div>;

  if (!paper)
    return <div>No Data</div>;

  return (
    <div className="paper-detail-page">

      <span
        className="journal-tag clickable"
        onClick={() =>
          navigate(
            `/journals/${paper.journalId}`
          )
        }
      >
        {paper.journalName}
      </span>

      <h1>{paper.title}</h1>

      <div className="authors">

        {paper.authors?.map(
          (author) => (
            <span
              key={author.authorId}
              className="author-link"
              onClick={() =>
                navigate(
                  `/authors/${author.authorId}`
                )
              }
            >
              {author.fullName}
            </span>
          )
        )}

      </div>

      <p>{paper.paperAbstract}</p>

    </div>
  );
};

export default PaperDetail;
3. JournalDetail.jsx

Sửa để click Paper quay về Paper Detail.

import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import authService from "../../Services/authService";

import "./JournalDetail.css";

const JournalDetail = () => {

  const { journalId } =
    useParams();

  const navigate =
    useNavigate();

  const [journal, setJournal] =
    useState(null);

  const [papers, setPapers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    try {

      const data =
        await authService.getJournalWithPapers(
          journalId
        );

      setJournal(data.journal);
      setPapers(data.papers);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  if (loading)
    return <div>Loading...</div>;

  return (
    <div className="journal-page">

      <div className="journal-header">

        <h1>{journal.name}</h1>

        <p>
          ISSN: {journal.issn}
        </p>

        <p>
          Publisher:
          {" "}
          {journal.publisher}
        </p>

      </div>

      <h2>Published Papers</h2>

      {papers.map((paper) => (

        <div
          key={paper.paperId}
          className="paper-card"
          onClick={() =>
            navigate(
              `/papers/${paper.paperId}`
            )
          }
        >

          <h3>{paper.title}</h3>

          <p>
            {paper.paperAbstract?.slice(
              0,
              150
            )}
            ...
          </p>

        </div>

      ))}

    </div>
  );
};

export default JournalDetail;
4. AuthorDetail.jsx

Nên sửa luôn để Author có danh sách Paper.

<div className="author-papers">

  <h2>Published Papers</h2>

  {author.papers?.map((paper) => (

    <div
      key={paper.paperId}
      className="paper-card"
      onClick={() =>
        navigate(
          `/papers/${paper.paperId}`
        )
      }
    >
      {paper.title}
    </div>

  ))}

</div>
Route cuối cùng
<Route
  path="/papers/:paperId"
  element={<PaperDetail />}
/>

<Route
  path="/journals/:journalId"
  element={<JournalDetail />}
/>

<Route
  path="/authors/:authorId"
  element={<AuthorDetail />}
/>

Nếu backend trả về:

{
  "paperId": 1,
  "title": "...",
  "journalId": 5,
  "journalName": "Nature",
  "authors": [
    {
      "authorId": 10,
      "fullName": "John Smith"
    }
  ]
}

thì toàn bộ luồng:

Search
 ↓
PublicationCard
 ↓
Paper Detail
 ↙        ↘
Journal   Author
 ↓          ↓
Paper     Paper

sẽ hoạt động đầy đủ. Vấn đề duy nhất cần kiểm tra bây giờ là API GET /api/member/papers/{id} có trả về journalId và authors[].authorId hay không. Nếu bạn gửi JSON mẫu của API đó, mình sẽ sửa chính xác 100% theo backend của nhóm bạn.*/