import React, { useEffect, useState } from "react";

const superstitions = [
  {
    country: "한국",
    superstition: "밤에 거울을 보면 귀신이 나온다는 미신이 있다",
    keyword: "거울",
  },
  {
    country: "미국",
    superstition: "검은 고양이가 지나가면 불운이 온다고 한다",
    keyword: "고양이",
  },
  {
    country: "중국",
    superstition: "13은 불운의 숫자이다",
    keyword: "13",
  },
  {
    country: "중국",
    superstition: "신발은 사악함과 발음이 같아서 부정적인 의미를 가진다",
    keyword: "신발",
  },
  {
    country: "인도",
    superstition: "첫 번째 발걸음은 왼발로 시작해야 한다",
    keyword: "왼발",
  },
];

const Home = () => {
  const [index, setIndex] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const [answerOptions, setAnswerOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  const currentItem = superstitions[index];
  const correctKeyword = currentItem.keyword;

  const formattedSuperstition = currentItem.superstition.replace(
    new RegExp(correctKeyword, "g"),
    "?"
  );

  const generateKeywords = () => {
    const keywords = new Set([correctKeyword]);

    if (Number(correctKeyword)) {
      const correctNum = parseInt(correctKeyword, 10);
      while (keywords.size < 4) {
        const randomOffset = Math.floor(Math.random() * 3) - 1;

        const newKeyword = (correctNum + randomOffset).toString();
        if (newKeyword !== correctKeyword) {
          keywords.add(newKeyword);
        }
      }
    } else {
      while (keywords.size < 4) {
        const random =
          superstitions[Math.floor(Math.random() * superstitions.length)]
            .keyword;
        if (random !== correctKeyword) {
          keywords.add(random);
        }
      }
    }

    return [...keywords].sort(() => Math.random() - 0.5);
  };

  const goToNextQuestion = () => {
    setOpacity(0);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % superstitions.length);
      setSelectedAnswer(null);
      setCorrectAnswer(null);
    }, 1000);
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === correctKeyword;
    setCorrectAnswer(isCorrect);

    if (isCorrect) {
      setTimeout(() => goToNextQuestion(), 2000);
    }
  };

  useEffect(() => {
    setAnswerOptions(generateKeywords());
    setOpacity(0);
    setCorrectAnswer(null);
    setSelectedAnswer(null);

    const fadeIn = setTimeout(() => setOpacity(1), 300);
    return () => clearTimeout(fadeIn);
  }, [index]);

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "50px",
        padding: 0,
        marginLeft: 0,
        marginRight: 0,
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <div
        style={{
          fontSize: "40px",
          fontWeight: "bold",
          opacity,
          transition: "opacity 1s ease",
          marginTop: "150px",
        }}
      >
        <p>
          Q. <strong>{currentItem.country}</strong>에서 {formattedSuperstition}
        </p>
        <p>물음표(?) 안에 들어갈 단어는 무엇일까요?</p>
      </div>

      <div
        style={{
          marginTop: "100px",
          opacity,
          transition: "opacity 1s ease",
        }}
      >
        {answerOptions.map((answer, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(answer)}
            disabled={correctAnswer === true}
            style={{
              padding: "10px 20px",
              margin: "10px",
              fontSize: "30px",
              borderRadius: "8px",
              border: "none",
              backgroundColor:
                selectedAnswer === answer
                  ? answer === correctKeyword
                    ? "green"
                    : "red"
                  : "black",
              color: "white",
              cursor: correctAnswer === true ? "default" : "pointer",
              transition: "background-color 0.3s ease",
            }}
          >
            {answer}
          </button>
        ))}
      </div>

      {correctAnswer === true && (
        <div style={{ marginTop: "20px", fontSize: "30px", color: "green" }}>
          정답입니다!
        </div>
      )}

      {correctAnswer === false && selectedAnswer && (
        <div style={{ marginTop: "20px", fontSize: "30px", color: "red" }}>
          다시 선택해 보세요!
        </div>
      )}
    </div>
  );
};

export default Home;
