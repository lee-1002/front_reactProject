import React, { useState, useEffect } from "react";
import { LuThumbsDown, LuThumbsUp } from "react-icons/lu";
import styled from "styled-components";

const BackgroundWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const BackgroundImage = styled.img`
  position: absolute;
  top: 60%;
  left: 50%;
  width: auto;
  height: 100%;
  transform: translate(-50%, -50%);
  opacity: 0.2;
  pointer-events: none;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1000;
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
`;

const MenuWrapper = styled.div`
  position: relative;
  z-index: 1000;
  margin-bottom: 20px;
`;

const StarReview = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetch()
      .then((res) => res.json())
      .then((data) => {
        const countryNames = data.map((country) => country.name.common);
        setCountries(countryNames.sort());
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  const handleSubmit = () => {
    if (rating === 0 || comment.trim() === "") {
      alert("별점을 선택하고 리뷰를 작성해주세요.");
      return;
    }
    if (selectedCountry === "") {
      alert("나라를 선택해주세요.");
      return;
    }

    setReviews((prev) => [
      ...prev,
      {
        rating,
        comment,
        date: new Date().toLocaleDateString(),
        likes: 0,
        dislikes: 0,
        country: selectedCountry,
      },
    ]);
    setRating(0);
    setComment("");
    setSelectedCountry("");
  };

  const handleLike = (index) => {
    setReviews((prev) =>
      prev.map((r, i) => (i === index ? { ...r, likes: r.likes + 1 } : r))
    );
  };

  const handleDislike = (index) => {
    setReviews((prev) =>
      prev.map((r, i) => (i === index ? { ...r, dislikes: r.dislikes + 1 } : r))
    );
  };

  const handleEdit = (index) => {
    const reviewToEdit = reviews[index];
    setRating(reviewToEdit.rating);
    setComment(reviewToEdit.comment);
    setSelectedCountry(reviewToEdit.country);
    setReviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDelete = (index) => {
    setReviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <BackgroundWrapper>
        <BackgroundImage
          // src=
          alt="background"
        />
      </BackgroundWrapper>

      <ContentWrapper>
        <MenuWrapper>
          <p
            style={{
              fontSize: "30px",
              textAlign: "center",
              marginBottom: "40px",
              fontWeight: "bold",
              zIndex: "-1",
              position: "relative",
            }}
          >
            나라에 대해 아는 정보나 여행 후기 등을 남겨주세요!
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
              width: "100%",
            }}
          >
            <div style={{ fontSize: "30px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{
                    cursor: "pointer",
                    color:
                      (hoverRating || rating) >= star ? "#FFD700" : "black",
                  }}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ★
                </span>
              ))}
            </div>

            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              style={{
                fontSize: "16px",
                padding: "0px",
                borderRadius: "4px",
                width: "20%",
                marginLeft: "10px",
                marginTop: "10px",
                height: "30px",
              }}
            >
              <option value="">나라 선택</option>
              {countries.sort().map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <textarea
            placeholder="선택한 나라에 대한 생각을 작성해주세요"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            rows={4}
            style={{
              width: "97%",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "10px",
              resize: "none",
              fontSize: "14px",
              boxShadow: "0 0 50px rgba(0,0,0,0.5)",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "10px",
            }}
          >
            <button
              onClick={handleSubmit}
              style={{
                backgroundColor: "black",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                height: "38px",
                zIndex: 1,
              }}
            >
              등록
            </button>
          </div>

          <h3 style={{ fontSize: "30px" }}>목록</h3>
          <div
            style={{
              maxWidth: "700px",
              margin: "0px auto",
              background: "#fff",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 0 50px rgba(0,0,0,0.5)",
            }}
          >
            {reviews.length === 0 ? (
              <p>등록된 리뷰가 없습니다.</p>
            ) : (
              reviews.map((r, i) => (
                <div
                  key={i}
                  style={{
                    borderBottom: "1px solid gray",
                    padding: "10px 0",
                    marginBottom: "0px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "20px",
                      color: "#FFD700",
                    }}
                  >
                    <div>
                      {"★".repeat(r.rating)}
                      {"☆".repeat(5 - r.rating)}
                    </div>
                    <small
                      style={{
                        color: "#888",
                        fontSize: "15px",
                      }}
                    >
                      {r.country}
                    </small>
                  </div>

                  <p style={{ margin: "5px 0" }}>{r.comment}</p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "#555",
                    }}
                  >
                    <p style={{ margin: "2px 0 0 0", fontSize: "12px" }}>
                      {r.date}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "12px",
                        marginTop: "0px",
                      }}
                    >
                      <div
                        onClick={() => handleEdit(i)}
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span>수정</span>
                      </div>
                      <div
                        onClick={() => handleDelete(i)}
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span>삭제</span>
                      </div>
                      <div
                        onClick={() => handleLike(i)}
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span>
                          <LuThumbsUp />
                        </span>
                        <span>{r.likes}</span>
                      </div>
                      <div
                        onClick={() => handleDislike(i)}
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span>
                          <LuThumbsDown />
                        </span>
                        <span>{r.dislikes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </MenuWrapper>
      </ContentWrapper>
    </>
  );
};

export default StarReview;
