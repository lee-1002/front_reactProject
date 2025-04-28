import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
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
  top: 58%;
  left: 50%;
  width: 60%;
  height: 100%;
  transform: translate(-50%, -50%);
  opacity: 0.5;
  pointer-events: none;
`;

const TableWrapper = styled.div`
  width: 700px;
  margin: auto;
  padding: 30px 0;
  min-height: 600px;

  @media (max-width: 768px) {
    width: 95%;
    padding: 20px 0;
  }
`;

const ScrollContainer = styled.div`
  height: 600px;
  overflow-y: auto;
  padding-right: 10px;
`;

const StyledTable = styled.table`
  border-collapse: collapse;
  margin: auto;
  width: 100%;
  table-layout: fixed;
  background-color: rgba(255, 255, 255, 0.9);

  @media (max-width: 768px) {
    border: none;
  }
`;

const StyledThead = styled.thead`
  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledTr = styled.tr`
  @media (max-width: 768px) {
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid #ccc;
    margin-bottom: 10px;
    padding: 10px;
    flex-wrap: nowrap;
    gap: 10px;
  }
`;

const StyledTd = styled.td`
  position: relative;
  padding: 10px;
  text-align: center;
  word-break: break-word;

  @media (min-width: 769px) {
    &:nth-child(2) {
      text-align: left;
    }
  }

  @media (max-width: 768px) {
    display: inline-block;
    padding: 5px 8px;
    font-size: 14px;
    text-align: left;

    &:nth-child(1) {
      min-width: 40px;
      font-weight: bold;
    }

    &:nth-child(2) {
      min-width: 120px;
    }

    &:nth-child(3) {
      flex: 1;
      min-width: 100px;
    }
  }
`;

const AreaBar = styled.div`
  background-color: rgba(150, 150, 150, 0.5);
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
`;

const AreaRank = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const loaderRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const countriesPerPage = 20;

  useEffect(() => {
    fetch()
      .then((res) => res.json())
      .then((data) => {
        const sorted = data
          .map((country) => ({
            name: country.translations?.kor?.common || country.name.common,
            englishName: country.name.common,
            area: country.area,
            flag: country.flags?.png,
          }))
          .sort((a, b) => b.area - a.area);
        setAllCountries(sorted);
        setCountries(sorted.slice(0, countriesPerPage));
        setLoading(false);
      })
      .catch((error) => {
        console.error("데이터 가져오기 실패", error);
        setLoading(false);
      });
  }, []);

  const filteredCountries = useMemo(() => {
    return allCountries.filter((country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allCountries]);

  const maxArea = useMemo(() => {
    return allCountries.length > 0
      ? Math.max(...allCountries.map((c) => c.area))
      : 1;
  }, [allCountries]);

  useEffect(() => {
    setPage(1);
    setCountries(filteredCountries.slice(0, countriesPerPage));
    setHasMore(filteredCountries.length > countriesPerPage);
  }, [searchQuery, filteredCountries]);

  useEffect(() => {
    if (page === 1 || filteredCountries.length === 0) return;

    const start = (page - 1) * countriesPerPage;
    const end = page * countriesPerPage;
    const newCountries = filteredCountries.slice(start, end);

    setCountries((prev) => [...prev, ...newCountries]);

    if (newCountries.length < countriesPerPage) {
      setHasMore(false);
    }
  }, [page, filteredCountries]);

  const handleScrollIntersection = (entries) => {
    const entry = entries[0];
    if (entry.isIntersecting && hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const observer = new IntersectionObserver(handleScrollIntersection, {
      root: scrollContainerRef.current,
      rootMargin: "100px",
      threshold: 1.0,
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, loading]);

  const rowRenderer = useMemo(() => {
    return (index) => {
      const country = countries[index];
      if (!country) return null;

      const originalRank =
        allCountries.findIndex((c) => c.name === country.name) + 1;

      const widthPercent = (country.area / maxArea) * 100;

      return (
        <StyledTr key={country.name}>
          <StyledTd>{originalRank}</StyledTd>
          <StyledTd>
            <img
              src={country.flag}
              alt={`${country.name} flag`}
              width="35"
              style={{ verticalAlign: "middle", marginRight: "8px" }}
            />
            <Link
              to={`/areas/description/${country.englishName.toLowerCase()}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              {country.name}
            </Link>
          </StyledTd>
          <StyledTd style={{ position: "relative" }}>
            <AreaBar style={{ width: `${widthPercent}%` }} />
            <span style={{ position: "relative", zIndex: 1 }}>
              {country.area.toLocaleString()} km²
            </span>
          </StyledTd>
        </StyledTr>
      );
    };
  }, [countries, maxArea, allCountries]);

  const renderRows = useMemo(() => {
    return countries.map((_, index) => rowRenderer(index));
  }, [countries, rowRenderer]);

  return (
    <>
      <BackgroundWrapper>
        <BackgroundImage src="" alt="background" />
      </BackgroundWrapper>
      <div>
        <h2 style={{ textAlign: "center", fontSize: "40px", margin: "10px 0" }}>
          나라별 면적 순위
        </h2>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="나라를 검색하세요"
            style={{
              padding: "10px",
              width: "300px",
              fontSize: "16px",
              marginTop: "20px",
            }}
          />
        </div>
        {loading ? (
          <p style={{ textAlign: "center" }}>로딩 중...</p>
        ) : (
          <TableWrapper>
            <ScrollContainer ref={scrollContainerRef}>
              <StyledTable border="1" cellPadding="10">
                <StyledThead>
                  <tr>
                    <th style={{ width: "40px", textAlign: "center" }}>순위</th>
                    <th style={{ width: "233px" }}>국가</th>
                    <th>면적 (km²)</th>
                  </tr>
                </StyledThead>
                <tbody>{renderRows}</tbody>
              </StyledTable>
              {hasMore && (
                <div
                  ref={loaderRef}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  <p>로딩 중...</p>
                </div>
              )}
              {!hasMore && <p style={{ textAlign: "center" }}>끝</p>}
            </ScrollContainer>
          </TableWrapper>
        )}
      </div>
    </>
  );
};

export default React.memo(AreaRank);
