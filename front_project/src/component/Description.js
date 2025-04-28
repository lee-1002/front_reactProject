import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Description = () => {
  const { countryName } = useParams();
  const [wikiInfo, setWikiInfo] = useState(null);
  const [countryInfo, setCountryInfo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim()) {
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}.${
        currentDate.getMonth() + 1
      }.${currentDate.getDate()}`;

      setComments((prev) => [
        ...prev,
        { text: newComment.trim(), isEditing: false, date: formattedDate },
      ]);
      setNewComment("");
    }
  };

  const handleDeleteComment = (index) => {
    setComments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditComment = (index) => {
    setComments((prev) =>
      prev.map((comment, i) =>
        i === index ? { ...comment, isEditing: true } : comment
      )
    );
  };

  const handleSaveComment = (index, newText) => {
    setComments((prev) =>
      prev.map((comment, i) =>
        i === index ? { text: newText.trim(), isEditing: false } : comment
      )
    );
  };

  useEffect(() => {
    fetch()
      .then((res) => res.json())
      .then((data) => setWikiInfo(data))
      .catch((err) => console.error("Wikipedia API Error:", err));

    fetch()
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCountryInfo(data[0]);
        }
      })
      .catch((err) => console.error("REST Countries API Error:", err));
  }, [countryName]);

  return (
    <div
      style={{ maxWidth: "750px", margin: "10px auto 0", paddingTop: "0px" }}
    >
      <h2 style={{ textAlign: "left", marginBottom: "10px", fontSize: "30px" }}>
        {countryName} 정보
      </h2>

      {wikiInfo ? (
        <>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              background: "#f9f9f9",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              marginBottom: "30px",
              gap: "20px",
              justifyContent: "center",
            }}
          >
            {wikiInfo.thumbnail && (
              <img
                src={wikiInfo.thumbnail.source}
                alt={countryName}
                style={{
                  width: "400px",
                  height: "auto",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            )}
            {countryInfo && (
              <div style={{ minWidth: "250px", marginLeft: "35px", flex: "1" }}>
                <h3 style={{ marginBottom: "15px" }}>기본 정보</h3>
                <p>
                  <strong>수도:</strong>{" "}
                  {countryInfo.capital?.[0] || "정보 없음"}
                </p>
                <p>
                  <strong>지역:</strong> {countryInfo.region || "정보 없음"}
                </p>
                <p>
                  <strong>소지역:</strong>{" "}
                  {countryInfo.subregion || "정보 없음"}
                </p>
                <p>
                  <strong>통화:</strong>{" "}
                  {countryInfo.currencies
                    ? Object.values(countryInfo.currencies)
                        .map((curr) => `${curr.name} (${curr.symbol})`)
                        .join(", ")
                    : "정보 없음"}
                </p>
                <p>
                  <strong>언어:</strong>{" "}
                  {countryInfo.languages
                    ? Object.values(countryInfo.languages).join(", ")
                    : "정보 없음"}
                </p>
              </div>
            )}
          </div>
          <h3 style={{ margin: "7px", fontSize: "30px" }}>국가 설명</h3>
          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              padding: "20px",
              margin: "0",
              lineHeight: "1.6",
              boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
            }}
          >
            <p style={{ margin: "0px" }}>{wikiInfo.extract}</p>
          </div>
        </>
      ) : (
        <p>정보를 불러오는 중...</p>
      )}
      <h3 style={{ marginBottom: "10px" }}> 실시간 채팅</h3>

      <textarea
        rows={3}
        style={{
          width: "100%",
          maxWidth: "750px",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #aaa",
          resize: "none",
        }}
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleAddComment();
          }
        }}
        placeholder="이 나라에 관한 정보를 남겨주세요!"
      ></textarea>
      <div style={{ textAlign: "right" }}>
        <button
          onClick={handleAddComment}
          style={{
            marginTop: "10px",
            padding: "8px 16px",
            backgroundColor: "black",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          댓글 등록
        </button>
      </div>

      <ul style={{ marginTop: "20px", listStyle: "none" }}>
        {comments.map((comment, idx) => (
          <li
            key={idx}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
              background: "white",
              padding: "10px",
              borderBottom: "1px solid #ccc",
              borderRight: "1px solid #ccc",
              boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.2)",
              borderRadius: "6px",
            }}
          >
            {comment.isEditing ? (
              <input
                type="text"
                defaultValue={comment.text}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSaveComment(idx, e.target.value);
                  }
                }}
                onBlur={(e) => handleSaveComment(idx, e.target.value)}
                style={{
                  flex: 1,
                  padding: "5px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
                autoFocus
              />
            ) : (
              <>
                <div
                  style={{
                    flex: 1,
                    wordBreak: "break-word",
                    paddingRight: "10px",
                  }}
                >
                  {comment.text}
                </div>
                <div
                  style={{
                    display: "flex",

                    whiteSpace: "nowrap",
                  }}
                >
                  <button
                    onClick={() => handleEditComment(idx)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "black",
                      cursor: "pointer",
                    }}
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteComment(idx)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "red",
                      cursor: "pointer",
                    }}
                  >
                    삭제
                  </button>
                </div>
                <span style={{ fontSize: "12px", color: "#777" }}>
                  {comment.date}
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Description;
